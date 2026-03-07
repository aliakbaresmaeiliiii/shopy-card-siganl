import { Component, computed, inject, Input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartItem } from '../cart';
import { CartService } from '../cart.service';
import { environment } from '../../environment/environment';

@Component({
  selector: 'sw-cart-item',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent {
  item = signal<CartItem>(undefined!);
  apiUrl = environment.apiUrl;

  @Input({ required: true }) set cartItem(ci: CartItem) {
    this.item.set(ci);
  }

  private cartService = inject(CartService);

  /** Max quantity allowed in stepper */
  maxQty = 99;
  exPrice = computed(() => this.item().quantity * this.item().product.price);

  /** Use CDN image when absolute URL, otherwise backend-relative. Fallback to CDN by product id if missing. */
  imageSrc(product: { id: number; image?: string }): string {
    const image = product.image;
    if (image) {
      return image.startsWith('http://') || image.startsWith('https://')
        ? image
        : this.apiUrl + image;
    }
    return `https://picsum.photos/seed/product-${product.id}/64/64`;
  }

  onQuantityChange(quantity: number): void {
    const q = Math.max(1, Math.min(this.maxQty, quantity));
    this.cartService.updateQuantity(this.item(), q);
  }

  remove(): void {
    this.cartService.removeFromCart(this.item());
  }
}
