import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './product';

@Controller()
export class ProductController {
  constructor(private service: ProductService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post()
  addProduct(@Body() product: ProductDTO[]) {
  }
}
