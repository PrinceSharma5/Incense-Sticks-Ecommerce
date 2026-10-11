# wer

Full-stack incense ecommerce project with the Aura & Ember storefront.

## Requirements

- Node.js and npm
- MongoDB
- Razorpay test credentials for checkout testing

## Run locally

1. Copy `Backend/.env.example` to `Backend/.env` and fill in the required local credentials.
2. Copy `Frontend/.env.example` to `Frontend/.env`.
3. In `Backend`, run `npm install` and `npm start`.
4. In `Frontend`, run `npm install` and `npm run dev`.

The backend defaults to port `8502`; the frontend API URL should match it. Keep real credentials in local `.env` files and out of Git.
