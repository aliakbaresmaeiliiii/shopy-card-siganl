import { computed, Injectable, signal } from '@angular/core';
import { CartItem } from './cart';
import { Product } from '../products/product';

const CART_STORAGE_KEY = 'raavishop_cart';

function loadCartFromStorage(): CartItem[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>(loadCartFromStorage());
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

  addProduct(product: Product, quantity: number = 1): void {
    const existing = this.cartItems().find((i) => i.product.id === product.id);
    if (existing) {
      this.updateQuantity(existing, existing.quantity + quantity);
      return;
    }
    this.cartItems.update((item) => {
      const next = [...item, { product, quantity }];
      saveCartToStorage(next);
      return next;
    });
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update((item) => {
      const next = item.filter((i) => i.product.id !== cartItem.product.id);
      saveCartToStorage(next);
      return next;
    });
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update((item) => {
      const next = item.map((i) =>
        i.product.id === cartItem.product.id ? { ...i, quantity } : i,
      );
      saveCartToStorage(next);
      return next;
    });
  }
}
