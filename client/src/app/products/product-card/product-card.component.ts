import { Component, input, output } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product';
import { environment } from '../../environment/environment';

@Component({
  selector: 'pm-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DecimalPipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  product = input.required<Product>();
  isFavorite = input<boolean>(false);
  /** Star rating 0–5 (e.g. 4.2). If not set, a default is shown. */
  rating = input<number | undefined>(undefined);
  /** Number of reviews. If not set and rating is set, shows "(0)". */
  reviewCount = input<number | undefined>(undefined);
  apiUrl = environment.apiUrl;

  addToCart = output<Product>();
  toggleFavorite = output<number>();

  /** Display rating: use input or default to 4.0 for display. */
  /** Use CDN image when absolute URL, otherwise backend-relative. */
  imageSrc(image: string | undefined): string {
    if (!image) return '';
    return image.startsWith('http://') || image.startsWith('https://')
      ? image
      : this.apiUrl + image;
  }

  displayRating(): number {
    const r = this.rating();
    return r !== undefined && r >= 0 ? r : 4;
  }

  /** Display review count. */
  displayReviewCount(): number {
    const c = this.reviewCount();
    return c !== undefined && c >= 0 ? c : 0;
  }

  /** Full stars (integer). */
  fullStars(): number {
    return Math.floor(this.displayRating());
  }

  /** Whether there is a half star (e.g. 4.3 → true). */
  hasHalfStar(): boolean {
    const r = this.displayRating();
    return r % 1 >= 0.25 && r % 1 < 0.75;
  }

  /** Empty stars to show (0–5). */
  emptyStars(): number {
    return 5 - this.fullStars() - (this.hasHalfStar() ? 1 : 0);
  }
}
