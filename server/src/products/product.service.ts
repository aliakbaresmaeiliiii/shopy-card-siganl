import { CreateProductDTO } from "../models/create-product.dto";
import { ProductDTO } from "../models/products";
import { PrismaService } from "../prisma/prisma.service";

export class ProductService {
  product: ProductDTO[] = [];

  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProductDTO[]> {
    return this.prisma.product.findMany();
  }

  async create(data: CreateProductDTO): Promise<ProductDTO> {
    return this.prisma.product.create({
      data,
    });
  }
}
