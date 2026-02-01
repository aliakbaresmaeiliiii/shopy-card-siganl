

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
  description: string;
  price: number;
  quantityInStock?: number;
  hasReviews?: boolean;
  reviews?: Review[];
}

export interface Result<T> {
  data: T | undefined;
  error?: string;
}



