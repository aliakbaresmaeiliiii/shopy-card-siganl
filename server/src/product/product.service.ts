import { Injectable } from '@nestjs/common';
import { products } from './seed';
import { ProductDTO, Result } from './product';

@Injectable()
export class ProductService {
  private productList = [...products];

  getAll(): Result<ProductDTO[]> {
    return { data: this.productList };
  }
 
}
