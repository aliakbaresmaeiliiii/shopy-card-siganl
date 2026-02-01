// src/product/seed.ts

import { ProductDTO, Review } from "./product"

export const reviews: Review[] = [
  {
    id: 1,
    productId: 1,
    userName: 'Alice',
    title: 'Great product',
    text: 'Really loved it!',
  },
  {
    id: 2,
    productId: 1,
    userName: 'Bob',
    title: 'Not bad',
    text: 'Could be better',
  },
]

export const products: ProductDTO[] = [
  {
    id: 1,
    productName: 'Laptop',
    productCode: 'LP100',
    description: 'A fast laptop for work and gaming',
    price: 1200,
    quantityInStock: 10,
    hasReviews: true,
    reviews: reviews.filter(r => r.productId === 1),
  },
  {
    id: 2,
    productName: 'Smartphone',
    productCode: 'SP200',
    description: 'A sleek phone with a great camera',
    price: 800,
    quantityInStock: 25,
    hasReviews: false,
    reviews: [],
  },
]
