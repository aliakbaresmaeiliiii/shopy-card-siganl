import { Body, Controller, Get, Post } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductDTO } from "../models/products";
import { CreateProductDTO } from "../models/create-product.dto";

@Controller("Product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(): Promise<ProductDTO[]> {
    return this.productService.findAll();
  }


  @Post()
  async create(
    @Body() data: CreateProductDTO,
  ): Promise<ProductDTO> {
    return this.productService.create(data);
  }
}
