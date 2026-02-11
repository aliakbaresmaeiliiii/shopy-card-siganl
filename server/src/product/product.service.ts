import { Injectable } from '@nestjs/common';
import { ProductDTO, Result } from './product';
import { products } from './seed';

@Injectable()
export class ProductService {
  private productList = [...products];

  getAll(): Result<ProductDTO[]> {
    const data = this.productList;
    return { data };
  }
}
