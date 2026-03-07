import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private readonly reviewsUrl = `${environment.apiUrl}/reviews`;

  getReviewUrl(productId: number): string {
    return `${this.reviewsUrl}?productId=${productId}`;
  }
}
