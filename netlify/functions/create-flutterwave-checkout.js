exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const order = JSON.parse(event.body || '{}');

    const {
      artworkId,
      artworkTitle,
      sizeLabel,
      amount,
      currency = 'USD',
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress
    } = order;

    if (!artworkId || !artworkTitle || !sizeLabel || !amount || !customerEmail || !customerName) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required order details.' })
      };
    }

    const txRef = `caster-${artworkId}-${Date.now()}`;

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
        title: 'Abraham Caster Art Print',
        description: `${artworkTitle} — ${sizeLabel}`,
        logo: 'https://casterart.com/assets/images/logo.png'
      },
      meta: {
        artworkId,
        artworkTitle,
        sizeLabel,
        shippingAddress: shippingAddress || ''
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
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: 'Flutterwave could not create checkout link.',
          details: data
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ link: data.data.link, tx_ref: txRef })
    };
  } catch (error) {
    console.error('Checkout function error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error while creating checkout.' })
    };
  }
};
