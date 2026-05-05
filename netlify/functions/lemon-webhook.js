const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret) return json(501, { error: 'Lemon webhook secret is not configured yet' });

  const signature = event.headers['x-signature'] || event.headers['X-Signature'];
  const digest = crypto.createHmac('sha256', secret).update(event.body || '').digest('hex');
  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))) {
    return json(401, { error: 'Invalid Lemon Squeezy signature' });
  }

  const payload = JSON.parse(event.body || '{}');
  const eventName = payload?.meta?.event_name;

  if (eventName === 'order_created' || eventName === 'subscription_created') {
    // 1. Extract buyer, product, variant, amount, and custom checkout fields.
    // 2. Add buyer to Brevo Buyers / Warm Collectors list.
    // 3. Create CreativeHub order if the product is a physical print.
    // 4. Store edition/order status in your database or Airtable/Supabase.
    await buyerSegmentationPlaceholder(payload);
    await creativeHubFulfillmentPlaceholder(payload);
  }

  return json(200, { received: true });
};

async function buyerSegmentationPlaceholder(payload) {
  // TODO: call Brevo API using BREVO_API_KEY and BREVO_BUYERS_LIST_ID.
  return true;
}

async function creativeHubFulfillmentPlaceholder(payload) {
  // TODO: call CreativeHub API using CREATIVEHUB_API_KEY after mapping artwork and print size.
  return true;
}

function json(statusCode, body) { return { statusCode, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }; }
