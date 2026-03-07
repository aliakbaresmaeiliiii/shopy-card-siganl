/* Defines a product review */
export interface Review {
  id: number;
  productId: number;
  userName: string;
  title: string;
  text: string;
}

export interface ProductDTO {
  id: number;
  productName: string;
  productCode: string;
  description?: string;
  price: number;
  image?: string;
  quantityInStock?: number;
  hasReviews?: boolean;
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
