exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

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
      },
      body: ''
    };
  }

  try {
    const { firstName, email, source, listId } = JSON.parse(event.body || '{}');

    if (!firstName || !email || !email.includes('@')) {
      return json(400, { error: 'Missing or invalid firstName or email' }, corsOrigin);
    }

    const apiKey = process.env.BREVO_API_KEY;

    // Choose list based on source, or fall back to general Inner Circle list
    let resolvedListId;
    if (listId) {
      resolvedListId = Number(listId);
    } else if (source === 'print_buyer') {
      resolvedListId = Number(process.env.BREVO_PRINT_BUYERS_LIST_ID);
    } else if (source === 'originals_buyer') {
      resolvedListId = Number(process.env.BREVO_ORIGINALS_LIST_ID);
    } else {
      resolvedListId = Number(process.env.BREVO_GENERAL_LIST_ID);
    }

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
        email,
        attributes: {
          FIRSTNAME: firstName,
          SOURCE: source || 'website'
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
    return json(500, { error: 'Server error' }, corsOrigin);
  }
};

function json(statusCode, body, origin) {
  return {
    statusCode,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': origin || 'https://casterart.com'
    },
    body: JSON.stringify(body)
  };
}