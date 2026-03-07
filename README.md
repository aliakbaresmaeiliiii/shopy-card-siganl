# Raavishop

A full-stack e-commerce web app with an Angular frontend and NestJS backend. Browse products, manage cart and favorites, and checkout — with a modern UI and a focus on the Iran market.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)

---

## Features

- **Home**
  - Welcome section and **Top picks for Iran** (horizontal product carousel with arrows)
  - **Category boxes** in a 2×2 grid — each box has a title, four sub-category tiles (image + label), and a “See more” / “Discover more” link

- **Products**
  - Catalog with **banner slider** and promo tiles
  - **Filters**: search, price range, category pills, in-stock only, products with reviews
  - **Sort**: featured, price, name
  - **Infinite scroll** and “See more products” button
  - Product cards (no add-to-cart on list — add to cart only from detail)
  - **Product detail**: images (with full-size dialog), ratings, sale info, shipping, specs, quantity, Add to Cart & Buy Now

- **Cart & Checkout**
  - Cart and favorites **persisted in `localStorage`**
  - Cart and checkout routes **protected**; guests are redirected to login with `returnUrl`

- **Auth**
  - Login / register; JWT stored in `localStorage`
  - Guards and `returnUrl` support for post-login redirect

- **Reviews**
  - Customer reviews on product detail, loaded from the backend

- **UI/UX**
  - **True Summer** color palette (cool, muted tones)
  - Responsive layout (e.g. 2 product columns on mobile)
  - Breadcrumbs, skip link, and basic accessibility
  - Skeleton loaders for initial product load

---

## Project structure

```
├── client/          # Angular 21 app (standalone components, signals)
├── server/          # NestJS 11 API (products, auth, reviews)
└── README.md
```

- **Client**: Angular 21, Tailwind CSS, lazy-loaded routes, `ProductService` / `CartService` / `AuthService`.
- **Server**: NestJS 11, Express, product & review seed data, JWT auth, paginated product API.

---

## Prerequisites

- **Node.js** 18+
- **npm** (or yarn)

---

## Quick start

### 1. Clone and install

```bash
git clone <your-repo-url>
cd shopy-card-siganl
```

### 2. Backend

```bash
cd server
npm install
npm run start:dev
```

API runs at **http://localhost:3000**. Products and reviews are served from in-memory/seed data.

### 3. Frontend

```bash
cd client
npm install
npm start
```

App runs at **http://localhost:4200**. Default redirect is `/welcome` (home).

### 4. Environment

- **Client**: Edit `client/src/app/environment/environment.ts` if your API is not at `http://localhost:3000/api`:

  ```ts
  apiUrl: 'http://localhost:3000/api'
  ```

- **Production**: Use `environment.prod.ts` and point `apiUrl` to your deployed API.

---

## Scripts

| Location   | Command           | Description              |
|-----------|-------------------|--------------------------|
| `client/` | `npm start`       | Dev server (port 4200)   |
| `client/` | `npm run build`   | Production build        |
| `client/` | `npm test`        | Unit tests               |
| `server/` | `npm run start:dev` | API in watch mode      |
| `server/` | `npm run build`   | Build server             |
| `server/` | `npm run start:prod` | Run built server     |

---

## Main routes

| Path           | Description                    |
|----------------|--------------------------------|
| `/`            | Redirects to `/welcome`       |
| `/welcome`     | Home (top picks + categories) |
| `/products`    | Product catalog                |
| `/products/:id`| Product detail                 |
| `/favorites`   | Saved favorites                |
| `/cart`        | Cart (auth required)           |
| `/checkout`    | Checkout (auth required)       |
| `/login`       | Login / register               |

---

## Tech stack

- **Frontend**: Angular 21, TypeScript 5.9, Tailwind CSS 4, RxJS, Angular Router, standalone components, signals
- **Backend**: NestJS 11, TypeScript, Express, JWT, Prisma (optional), in-memory/seed data for products and reviews

---

## License

See repository license (if any). Backend is currently `UNLICENSED` in `server/package.json`.
