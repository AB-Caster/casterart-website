const MAX_ATTACHMENTS = 3;
const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const FIELD_LIMITS = {
  name: 100,
  email: 254,
  phone: 40,
  country: 80,
  city: 80,
  size: 80,
  medium: 80,
  deadline: 120,
  budget: 120,
  subjects: 300,
  shipping: 1000,
  vision: 2000
};
const ALLOWED_ORIGINS = new Set(['https://casterart.com', 'https://www.casterart.com']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.handler = async (event) => {
  const corsOrigin = getCorsOrigin(event);

  if (event.httpMethod === 'OPTIONS') return options(corsOrigin);
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' }, corsOrigin);
  if (!isAllowedOrigin(event)) return json(403, { error: 'Forbidden origin' }, corsOrigin);

  try {
    const payload = JSON.parse(event.body || '{}');
    const inquiry = payload.inquiry || {};
    const attachments = Array.isArray(payload.attachments) ? payload.attachments : [];

    await verifyTurnstileToken(payload.turnstileToken);

    const cleaned = validateInquiry(inquiry);

    if (attachments.length > MAX_ATTACHMENTS) {
      return json(400, { error: 'Too many reference photos' }, corsOrigin);
    }

    const brevoAttachments = attachments.map(validateAttachment);

    const apiKey = process.env.BREVO_API_KEY;
    const toEmail = process.env.COMMISSION_TO_EMAIL || process.env.SITE_EMAIL || 'info@casterart.com';
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SITE_EMAIL || 'info@casterart.com';

    if (!apiKey) {
      return json(501, { error: 'BREVO_API_KEY is not configured for commission inquiries' }, corsOrigin);
    }

    const bodyText = buildEmailText(cleaned, attachments);

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
        replyTo: { email: cleaned.email, name: cleaned.name },
        subject: `Commission Inquiry — ${cleaned.name}`,
        textContent: bodyText,
        attachment: brevoAttachments
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Brevo commission email failed:', text);
      return json(502, { error: 'Commission inquiry email failed' }, corsOrigin);
    }

    return json(200, { ok: true }, corsOrigin);
  } catch (error) {
    console.error('Commission inquiry error:', error);
    const safeMessage = error.expose ? error.message : 'Commission inquiry failed';
    return json(error.statusCode || 400, { error: safeMessage }, corsOrigin);
  }
};

exports.config = {
  path: '/.netlify/functions/commission-inquiry',
  rateLimit: {
    windowLimit: 5,
    windowSize: 180,
    aggregateBy: ['ip', 'domain']
  }
};

function validateInquiry(inquiry) {
  const cleaned = {};
  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    cleaned[field] = clean(inquiry[field]);
    if (cleaned[field].length > max) {
      throw publicError(`${field} is too long`, 400);
    }
  }

  if (!cleaned.name || !cleaned.email || !cleaned.country || !cleaned.vision) {
    throw publicError('Missing required commission inquiry fields', 400);
  }

  if (!EMAIL_RE.test(cleaned.email)) {
    throw publicError('Invalid email address', 400);
  }

  return cleaned;
}

function validateAttachment(file) {
  const name = clean(file.name || 'reference-photo').slice(0, 120);
  const content = String(file.content || '');
  const claimedMimeType = clean(file.mimeType || '');

  if (!content) throw publicError('Reference photo content is missing: ' + name, 400);
  if (!ALLOWED_MIME_TYPES.has(claimedMimeType)) throw publicError('Unsupported reference photo type', 400);

  let buffer;
  try {
    buffer = Buffer.from(content, 'base64');
  } catch {
    throw publicError('Reference photo could not be read: ' + name, 400);
  }

  if (!buffer.length || buffer.length > MAX_ATTACHMENT_BYTES) {
    throw publicError('Reference photo is too large: ' + name, 400);
  }

  const actualMimeType = detectImageMimeType(buffer);
  if (!actualMimeType || actualMimeType !== claimedMimeType) {
    throw publicError('Reference photo content does not match its file type: ' + name, 400);
  }

  return { name, content };
}

function detectImageMimeType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'image/jpeg';
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47 && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a) return 'image/png';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return '';
}

function buildEmailText(inquiry, attachments) {
  const lines = [
    'New commission inquiry from casterart.com',
    '',
    `Name: ${inquiry.name}`,
    `Email: ${inquiry.email}`,
    `Phone / WhatsApp: ${inquiry.phone || 'Not provided'}`,
    `Country: ${inquiry.country}`,
    `City: ${inquiry.city || 'Not provided'}`,
    `Preferred size: ${inquiry.size || 'Not provided'}`,
    `Medium preference: ${inquiry.medium || 'Not provided'}`,
    `Deadline: ${inquiry.deadline || 'Not provided'}`,
    `Budget: ${inquiry.budget || 'Not provided'}`,
    `Subjects: ${inquiry.subjects || 'Not provided'}`,
    `Shipping address / notes: ${inquiry.shipping || 'Not provided'}`,
    '',
    'Vision:',
    inquiry.vision,
    '',
    `Reference photos attached: ${attachments.length}`
  ];
  return lines.join('\n');
}

function clean(value) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim();
}

function publicError(message, statusCode = 400) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.expose = true;
  return error;
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
    throw publicError('Verification failed. Please try again.', 400);
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
    throw publicError('Verification failed. Please try again.', 400);
  }
}
