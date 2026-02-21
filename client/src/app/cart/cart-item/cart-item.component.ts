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

  onQuantityChange(quantity: number): void {
    const q = Math.max(1, Math.min(this.maxQty, quantity));
    this.cartService.updateQuantity(this.item(), q);
  }

  remove(): void {
    this.cartService.removeFromCart(this.item());
  }
}
