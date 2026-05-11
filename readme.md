# Abraham Caster Website — Pre-Deployment Notes

This version uses:

- Static HTML/CSS/JS deployed on Netlify
- Netlify Functions for server-side logic
- Flutterwave checkout for print payments
- Flutterwave webhook verification before fulfilment
- Supabase for edition tracking and order records
- CreativeHub for print fulfilment
- Brevo for newsletter signup, buyer segmentation, confirmation emails, and commission inquiry emails

## Required Netlify environment variables

Set these in Netlify before deploying:

- `URL`
- `FLW_SECRET_KEY`
- `FLW_WEBHOOK_SECRET`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CREATIVEHUB_API_KEY`
- `BREVO_API_KEY`
- `BREVO_GENERAL_LIST_ID`
- `BREVO_PRINT_BUYERS_LIST_ID`
- `BREVO_ORIGINALS_LIST_ID`
- `BREVO_WAITLIST_BROKEN_LIST_ID`
- `BREVO_WAITLIST_SHADES_LIST_ID`
- `BREVO_WAITLIST_PERCEPTION_LIST_ID`
- `SITE_EMAIL`
- `SENDER_EMAIL`
- `COMMISSION_TO_EMAIL`

## Print order flow

1. Customer selects artwork and print size.
2. Site checks size availability before checkout.
3. Netlify function creates a Flutterwave checkout link.
4. Flutterwave redirects the customer to `payment-success.html` after payment.
5. Flutterwave sends webhook to `/.netlify/functions/flutterwave-webhook`.
6. Webhook verifies transaction status, amount, and currency.
7. Webhook claims the next edition number through Supabase RPC.
8. Webhook stores the order record.
9. Webhook submits fulfilment details to CreativeHub.
10. Webhook sends buyer confirmation email through Brevo.

## Supabase requirement

The database must include the `claim_edition_number` RPC function. This function must atomically check the current edition count and increment it so two buyers cannot receive the same edition number.

## CreativeHub auth

CreativeHub requests use:

```txt
Authorization: ApiKey <yourkey>
```

## Security headers

Security headers are managed in `_headers`. Do not duplicate them in `netlify.toml`.
