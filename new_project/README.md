# wer

Full-stack incense ecommerce project with the Aura & Ember storefront.

## Requirements

- Node.js 22.12 or newer and npm
- MongoDB
- Razorpay test credentials for checkout testing

Run npm commands inside the matching Backend or Frontend directory. The directory names are case-sensitive on Linux.

## Run locally

1. Copy `Backend/.env.example` to `Backend/.env` and fill in the required local credentials.
2. Copy `Frontend/.env.example` to `Frontend/.env`.
3. In `Backend`, run `npm ci` and `npm start`.
4. In `Frontend`, run `npm ci` and `npm run dev`.

The backend defaults to port `8502`; the frontend API URL should match it. Keep real credentials in local `.env` files and out of Git.

Production frontend builds use `https://www.api.princesharma.online` from `Frontend/.env.production`. If the hosting provider defines `VITE_BASE_URL`, set it to the same URL and redeploy the frontend.
