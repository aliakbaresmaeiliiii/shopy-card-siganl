import { Injectable } from '@nestjs/common';
import { ProductDTO, Result } from './product';
import { products } from './seed';

@Injectable()
export class ProductService {
  private productList = [...products];

  getPaginated(page: number = 1, limit: number = 10): Result<ProductDTO[]> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const data = this.productList.slice(startIndex, endIndex);
    return { data };
  }

  getById(id: number): ProductDTO | null {
    return this.productList.find((p) => p.id === id) ?? null;
  }
}
