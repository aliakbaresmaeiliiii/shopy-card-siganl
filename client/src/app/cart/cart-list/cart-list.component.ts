import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartItem } from '../cart';
import { CartItemComponent } from '../cart-item/cart-item.component';
import { CartService } from '../cart.service';

@Component({
  selector: 'sw-cart-list',
  standalone: true,
  imports: [CartItemComponent, RouterLink],
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css'],
})
export class CartListComponent {
  pageTitle = 'Cart';
  cartService = inject(CartService);
  cartItems = this.cartService.cartItems;
}
