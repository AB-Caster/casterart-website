exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  const apiKey = process.env.CREATIVEHUB_API_KEY;
  if (!apiKey) return json(501, { error: 'CreativeHub API key is not configured yet' });

  // Backend-ready placeholder.
  // Expected input: Lemon order ID, artwork ID, print size, buyer shipping details, edition number.
  // This function should map your artwork IDs to CreativeHub product IDs and create a fulfilment order.
  return json(200, { ok: true, message: 'CreativeHub fulfilment placeholder is ready for implementation' });
};
function json(statusCode, body) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }; }
