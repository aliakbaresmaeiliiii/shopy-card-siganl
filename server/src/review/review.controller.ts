import { Controller, Get, Query } from '@nestjs/common';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  getByProductId(@Query('productId') productId: string) {
    const id = Number(productId);
    if (Number.isNaN(id)) {
      return [];
    }
    return this.reviewService.getByProductId(id);
  }
}
