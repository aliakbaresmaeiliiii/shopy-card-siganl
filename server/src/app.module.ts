// src/app.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ProductModule } from './products/product.module';

@Module({
  imports: [ProductModule],
  providers: [PrismaService],
})
export class AppModule {}
