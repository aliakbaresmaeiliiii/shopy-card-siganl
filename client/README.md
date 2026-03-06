# Raavishop (Client)

Angular frontend for **Raavishop** — your personal store. Browse products, manage cart and favorites, and checkout.

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

```bash
npm install
```

## Environment

Create or edit `src/app/environment/environment.ts` for development:

- `apiUrl`: backend API base (e.g. `http://localhost:3000/api`)

Production uses `environment.prod.ts`.

## Development

```bash
npm start
```

Open [http://localhost:4200](http://localhost:4200). The app will reload on changes.

## Build

```bash
npm run build
```

Output is in `dist/raavishop/`. Production build:

```bash
ng build --configuration production
```

## Features

- **Products**: Catalog with filters (search, price, stock, reviews), sort, 100 products from API with CDN images
- **Product detail**: Full product info, add to cart
- **Cart & checkout**: Cart shell, totals, checkout flow
- **Favorites**: Save favorites (in-memory)
- **Auth**: Login with email/password; JWT stored in `localStorage`
- **Responsive**: Mobile-first layout; skip link and route titles for accessibility and SEO

## Running unit tests

```bash
ng test
```

## Further help

- [Angular CLI](https://angular.io/cli)
- [Raavishop backend](../server) must be running for API (products, auth).
