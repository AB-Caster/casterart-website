const SUPABASE_URL = normaliseSupabaseUrl(process.env.SUPABASE_URL);
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const EXPECTED_PRINT_PRICES = {
  A4: { amount: 80, currency: 'USD' },
  A3: { amount: 130, currency: 'USD' },
  A2: { amount: 220, currency: 'USD' }
};

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
      currency = 'USD',
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress = {}
    } = order;

    if (!artworkId || !artworkTitle || !sizeLabel || !sizeCode || !customerEmail || !customerName) {
      return json(400, { error: 'Missing required order details.' });
    }

    const expectedPrice = EXPECTED_PRINT_PRICES[sizeCode];
    if (!expectedPrice) {
      return json(400, { error: 'Invalid print size selected. Please refresh and try again.' });
    }

    if (String(currency || 'USD').toUpperCase() !== expectedPrice.currency) {
      return json(400, { error: 'Invalid checkout currency. Please refresh and try again.' });
    }

    const availability = await getEditionAvailability(artworkId);
    const selectedSize = availability.find((row) => row.print_size_code === sizeCode);

    if (!selectedSize) {
      return json(400, { error: 'This print size is not configured yet. Please contact info@casterart.com.' });
    }

    if (selectedSize.current_edition >= 25) {
      const availableSizes = availability
        .filter((row) => Number(row.current_edition || 0) < 25)
        .map((row) => row.print_size_code);

      const message = availableSizes.length
        ? `${artworkTitle} is sold out in ${sizeCode}. Available sizes: ${availableSizes.join(', ')}.`
        : `${artworkTitle} is sold out in all sizes.`;

      return json(409, {
        error: message,
        soldOut: true,
        selectedSize: sizeCode,
        availableSizes
      });
    }

    const txRef = `caster-${artworkId}-${sizeCode || 'print'}-${Date.now()}`;
    const checkoutAmount = expectedPrice.amount;
    const checkoutCurrency = expectedPrice.currency;

    const payload = {
      tx_ref: txRef,
      amount: checkoutAmount,
      currency: checkoutCurrency,
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

async function getEditionAvailability(artworkId) {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Supabase environment variables are missing');
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/edition_tracking?artwork_id=eq.${encodeURIComponent(artworkId)}&select=print_size_code,current_edition`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error('Could not check edition availability: ' + body);
  }

  return response.json();
}

function normaliseSupabaseUrl(url) {
  if (!url) return '';
  return String(url).trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  };
}
