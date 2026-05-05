exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  // Backend-ready placeholder for commission inquiries with reference photos.
  // Recommended production setup:
  // 1. Parse multipart/form-data securely.
  // 2. Reject oversized files and unsupported file types.
  // 3. Virus-scan uploads if you store them.
  // 4. Send the inquiry to info@casterart.com using Zoho SMTP, Zoho Mail API, or a transactional mail service.
  // 5. Do not store reference images publicly.

  return json(501, { error: 'Commission email backend is not configured yet. The website will fall back to mailto.' });
};
function json(statusCode, body) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }; }
