# WIAL Frontend

## Requirements
- Node.js 20+
- npm

## Environment
The frontend reads environment variables from `frontend/.env.local`.

Use the shared template at [`.env.example`](/Users/beybutabdulrahimov/Documents/28-shawarmaalgo/.env.example) and copy these values into `frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

Notes:

- `NEXT_PUBLIC_API_URL` points the app at the Go API
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is required for client-side Stripe checkout
- `STRIPE_SECRET_KEY` is used by the server action in `frontend/app/actions/stripe.ts`

## Install
```bash
npm install
```

## Run
```bash
npm run dev
```

The app runs on `http://localhost:3000` by default.
