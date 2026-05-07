# Abraham Caster Website Package

This package is ready for Netlify upload and includes the updated multi-page website.

## What changed

- Long em dashes were removed from the website copy.
- Originals and prints now show series as collection cards.
- Series pages were added:
  - `series/perception.html`
  - `series/shades-of-brown.html`
- Missing artwork image paths now point to local files in `assets/images/`.
- Commission inquiry form now asks for full context, reference photos, and shipping destination.
- Backend-ready Netlify functions were added for:
  - Brevo newsletter signups
  - Lemon Squeezy webhooks
  - CreativeHub fulfilment
  - Buyer segmentation
  - Commission inquiry handling
- Security headers were updated in `_headers`.

## How to edit text

Do not double-click the HTML file if you want to edit it. Double-clicking opens the preview in Chrome.

Use this instead:

1. Install Visual Studio Code.
2. Unzip this package.
3. Open VS Code.
4. Click `File` > `Open Folder`.
5. Choose the unzipped website folder.
6. In the left sidebar, click the file you want to edit.
7. Edit the text and press `Ctrl + S` to save.
8. Open `index.html` in Chrome to preview changes.

Most artwork text, image paths, series data, popup text, and payment links are inside `shared.js`.

## Image editing

Add your real images to:

`assets/images/`

Use these exact filenames:

- `grey.jpg`
- `serenity.jpg`
- `the-broken.jpg`
- `ayaba.jpg`
- `shades-of-brown-1.jpg`
- `shades-of-brown-2.jpg`
- `view.jpg`
- `sound.jpg`
- `taste.jpg`
- `scent.jpg`
- `feel.jpg`
- `fela.jpg`
- `eminem.jpg`

## Lemon Squeezy checkout links

Open `shared.js` and find `PRINT_SIZES`.

Replace:

`YOUR_LEMON_SQUEEZY_A4_LINK`

with your actual Lemon Squeezy checkout link for that size. Repeat for A3 and A2.

## Backend environment variables

Set these in Netlify under Site settings > Environment variables:

- `BREVO_API_KEY`
- `BREVO_GENERAL_LIST_ID`
- `BREVO_BUYERS_LIST_ID`
- `LEMON_WEBHOOK_SECRET`
- `CREATIVEHUB_API_KEY`
- `ZOHO_SMTP_USER`
- `ZOHO_SMTP_PASSWORD`
- `ZOHO_TO_EMAIL`

Never paste private API keys into `shared.js` or any public frontend file.

## Backend strategy

Website newsletter signup goes to Brevo General Collector List.

Lemon Squeezy paid orders should trigger the Lemon webhook. The backend should then:

1. Verify the Lemon Squeezy webhook signature.
2. Add the buyer to Brevo Buyers / Warm Collectors.
3. Map the purchased print to the correct CreativeHub product.
4. Create a CreativeHub fulfilment order.
5. Record edition number, order ID, buyer email, and fulfilment status in your future database.

Recommended future database options: Airtable, Supabase, or a simple Google Sheet automation.
