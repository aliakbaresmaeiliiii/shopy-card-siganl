import { Injectable } from '@nestjs/common';
import { ReviewDTO } from './review';
import { reviews } from './review.seed';

@Injectable()
export class ReviewService {
  private readonly list = [...reviews];

  getByProductId(productId: number): ReviewDTO[] {
    return this.list.filter((r) => r.productId === productId);
  }
}
