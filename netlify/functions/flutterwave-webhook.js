const SUPABASE_URL = normaliseSupabaseUrl(process.env.SUPABASE_URL);
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const CREATIVEHUB_BASE_URL = process.env.CREATIVEHUB_BASE_URL || 'https://api.creativehub.io';
let creativeHubCountriesCache = null;
let creativeHubCountriesCacheTime = 0;
const CREATIVEHUB_COUNTRIES_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

const EXPECTED_PRINT_PRICES = {
  A4: { amount: 80, currency: 'USD' },
  A3: { amount: 130, currency: 'USD' },
  A2: { amount: 220, currency: 'USD' }
};

const CREATIVEHUB_PRODUCTS = {
  grey: {
    A4: { sku: '38031-7370', productId: 38031, printOptionId: 7370 },
    A3: { sku: '7484125-2326381', productId: 7484125, printOptionId: 2326381 },
    A2: { sku: '7484125-2326352', productId: 7484125, printOptionId: 2326352 }
  },
  serenity: {
    A4: { sku: '9952498-4180109', productId: 9952498, printOptionId: 4180109 },
    A3: { sku: '9952498-4180108', productId: 9952498, printOptionId: 4180108 },
    A2: { sku: '9952498-4180107', productId: 9952498, printOptionId: 4180107 }
  },
  ayaba: {
    A4: { sku: '9952530-4180112', productId: 9952530, printOptionId: 4180112 },
    A3: { sku: '9952530-4180111', productId: 9952530, printOptionId: 4180111 },
    A2: { sku: '9952530-4180110', productId: 9952530, printOptionId: 4180110 }
  }
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  const secret = process.env.FLW_WEBHOOK_SECRET;
  if (!secret) {
    return json(501, { error: 'Webhook secret not configured' });
  }

  const signature = event.headers['verif-hash'];
  if (!signature || signature !== secret) {
    return json(401, { error: 'Invalid signature' });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const eventType = payload.event || payload.type || payload['event.type'] || 'unknown';
  const data = payload.data || payload;

  console.log('Flutterwave webhook received:', JSON.stringify({
    eventType,
    status: data.status,
    tx_ref: data.tx_ref,
    txRef: data.txRef,
    id: data.id,
    transaction_id: data.transaction_id
  }));

  if (data?.status !== 'successful' && data?.status !== 'completed') {
    return json(200, {
      received: true,
      processed: false,
      reason: 'status_not_successful',
      eventType,
      status: data?.status
    });
  }

  const webhookTxRef = data.tx_ref || data.txRef;
  if (!webhookTxRef || !String(webhookTxRef).startsWith('caster-')) {
    return json(200, {
      received: true,
      processed: false,
      reason: 'not_caster_order',
      eventType,
      tx_ref: webhookTxRef
    });
  }

  const existingOrder = await getExistingOrderByReference(webhookTxRef);
  if (existingOrder) {
    console.log('Duplicate webhook skipped. Order already exists:', webhookTxRef);
    return json(200, {
      received: true,
      processed: true,
      duplicate: true,
      orderReferenceId: webhookTxRef
    });
  }

  const transactionId = data.id || data.transaction_id;
  if (!transactionId) {
    console.error('No transaction ID found in Flutterwave webhook:', JSON.stringify(payload));
    return json(200, {
      received: true,
      processed: false,
      reason: 'missing_transaction_id'
    });
  }

  const verified = await verifyFlutterwaveTransaction(transactionId);
  if (!verified.ok) {
    console.error('Flutterwave verification failed:', verified);
    return json(200, {
      received: true,
      processed: false,
      reason: 'verification_failed'
    });
  }

  const tx = verified.transaction;

  if (String(tx.tx_ref) !== String(webhookTxRef)) {
    console.error('Transaction reference mismatch:', {
      webhook: webhookTxRef,
      verified: tx.tx_ref
    });

    return json(200, {
      received: true,
      processed: false,
      reason: 'tx_ref_mismatch'
    });
  }

  if (tx.status !== 'successful') {
    return json(200, {
      received: true,
      processed: false,
      reason: 'not_successful'
    });
  }

  const meta = tx.meta || data.meta || {};
  const customer = tx.customer || data.customer || {};
  const orderType = meta.order_type || 'unknown';

  if (orderType !== 'print') {
    return json(200, {
      received: true,
      processed: false,
      reason: 'not_print_order'
    });
  }

  const shippingAddress = {
    name: meta.shipping_name || customer.name || '',
    email: meta.shipping_email || customer.email || '',
    phone: meta.shipping_phone || customer.phone_number || '',
    street: meta.shipping_street || '',
    city: meta.shipping_city || '',
    state: meta.shipping_state || '',
    postal: meta.shipping_postal || '',
    country: meta.shipping_country || ''
  };

  if (!meta.artwork_id || !meta.print_size_code || !shippingAddress.email) {
    console.error('Missing required fulfillment data:', { meta, shippingAddress });
    return json(200, {
      received: true,
      processed: false,
      reason: 'missing_required_fulfillment_data'
    });
  }

  const amountCheck = verifyExpectedPaymentAmount(tx, meta.print_size_code);
  if (!amountCheck.ok) {
    console.error('Payment amount verification failed:', amountCheck);
    return json(200, {
      received: true,
      processed: false,
      reason: 'amount_verification_failed',
      expected: amountCheck.expected,
      actual: amountCheck.actual
    });
  }

  let editionNumber;
  try {
    editionNumber = await assignEditionNumber(meta.artwork_id, meta.print_size_code);
  } catch (error) {
    console.error('Edition claim failed after payment. Manual attention needed:', error);
    return json(200, {
      received: true,
      processed: false,
      reason: 'edition_claim_failed_manual_attention_needed'
    });
  }

  const order = {
    orderReferenceId: tx.tx_ref,
    flutterwaveTransactionId: tx.id,
    orderType,

    artworkId: meta.artwork_id || '',
    artworkSku: meta.artwork_sku || meta.artwork_id || '',
    artworkTitle: meta.artwork_title || '',

    printSizeCode: meta.print_size_code || '',
    printSizeLabel: meta.print_size || '',

    editionNumber,

    amount: tx.amount,
    currency: tx.currency,

    customer: {
      name: shippingAddress.name,
      email: shippingAddress.email,
      phone: shippingAddress.phone
    },

    shipping: shippingAddress
  };

  await saveOrder(order);

  await addBuyerToBrevo({
    firstName: getFirstName(shippingAddress.name),
    email: shippingAddress.email,
    orderType,
    artworkTitle: order.artworkTitle,
    printSize: order.printSizeLabel
  });

  await sendCollectorConfirmationEmail(order);

  try {
    const creativeHubResult = await triggerCreativeHubFulfillment(order);
    await updateOrderFulfillment(order.orderReferenceId, {
      fulfillmentStatus: 'creativehub_submitted',
      creativehubOrderId: creativeHubResult.creativehubOrderId || ''
    });

    return json(200, {
      received: true,
      processed: true,
      orderReferenceId: order.orderReferenceId,
      editionNumber: order.editionNumber,
      creativehubOrderId: creativeHubResult.creativehubOrderId || null
    });
 } catch (error) {
    console.error('CreativeHub fulfillment failed — MESSAGE:', error && error.message ? error.message : String(error));
    console.error('CreativeHub fulfillment failed — STACK:', error && error.stack ? error.stack : 'no stack');
    await updateOrderFulfillment(order.orderReferenceId, {
      fulfillmentStatus: 'creativehub_failed'
    });

    return json(200, {
      received: true,
      processed: true,
      orderReferenceId: order.orderReferenceId,
      editionNumber: order.editionNumber,
      creativehub: 'failed_manual_attention_needed'
    });
  }
};

function verifyExpectedPaymentAmount(tx, printSizeCode) {
  const expected = EXPECTED_PRINT_PRICES[printSizeCode];
  const actualAmount = Number(tx.amount);
  const actualCurrency = String(tx.currency || '').toUpperCase();

  if (!expected) {
    return {
      ok: false,
      expected: null,
      actual: { amount: actualAmount, currency: actualCurrency },
      error: 'Unknown print size code'
    };
  }

  const expectedCurrency = String(expected.currency).toUpperCase();
  return {
   ok: actualAmount >= Number(expected.amount) && actualCurrency === expectedCurrency,
   expected: { amount: Number(expected.amount), currency: expectedCurrency },
   actual: { amount: actualAmount, currency: actualCurrency }
  };
}

async function verifyFlutterwaveTransaction(transactionId) {
  const secretKey = process.env.FLW_SECRET_KEY;

  if (!secretKey || !transactionId) {
    return { ok: false, error: 'Missing FLW_SECRET_KEY or transaction ID' };
  }

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const result = await response.json();

    if (!response.ok || result.status !== 'success' || !result.data) {
      return {
        ok: false,
        error: 'Verification request failed',
        details: result
      };
    }

    return {
      ok: true,
      transaction: result.data
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
}

async function getExistingOrderByReference(orderReferenceId) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !orderReferenceId) return null;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?order_reference_id=eq.${encodeURIComponent(orderReferenceId)}&select=id,order_reference_id,edition_number,fulfillment_status`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) return null;

  const rows = await response.json();
  return rows[0] || null;
}

async function assignEditionNumber(artworkId, printSizeCode) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase environment variables are missing');
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/claim_edition_number`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      p_artwork_id: artworkId,
      p_print_size_code: printSizeCode
    })
  });

  const text = await response.text();
  const result = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    throw new Error('Could not claim edition number: ' + (typeof result === 'string' ? result : JSON.stringify(result)));
  }

  const editionNumber = Array.isArray(result) ? result[0] : result;
  const numericEdition = Number(editionNumber);

  if (!numericEdition || numericEdition < 1 || numericEdition > 25) {
    throw new Error('Invalid edition number returned from Supabase: ' + JSON.stringify(result));
  }

  return numericEdition;
}

async function saveOrder(order) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase environment variables are missing');
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      order_reference_id: order.orderReferenceId,
      flutterwave_transaction_id: String(order.flutterwaveTransactionId),

      order_type: order.orderType,

      artwork_id: order.artworkId,
      artwork_sku: order.artworkSku,
      artwork_title: order.artworkTitle,

      print_size_code: order.printSizeCode,
      print_size_label: order.printSizeLabel,

      edition_number: order.editionNumber,

      amount: order.amount,
      currency: order.currency,

      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,

      shipping_street: order.shipping.street,
      shipping_city: order.shipping.city,
      shipping_state: order.shipping.state,
      shipping_postal: order.shipping.postal,
      shipping_country: order.shipping.country,

      payment_status: 'paid',
      fulfillment_status: 'pending'
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error('Could not save order: ' + body);
  }
}

async function updateOrderFulfillment(orderReferenceId, { fulfillmentStatus, creativehubOrderId }) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !orderReferenceId) return;

  const updates = {};
  if (fulfillmentStatus) updates.fulfillment_status = fulfillmentStatus;
  if (creativehubOrderId) updates.creativehub_order_id = String(creativehubOrderId);

  if (!Object.keys(updates).length) return;

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/orders?order_reference_id=eq.${encodeURIComponent(orderReferenceId)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(updates)
    }
  );

  if (!response.ok) {
    const body = await response.text();
    console.error('Could not update order fulfillment status:', body);
  }
}

async function addBuyerToBrevo({ firstName, email, orderType, artworkTitle, printSize }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !email) return;

  const listId =
    orderType === 'print'
      ? Number(process.env.BREVO_PRINT_BUYERS_LIST_ID)
      : Number(process.env.BREVO_ORIGINALS_LIST_ID);

  if (!listId) return;

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email,
        attributes: {
          FIRSTNAME: firstName,
          SOURCE: orderType === 'print' ? 'print_buyer' : 'originals_buyer',
          LAST_ARTWORK: artworkTitle,
          LAST_PRINT_SIZE: printSize
        },
        listIds: [listId],
        updateEnabled: true
      })
    });

    if (!response.ok && response.status !== 204) {
      const body = await response.text();
      console.error('Brevo contact request failed:', body);
    }
  } catch (err) {
    console.error('Brevo contact error:', err);
  }
}

async function sendCollectorConfirmationEmail(order) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'info@casterart.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'Caster Art';

  if (!apiKey || !order?.customer?.email) return;

  const subject = 'Your Caster Art Order Has Been Received';
  const htmlContent = buildCollectorConfirmationHtml(order);
  const textContent = buildCollectorConfirmationText(order);

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: order.customer.email,
            name: order.customer.name || 'Collector'
          }
        ],
        subject,
        htmlContent,
        textContent
      })
    });

    if (!response.ok && response.status !== 201) {
      const body = await response.text();
      console.error('Brevo confirmation email failed:', body);
    }
  } catch (error) {
    console.error('Brevo confirmation email error:', error);
    await sendAdminAlert(order, error);
  }
}

function buildCollectorConfirmationHtml(order) {
  const artworkTitle = escapeHtml(order.artworkTitle);
  const printSize = escapeHtml(order.printSizeLabel);
  const orderReference = escapeHtml(order.orderReferenceId);
  const editionNumber = escapeHtml(String(order.editionNumber));

  return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f0ebe4;color:#080706;font-family:Georgia,'Times New Roman',serif;">
    <div style="max-width:640px;margin:0 auto;padding:42px 22px;">
      <div style="background:#080706;color:#f0ebe4;padding:38px 32px;border:1px solid rgba(201,169,110,0.35);">
        <div style="text-align:center;margin-bottom:34px;">
          <img src="https://casterart.com/assets/images/flutterwave-logo.png" alt="Caster Art" style="max-width:140px;height:auto;margin:0 auto 22px;display:block;">
          <div style="font-family:Arial,sans-serif;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#c9a96e;">Order Received</div>
        </div>

        <h1 style="font-weight:400;font-size:30px;line-height:1.15;margin:0 0 24px;text-align:center;color:#f0ebe4;">Thank you for collecting “${artworkTitle}”.</h1>

        <p style="font-family:Arial,sans-serif;font-size:14px;line-height:1.85;color:rgba(240,235,228,0.72);margin:0 0 26px;text-align:center;">
          Your order has been successfully received and is now being prepared for production.
        </p>

        <div style="border-top:1px solid rgba(240,235,228,0.12);border-bottom:1px solid rgba(240,235,228,0.12);padding:22px 0;margin:28px 0;">
          ${emailRow('Order Reference', orderReference)}
          ${emailRow('Print', artworkTitle + ' — ' + printSize)}
          ${emailRow('Edition Number', editionNumber + ' / 25')}
        </div>

        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.8;color:rgba(240,235,228,0.68);margin:0 0 28px;text-align:center;">
          You will receive tracking information once your print has been dispatched.
        </p>

        <p style="font-family:Arial,sans-serif;font-size:13px;line-height:1.8;color:rgba(240,235,228,0.68);margin:0 0 6px;text-align:center;">
          Thank you again for supporting my work.
        </p>

        <p style="font-size:18px;line-height:1.4;color:#c9a96e;margin:26px 0 0;text-align:center;">
          With gratitude,<br>Abraham Caster
        </p>
      </div>
    </div>
  </body>
</html>`;
}

function emailRow(label, value) {
  return `
    <div style="display:block;margin-bottom:14px;">
      <div style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#c9a96e;margin-bottom:5px;">${label}</div>
      <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#f0ebe4;">${value}</div>
    </div>`;
}

function buildCollectorConfirmationText(order) {
  return [
    `Thank you for collecting “${order.artworkTitle}”.`,
    '',
    'Your order has been successfully received and is now being prepared for production.',
    '',
    `Order Reference: ${order.orderReferenceId}`,
    `Print: ${order.artworkTitle} — ${order.printSizeLabel}`,
    `Edition Number: ${order.editionNumber} / 25`,
    '',
    'You will receive tracking information once your print has been dispatched.',
    '',
    'Thank you again for supporting my work.',
    '',
    'With gratitude,',
    'Abraham Caster'
  ].join('\n');
}

async function triggerCreativeHubFulfillment(order) {
  const apiKey = process.env.CREATIVEHUB_API_KEY;
  if (!apiKey) {
    throw new Error('CREATIVEHUB_API_KEY is not configured');
  }

  const item = getCreativeHubItem(order.artworkId, order.printSizeCode);
  const country = await resolveCreativeHubCountry(order.shipping.country);
  const nameParts = splitName(order.customer.name);

  const embryonicPayload = {
    Id: 0,
    ExternalReference: order.orderReferenceId,
    FirstName: nameParts.firstName,
    LastName: nameParts.lastName,
    Email: order.customer.email,
    MessageToLab: `Caster Art print order. Artwork: ${order.artworkTitle}. Size: ${order.printSizeLabel}. Edition: ${order.editionNumber}/25. Flutterwave Ref: ${order.orderReferenceId}`,
    ShippingAddress: {
      FirstName: nameParts.firstName,
      LastName: nameParts.lastName,
      Line1: order.shipping.street,
      Line2: '',
      Town: order.shipping.city,
      County: order.shipping.state,
      PostCode: order.shipping.postal,
      CountryId: country.id,
      CountryCode: country.code,
      CountryName: country.name,
      PhoneNumber: order.customer.phone || ''
    },
    OrderItems: [
      {
        Id: 0,
        ProductId: item.productId,
        PrintOptionId: item.printOptionId,
        Quantity: 1,
        ExternalReference: order.orderReferenceId,
        ExternalSku: item.sku
      }
    ]
  };

  const embryonic = await creativeHubRequest('/api/v1/orders/embryonic', {
    method: 'POST',
    body: embryonicPayload
  });

  const deliveryOptions = embryonic.DeliveryOptions || embryonic.DeliveryOption || [];
  const options = Array.isArray(deliveryOptions) ? deliveryOptions : [deliveryOptions].filter(Boolean);
  const selectedDelivery = options[0];

  if (!embryonic.Id || !selectedDelivery?.Id) {
    throw new Error('CreativeHub embryonic order did not return an order ID and delivery option: ' + JSON.stringify(embryonic));
  }

  const confirmedPayload = {
    OrderId: embryonic.Id,
    DeliveryOptionId: selectedDelivery.Id,
    DeliveryChargeExcludingSalesTax: Number(selectedDelivery.DeliveryChargeExcludingSalesTax || 0),
    DeliveryChargeSalesTax: Number(selectedDelivery.DeliveryChargeSalesTax || 0),
    ExternalReference: order.orderReferenceId
  };

  const confirmed = await creativeHubRequest('/api/v1/orders/confirmed', {
    method: 'POST',
    body: confirmedPayload
  });

  console.log('CreativeHub order confirmed:', JSON.stringify({
    orderReferenceId: order.orderReferenceId,
    creativehubOrderId: confirmed.Id || embryonic.Id,
    deliveryOptionId: selectedDelivery.Id
  }));

  return {
    creativehubOrderId: confirmed.Id || embryonic.Id,
    embryonicOrder: embryonic,
    confirmedOrder: confirmed
  };
}

function getCreativeHubItem(artworkId, printSizeCode) {
  const artwork = CREATIVEHUB_PRODUCTS[artworkId];
  const item = artwork ? artwork[printSizeCode] : null;

  if (!item) {
    throw new Error(`No CreativeHub SKU mapping found for ${artworkId} / ${printSizeCode}`);
  }

  return item;
}

async function resolveCreativeHubCountry(countryInput) {
  const normalized = String(countryInput || '').trim();
  if (!normalized) {
    throw new Error('Shipping country is missing');
  }

  const countries = await getCreativeHubCountries();
  const lower = normalized.toLowerCase();
  const upper = normalized.toUpperCase();

  const match = countries.find((country) => {
    return (
      String(country.Code || '').toUpperCase() === upper ||
      String(country.Name || '').toLowerCase() === lower ||
      String(country.CountryCode || '').toUpperCase() === upper ||
      String(country.CountryName || '').toLowerCase() === lower
    );
  });

  if (!match) {
    throw new Error('CreativeHub does not recognise shipping country: ' + normalized);
  }

  return {
    id: match.Id,
    code: match.Code || match.CountryCode || upper,
    name: match.Name || match.CountryName || normalized
  };
}


async function getCreativeHubCountries() {
  const now = Date.now();
  if (creativeHubCountriesCache && (now - creativeHubCountriesCacheTime) < CREATIVEHUB_COUNTRIES_CACHE_TTL_MS) {
    return creativeHubCountriesCache;
  }

  const response = await creativeHubRequest('/api/v1/countries/query', {
    method: 'POST',
    body: {
      Page: 1,
      PageSize: 300,
      Filter: {},
      Sorts: []
    }
  });

  creativeHubCountriesCache = response.Data || [];
  creativeHubCountriesCacheTime = now;
  return creativeHubCountriesCache;
}

async function creativeHubRequest(path, { method = 'GET', body } = {}) {
  const apiKey = process.env.CREATIVEHUB_API_KEY;
  if (!apiKey) throw new Error('CREATIVEHUB_API_KEY is not configured');

  const url = `${CREATIVEHUB_BASE_URL}${path}`;
  const response = await fetch(url, {
    method,
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `ApiKey ${apiKey}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await response.text();
  const parsed = text ? safeJsonParse(text) : {};

  if (response.ok) return parsed;

  throw new Error(`CreativeHub request failed ${method} ${path}: ${response.status} ${text}`);
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { firstName: 'Collector', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' ')
  };
}

function getFirstName(fullName) {
  return splitName(fullName).firstName || 'Collector';
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normaliseSupabaseUrl(url) {
  if (!url) return '';
  return String(url).trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}

async function sendAdminAlert(order, error) {
  const apiKey = process.env.BREVO_API_KEY;
  const adminEmail = process.env.BREVO_SENDER_EMAIL || 'info@casterart.com';
  if (!apiKey) return;

  try {
    await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: 'Caster Art System', email: adminEmail },
        to: [{ email: adminEmail, name: 'Abraham Caster' }],
        subject: 'ACTION REQUIRED — Confirmation email failed',
        textContent: [
          'A buyer confirmation email failed to send.',
          '',
          'Order Reference: ' + order.orderReferenceId,
          'Customer Email: ' + order.customer.email,
          'Customer Name: ' + order.customer.name,
          'Artwork: ' + order.artworkTitle,
          'Size: ' + order.printSizeLabel,
          'Edition: ' + order.editionNumber + ' / 25',
          '',
          'Error: ' + (error && error.message ? error.message : String(error)),
          '',
          'Please email the customer manually using the details above.'
        ].join('\n')
      })
    });
  } catch (alertError) {
    console.error('Admin alert also failed:', alertError);
  }
}
