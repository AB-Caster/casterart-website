const SUPABASE_URL = normaliseSupabaseUrl(process.env.SUPABASE_URL);
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const EXPECTED_PRINT_PRICES = {
  A4: { amount: 80, currency: 'USD' },
  A3: { amount: 130, currency: 'USD' },
  A2: { amount: 220, currency: 'USD' }
};

const ALLOWED_ORIGINS = new Set(['https://casterart.com', 'https://www.casterart.com']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_LIMITS = {
  artworkId: 80,
  artworkTitle: 160,
  sizeLabel: 80,
  sizeCode: 10,
  currency: 3,
  customerName: 120,
  customerEmail: 254,
  customerPhone: 40,
  street: 200,
  city: 100,
  state: 100,
  postal: 40,
  country: 100
};


exports.handler = async function (event) {
  const corsOrigin = getCorsOrigin(event);

  if (event.httpMethod === 'OPTIONS') return options(corsOrigin);
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' }, corsOrigin);
  }
  if (!isAllowedOrigin(event)) return json(403, { error: 'Forbidden origin' }, corsOrigin);

  try {
    const order = JSON.parse(event.body || '{}');

    const {
      artworkId,
      artworkTitle,
      sizeLabel,
      sizeCode,
      currency = 'USD',
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress = {},
      turnstileToken
    } = order;

    await verifyTurnstileToken(turnstileToken);

    const cleaned = cleanOrderFields({ artworkId, artworkTitle, sizeLabel, sizeCode, currency, customerName, customerEmail, customerPhone, shippingAddress });

    if (!cleaned.artworkId || !cleaned.artworkTitle || !cleaned.sizeLabel || !cleaned.sizeCode || !cleaned.customerEmail || !cleaned.customerName) {
      return json(400, { error: 'Missing required order details.' }, corsOrigin);
    }

    if (!EMAIL_RE.test(cleaned.customerEmail)) {
      return json(400, { error: 'Invalid customer email.' }, corsOrigin);
    }

    const expectedPrice = EXPECTED_PRINT_PRICES[cleaned.sizeCode];
    if (!expectedPrice) {
      return json(400, { error: 'Invalid print size selected. Please refresh and try again.' }, corsOrigin);
    }

    if (String(cleaned.currency || 'USD').toUpperCase() !== expectedPrice.currency) {
      return json(400, { error: 'Invalid checkout currency. Please refresh and try again.' }, corsOrigin);
    }

    const availability = await getEditionAvailability(cleaned.artworkId);
    const selectedSize = availability.find((row) => row.print_size_code === cleaned.sizeCode);

    if (!selectedSize) {
      return json(400, { error: 'This print size is not configured yet. Please contact info@casterart.com.' }, corsOrigin);
    }

    if (Number(selectedSize.current_edition || 0) >= 25) {
      const availableSizes = availability
        .filter((row) => Number(row.current_edition || 0) < 25)
        .map((row) => row.print_size_code);

      const message = availableSizes.length
        ? `${cleaned.artworkTitle} is sold out in ${cleaned.sizeCode}. Available sizes: ${availableSizes.join(', ')}.`
        : `${cleaned.artworkTitle} is sold out in all sizes.`;

      return json(409, {
        error: message,
        soldOut: true,
        selectedSize: cleaned.sizeCode,
        availableSizes
      }, corsOrigin);
    }

    const txRef = `caster-${cleaned.artworkId}-${cleaned.sizeCode || 'print'}-${Date.now()}`;
    const checkoutAmount = expectedPrice.amount;
    const checkoutCurrency = expectedPrice.currency;

    const payload = {
      tx_ref: txRef,
      amount: checkoutAmount,
      currency: checkoutCurrency,
      redirect_url: `${process.env.URL || 'https://casterart.com'}/payment-success.html`,
      customer: {
        email: cleaned.customerEmail,
        name: cleaned.customerName,
        phonenumber: cleaned.customerPhone || ''
      },
      customizations: {
        title: 'Caster Art',
        description: `${cleaned.artworkTitle} — ${cleaned.sizeLabel}`,
        logo: 'https://casterart.com/assets/images/flutterwave-logo.png'
      },
      meta: {
        order_type: 'print',
        artwork_id: cleaned.artworkId,
        artwork_sku: cleaned.artworkId,
        artwork_title: cleaned.artworkTitle,

        print_size: cleaned.sizeLabel,
        print_size_code: cleaned.sizeCode || '',

        edition_number: 'pending',

        shipping_name: cleaned.customerName,
        shipping_email: cleaned.customerEmail,
        shipping_phone: cleaned.customerPhone || '',
        shipping_street: cleaned.shippingAddress.street || '',
        shipping_city: cleaned.shippingAddress.city || '',
        shipping_state: cleaned.shippingAddress.state || '',
        shipping_postal: cleaned.shippingAddress.postal || '',
        shipping_country: cleaned.shippingAddress.country || ''
      }
    };

    const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await flwResponse.json();

    if (!flwResponse.ok || !data?.data?.link) {
      console.error('Flutterwave error:', data);
      return json(502, { error: 'Payment setup failed. Please try again.' }, corsOrigin);
    }

    return json(200, { link: data.data.link, tx_ref: txRef }, corsOrigin);

  } catch (error) {
    console.error('Checkout function error:', error);
    return json(error.statusCode || 500, { error: error.expose ? error.message : 'Server error while creating checkout.' }, corsOrigin);
  }
};

async function getEditionAvailability(artworkId) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase environment variables are missing');
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/edition_tracking?artwork_id=eq.${encodeURIComponent(artworkId)}&select=print_size_code,current_edition`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error('Could not check edition availability: ' + body);
  }

  return response.json();
}

function normaliseSupabaseUrl(url) {
  if (!url) return '';
  return String(url).trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
}

exports.config = {
  path: '/.netlify/functions/create-flutterwave-checkout',
  rateLimit: {
    windowLimit: 20,
    windowSize: 180,
    aggregateBy: ['ip', 'domain']
  }
};

function cleanOrderFields(order) {
  const shipping = order.shippingAddress || {};
  const cleaned = {
    artworkId: cleanLimited(order.artworkId, FIELD_LIMITS.artworkId),
    artworkTitle: cleanLimited(order.artworkTitle, FIELD_LIMITS.artworkTitle),
    sizeLabel: cleanLimited(order.sizeLabel, FIELD_LIMITS.sizeLabel),
    sizeCode: cleanLimited(order.sizeCode, FIELD_LIMITS.sizeCode).toUpperCase(),
    currency: cleanLimited(order.currency || 'USD', FIELD_LIMITS.currency).toUpperCase(),
    customerName: cleanLimited(order.customerName, FIELD_LIMITS.customerName),
    customerEmail: cleanLimited(order.customerEmail, FIELD_LIMITS.customerEmail).toLowerCase(),
    customerPhone: cleanLimited(order.customerPhone, FIELD_LIMITS.customerPhone),
    shippingAddress: {
      street: cleanLimited(shipping.street, FIELD_LIMITS.street),
      city: cleanLimited(shipping.city, FIELD_LIMITS.city),
      state: cleanLimited(shipping.state, FIELD_LIMITS.state),
      postal: cleanLimited(shipping.postal, FIELD_LIMITS.postal),
      country: cleanLimited(shipping.country, FIELD_LIMITS.country)
    }
  };

  return cleaned;
}

function cleanLimited(value, max) {
  const cleaned = String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
  if (cleaned.length > max) throw new Error('Input field is too long');
  return cleaned;
}

function getOrigin(event) {
  return event.headers?.origin || event.headers?.Origin || '';
}

function getCorsOrigin(event) {
  const origin = getOrigin(event);
  return ALLOWED_ORIGINS.has(origin) ? origin : 'https://casterart.com';
}

function isAllowedOrigin(event) {
  const origin = getOrigin(event);
  return !origin || ALLOWED_ORIGINS.has(origin);
}

function corsHeaders(origin) {
  return {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': origin || 'https://casterart.com',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin'
  };
}

function options(origin) {
  return { statusCode: 204, headers: corsHeaders(origin), body: '' };
}

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: corsHeaders(origin),
    body: JSON.stringify(body)
  };
}



async function verifyTurnstileToken(token) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    const error = new Error('Turnstile secret is not configured');
    error.statusCode = 501;
    error.expose = false;
    throw error;
  }

  if (!token || typeof token !== 'string') {
    const error = new Error('Verification failed. Please try again.');
    error.statusCode = 400;
    error.expose = true;
    throw error;
  }

  const form = new URLSearchParams();
  form.append('secret', secret);
  form.append('response', token);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: form
  });

  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) {
    console.error('Turnstile verification failed:', result);
    const error = new Error('Verification failed. Please try again.');
    error.statusCode = 400;
    error.expose = true;
    throw error;
  }
}
