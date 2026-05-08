const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

  // Flutterwave may send transaction data inside payload.data,
  // or directly at the top level depending on the webhook format.
  const data = payload.data || payload;

  console.log('Flutterwave webhook received:', JSON.stringify({
    eventType,
    payloadKeys: Object.keys(payload),
    dataKeys: Object.keys(data || {}),
    status: data.status,
    tx_ref: data.tx_ref,
    id: data.id,
    transaction_id: data.transaction_id
  }));

  if (data?.status !== 'successful' && data?.status !== 'completed') {
    console.log('Webhook skipped because status is not successful:', data?.status);
    return json(200, {
      received: true,
      processed: false,
      reason: 'status_not_successful',
      eventType,
      status: data?.status
    });
  }

  if (!data?.tx_ref || !String(data.tx_ref).startsWith('caster-')) {
    console.log('Webhook skipped because tx_ref is not a Caster Art order:', data?.tx_ref);
    return json(200, {
      received: true,
      processed: false,
      reason: 'not_caster_order',
      eventType,
      tx_ref: data?.tx_ref
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

  if (String(tx.tx_ref) !== String(data.tx_ref)) {
    console.error('Transaction reference mismatch:', {
      webhook: data.tx_ref,
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

  const editionNumber = await assignEditionNumber(
    meta.artwork_id,
    meta.print_size_code
  );

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
    firstName: shippingAddress.name.split(' ')[0] || 'Collector',
    email: shippingAddress.email,
    orderType,
    artworkTitle: order.artworkTitle,
    printSize: order.printSizeLabel
  });

  await triggerCreativeHubFulfillment(order);

  return json(200, {
    received: true,
    processed: true,
    orderReferenceId: order.orderReferenceId,
    editionNumber: order.editionNumber
  });
};

// ─── Flutterwave Verification ────────────────────────────────────────────────
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

// ─── Supabase: Edition Number ────────────────────────────────────────────────
async function assignEditionNumber(artworkId, printSizeCode) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase environment variables are missing');
  }

  const getResp = await fetch(
    `${SUPABASE_URL}/rest/v1/edition_tracking?artwork_id=eq.${encodeURIComponent(
      artworkId
    )}&print_size_code=eq.${encodeURIComponent(printSizeCode)}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!getResp.ok) {
    const body = await getResp.text();
    throw new Error('Could not read edition tracking row: ' + body);
  }

  const rows = await getResp.json();

  if (!rows.length) {
    throw new Error(
      `Edition tracking row not found for ${artworkId} / ${printSizeCode}`
    );
  }

  const currentEdition = Number(rows[0].current_edition || 0);
  const nextEdition = currentEdition + 1;

  if (nextEdition > 25) {
    throw new Error(`Edition sold out for ${artworkId} / ${printSizeCode}`);
  }

  const patchResp = await fetch(
    `${SUPABASE_URL}/rest/v1/edition_tracking?artwork_id=eq.${encodeURIComponent(
      artworkId
    )}&print_size_code=eq.${encodeURIComponent(printSizeCode)}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        current_edition: nextEdition
      })
    }
  );

  if (!patchResp.ok) {
    const body = await patchResp.text();
    throw new Error('Could not update edition number: ' + body);
  }

  return nextEdition;
}

// ─── Supabase: Save Order ────────────────────────────────────────────────────
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

// ─── Brevo ───────────────────────────────────────────────────────────────────
async function addBuyerToBrevo({
  firstName,
  email,
  orderType,
  artworkTitle,
  printSize
}) {
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
      console.error('Brevo request failed:', body);
    }
  } catch (err) {
    console.error('Brevo error:', err);
  }
}

// ─── CreativeHub Placeholder ─────────────────────────────────────────────────
async function triggerCreativeHubFulfillment(order) {
  const apiKey = process.env.CREATIVEHUB_API_KEY;

  if (!apiKey) {
    console.log(
      'CreativeHub not yet configured. Full order details:',
      JSON.stringify(order)
    );
    return;
  }

  // CreativeHub API call goes here after we confirm the exact endpoint and payload.
  console.log('CreativeHub API key found. Order ready:', JSON.stringify(order));
}

// ─── Response Helper ─────────────────────────────────────────────────────────
function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  };
}
