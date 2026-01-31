import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  // Just enough here for the code to compile
  private reviewsUrl = 'api/reviews';
  

  getReviewUrl(productId: number): string {

    return this.reviewsUrl + '?productId=^' + productId + '$';
  }
}
