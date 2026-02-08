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
  image?:string;
  reviews?: Review[];
}

export interface Result<T> {
  data: T | undefined;
  error?: string;
}
