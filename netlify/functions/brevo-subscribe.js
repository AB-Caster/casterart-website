exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const { firstName, email, source } = JSON.parse(event.body || '{}');
    if (!firstName || !email || !email.includes('@')) return json(400, { error: 'Missing firstName or email' });

    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_GENERAL_LIST_ID || 0);
    if (!apiKey || !listId) return json(501, { error: 'Brevo environment variables are not configured yet' });

    const resp = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'accept': 'application/json', 'content-type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: firstName, SOURCE: source || 'website' },
        listIds: [listId],
        updateEnabled: true
      })
    });

    if (!resp.ok && resp.status !== 204) return json(resp.status, { error: 'Brevo request failed' });
    return json(200, { ok: true });
  } catch (error) {
    return json(500, { error: 'Server error' });
  }
};
function json(statusCode, body) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }; }
