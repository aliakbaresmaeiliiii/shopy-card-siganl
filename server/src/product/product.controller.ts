import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDTO } from './product';

@Controller('product')
export class ProductController {
  constructor(private service: ProductService) {}

  @Get()
  getPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ) {
    return this.service.getPaginated(page, limit);
  }

  @Post()
  addProduct(@Body() product: ProductDTO[]) {}
}
