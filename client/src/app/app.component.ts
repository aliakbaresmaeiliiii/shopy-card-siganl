//import 'zone.js/dist/zone';  // Required for Stackblitz
import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { CartService } from './cart/cart.service';

@Component({
  selector: 'pm-root',
  imports: [RouterLinkActive, RouterLink, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  pageTitle = 'Acme Product Management';
  cartService = inject(CartService);
  menuItems = [
    {
      id: 1,
      name: 'home',
      routerLink:'/welcome',
    },
    {
      id: 1,
      name: 'Product List',
      routerLink:'/products'

    },
    {
      id: 1,
      name: 'Cart',
      routerLink:'/cart'

    },
  ];

  cartCount = this.cartService.cartCount;
}
