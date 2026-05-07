const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  const secret = process.env.FLW_WEBHOOK_SECRET;
  if (!secret) return json(501, { error: 'Webhook secret not configured' });

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

  const eventType = payload.event;
  const data = payload.data;

  if (eventType !== 'charge.completed' || data?.status !== 'successful') {
    return json(200, { received: true, processed: false });
  }

  const meta = data.meta || {};
  const customer = data.customer || {};
  const orderType = meta.order_type || 'unknown';

  // Build the complete shipping object from metadata
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

  // 1. Add buyer to Brevo
  await addBuyerToBrevo({
    firstName: shippingAddress.name.split(' ')[0] || 'Collector',
    email: shippingAddress.email,
    orderType,
    artworkTitle: meta.artwork_title || '',
    printSize: meta.print_size || ''
  });

  // 2. Fulfill print order via CreativeHub
  if (orderType === 'print') {
    await triggerCreativeHubFulfillment({
      orderId: data.tx_ref,
      artworkId: meta.artwork_id,
      artworkTitle: meta.artwork_title,
      printSizeCode: meta.print_size_code,
      printSizeLabel: meta.print_size,
      shipping: shippingAddress,
      amount: data.amount,
      currency: data.currency
    });
  }

  return json(200, { received: true, processed: true });
};

// ─── Brevo ────────────────────────────────────────────────────────────────────
async function addBuyerToBrevo({ firstName, email, orderType, artworkTitle, printSize }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !email) return;

  const listId = orderType === 'print'
    ? Number(process.env.BREVO_PRINT_BUYERS_LIST_ID)
    : Number(process.env.BREVO_ORIGINALS_LIST_ID);

  if (!listId) return;

  try {
    await fetch('https://api.brevo.com/v3/contacts', {
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
          SOURCE: orderType === 'print' ? 'print_buyer' : 'originals_buyer',
          LAST_ARTWORK: artworkTitle,
          LAST_PRINT_SIZE: printSize
        },
        listIds: [listId],
        updateEnabled: true
      })
    });
  } catch (err) {
    console.error('Brevo error:', err);
  }
}

// ─── CreativeHub ──────────────────────────────────────────────────────────────
async function triggerCreativeHubFulfillment({
  orderId, artworkId, artworkTitle, printSizeCode,
  printSizeLabel, shipping, amount, currency
}) {
  const apiKey = process.env.CREATIVEHUB_API_KEY;

  if (!apiKey) {
    // Log everything so you can fulfill manually if needed
    console.log('CreativeHub not yet configured. Full order details:', JSON.stringify({
      orderId, artworkId, artworkTitle, printSizeCode,
      printSizeLabel, shipping, amount, currency
    }));
    return;
  }

  // Phase 3 will complete the CreativeHub API call here
  // All the data is ready and waiting
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  };
}