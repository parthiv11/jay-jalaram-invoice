# Jay Jalaram Invoice

Fullstack Next.js invoice app with a server API for generating invoices.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API

### `POST /api/invoices`

Creates an invoice, calculates totals, stores it in `data/invoices.json`, and returns the saved invoice.

Example body:

```json
{
  "date": "2026-05-29",
  "customerName": "Test Customer",
  "lineItems": [
    {
      "product": "Office Chair",
      "quantity": 2,
      "rate": 5000,
      "gstPercent": 18,
      "discount": 100
    }
  ],
  "additionalDiscount": 50,
  "amountPaid": 3000
}
```

### `GET /api/invoices`

Returns all stored invoices and the next invoice number.
