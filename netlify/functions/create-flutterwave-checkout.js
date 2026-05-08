exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  try {
    const order = JSON.parse(event.body || '{}');

    const {
      artworkId,
      artworkTitle,
      sizeLabel,
      sizeCode,
      amount,
      currency = 'USD',
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress = {}
    } = order;

    if (!artworkId || !artworkTitle || !sizeLabel || !amount || !customerEmail || !customerName) {
      return json(400, { error: 'Missing required order details.' });
    }

    const txRef = `caster-${artworkId}-${sizeCode || 'print'}-${Date.now()}`;

    const payload = {
      tx_ref: txRef,
      amount,
      currency,
      redirect_url: `${process.env.URL || 'https://casterart.com'}/payment-success.html`,
      customer: {
        email: customerEmail,
        name: customerName,
        phonenumber: customerPhone || ''
      },
      customizations: {
        title: 'Caster Art',
        description: `${artworkTitle} — ${sizeLabel}`,
        logo: 'https://casterart.com/assets/images/flutterwave-logo.png'
      },
      meta: {
        order_type: 'print',
        artwork_id: artworkId,
        artwork_sku: artworkId,
        artwork_title: artworkTitle,

        print_size: sizeLabel,
        print_size_code: sizeCode || '',

        edition_number: 'pending',

        shipping_name: customerName,
        shipping_email: customerEmail,
        shipping_phone: customerPhone || '',
        shipping_street: shippingAddress.street || '',
        shipping_city: shippingAddress.city || '',
        shipping_state: shippingAddress.state || '',
        shipping_postal: shippingAddress.postal || '',
        shipping_country: shippingAddress.country || ''
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
      return json(502, {
        error: 'Flutterwave could not create checkout link.',
        details: data
      });
    }

    return json(200, { link: data.data.link, tx_ref: txRef });

  } catch (error) {
    console.error('Checkout function error:', error);
    return json(500, { error: 'Server error while creating checkout.' });
  }
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  };
}
