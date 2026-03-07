import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getById(Number(id));
  }

  @Post()
  addProduct(@Body() product: ProductDTO[]) {}
}
