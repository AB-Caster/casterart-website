const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  try {
    const payload = JSON.parse(event.body || '{}');
    const inquiry = payload.inquiry || {};
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];

    const name = clean(inquiry.name);
    const email = clean(inquiry.email);
    const country = clean(inquiry.country);
    const vision = clean(inquiry.vision);

    if (!name || !email || !email.includes('@') || !country || !vision) {
      return json(400, { error: 'Missing required commission inquiry fields' });
    }

    if (attachments.length > MAX_ATTACHMENTS) {
      return json(400, { error: 'Too many reference photos' });
    }

    const brevoAttachments = attachments.map((file) => {
      const name = clean(file.name || 'reference-photo');
      const content = String(file.content || '');
      const mimeType = clean(file.mimeType || '');
      const size = Number(file.size || 0);

      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        throw new Error('Unsupported reference photo type: ' + mimeType);
      }
      if (!size || size > MAX_ATTACHMENT_BYTES) {
        throw new Error('Reference photo is too large: ' + name);
      }
      if (!content) {
        throw new Error('Reference photo content is missing: ' + name);
      }

      return { name, content };
    });

    const apiKey = process.env.BREVO_API_KEY;
    const toEmail = process.env.COMMISSION_TO_EMAIL || process.env.SITE_EMAIL || 'info@casterart.com';
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SITE_EMAIL || 'info@casterart.com';

    if (!apiKey) {
      return json(501, { error: 'BREVO_API_KEY is not configured for commission inquiries' });
    }

    const bodyText = buildEmailText(inquiry, attachments);

    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { name: 'Caster Art Website', email: senderEmail },
        to: [{ email: toEmail, name: 'Abraham Caster' }],
        replyTo: { email, name },
        subject: `Commission Inquiry — ${name}`,
        textContent: bodyText,
        attachment: brevoAttachments
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Brevo commission email failed:', text);
      return json(502, { error: 'Commission inquiry email failed' });
    }

    return json(200, { ok: true });
  } catch (error) {
    console.error('Commission inquiry error:', error);
    return json(500, { error: error.message || 'Commission inquiry failed' });
  }
};

function buildEmailText(inquiry, attachments) {
  const lines = [
    'New commission inquiry from casterart.com',
    '',
    `Name: ${clean(inquiry.name)}`,
    `Email: ${clean(inquiry.email)}`,
    `Phone / WhatsApp: ${clean(inquiry.phone) || 'Not provided'}`,
    `Country: ${clean(inquiry.country)}`,
    `City: ${clean(inquiry.city) || 'Not provided'}`,
    `Preferred size: ${clean(inquiry.size) || 'Not provided'}`,
    `Medium preference: ${clean(inquiry.medium) || 'Not provided'}`,
    `Deadline: ${clean(inquiry.deadline) || 'Not provided'}`,
    `Budget: ${clean(inquiry.budget) || 'Not provided'}`,
    `Subjects: ${clean(inquiry.subjects) || 'Not provided'}`,
    `Shipping address / notes: ${clean(inquiry.shipping) || 'Not provided'}`,
    '',
    'Vision:',
    clean(inquiry.vision),
    '',
    `Reference photos attached: ${attachments.length}`
  ];
  return lines.join('\n');
}

function clean(value) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  };
}
