import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from './cart';
import { Product } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);
  cartCount = computed(() =>
    this.cartItems().reduce((arr, item) => arr + item.quantity, 0),
  );

  subTotal = computed(() =>
    this.cartItems().reduce(
      (accTotal, item) => accTotal + item.quantity * item.product.price,
      0,
    ),
  );

  deliveryFee = computed(() => (this.subTotal() < 50 ? 5.99 : 0));

  tax = computed(() => Math.round(this.subTotal() * 10.75) / 100);

  totalPrice = computed(
    () => this.subTotal() + this.deliveryFee() + this.tax(),
  );

  checkDuplicate(product: Product): boolean {
    const id = this.cartItems().find((item) => item.product.id === product.id);
    if (id) {
      this.updateQuantity(id, id.quantity + 1);
      return true;
    }
    return this.cartItems().some((item) => item.product.id === product.id);
  }

  addProduct(product: Product): void {
    this.cartItems.update((item) => [...item, { product, quantity: 1 }]);
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update((item) =>
      item.filter((item) => item.product.id !== cartItem.product.id),
    );
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update((item) =>
      item.map((item) =>
        item.product.id === cartItem.product.id ? { ...item, quantity } : item,
      ),
    );
  }
}
