import { Review } from '../reviews/review';

/* Defines the product entity */
export interface Product {
  id: number;
  productName: string;
  productCode: string;
  description?: string;
  price: number;
  quantityInStock?: number;
  hasReviews?: boolean;
  image?: string;
  category?: string;
  reviews?: Review[];
  /** City/location name (e.g. "Kuala Lumpur") */
  location?: string;
  /** Number of units sold */
  soldCount?: number;
}

export interface Result<T> {
  data: T | undefined;
  error?: string;
}
