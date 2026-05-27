exports.handler = async (event) => {
  const allowedOrigins = ['https://casterart.com', 'https://www.casterart.com'];
  const origin = event.headers.origin || '';
  const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': corsOrigin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Vary': 'Origin',
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' }, corsOrigin);
  }

  if (origin && !allowedOrigins.includes(origin)) {
    return json(403, { error: 'Forbidden origin' }, corsOrigin);
  }

  try {
    const { firstName, email, source, listId, turnstileToken } = JSON.parse(event.body || '{}');

    const cleanFirstName = clean(firstName);
    const cleanEmail = clean(email).toLowerCase();
    const cleanSource = clean(source || 'website');

    if (!cleanFirstName || cleanFirstName.length > 100 || !isValidEmail(cleanEmail)) {
      return json(400, { error: 'Missing or invalid firstName or email' }, corsOrigin);
    }

    if (cleanSource.length > 80) {
      return json(400, { error: 'Invalid signup source' }, corsOrigin);
    }

    await verifyTurnstileToken(turnstileToken);

    const apiKey = process.env.BREVO_API_KEY;
    const resolvedListId = resolveBrevoListId(cleanSource, listId);

    if (!apiKey || !resolvedListId) {
      return json(501, { error: 'Brevo environment variables are not configured' }, corsOrigin);
    }

    const resp = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email: cleanEmail,
        attributes: {
          FIRSTNAME: cleanFirstName,
          SOURCE: cleanSource
        },
        listIds: [resolvedListId],
        updateEnabled: true
      })
    });

    if (!resp.ok && resp.status !== 204) {
      const errBody = await resp.text();
      console.error('Brevo error:', errBody);
      return json(resp.status, { error: 'Brevo request failed' }, corsOrigin);
    }

    return json(200, { ok: true }, corsOrigin);

  } catch (error) {
    console.error('Handler error:', error);
    return json(error.statusCode || 500, { error: error.expose ? error.message : 'Server error' }, corsOrigin);
  }
};

function resolveBrevoListId(source, listId) {
  if (listId) return Number(listId);

  const sourceMap = {
    print_buyer: process.env.BREVO_PRINT_BUYERS_LIST_ID,
    originals_buyer: process.env.BREVO_ORIGINALS_LIST_ID,
    waitlist_broken: process.env.BREVO_WAITLIST_BROKEN_LIST_ID,
    waitlist_shades: process.env.BREVO_WAITLIST_SHADES_LIST_ID,
    waitlist_perception: process.env.BREVO_WAITLIST_PERCEPTION_LIST_ID,
  };

  return Number(sourceMap[source] || process.env.BREVO_GENERAL_LIST_ID);
}

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': origin || 'https://casterart.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin'
    },
    body: JSON.stringify(body)
  };
}

exports.config = {
  path: '/.netlify/functions/brevo-subscribe',
  rateLimit: {
    windowLimit: 10,
    windowSize: 180,
    aggregateBy: ['ip', 'domain']
  }
};

function clean(value) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
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
