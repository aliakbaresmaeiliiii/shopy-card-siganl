//import 'zone.js/dist/zone';  // Required for Stackblitz
import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterLink, RouterOutlet, Router } from '@angular/router';
import { CartService } from './cart/cart.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
@Component({
  selector: 'pm-root',
  imports: [
    RouterLinkActive,
    RouterLink,
    RouterOutlet,
    MatBadgeModule,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  pageTitle = 'Acme Product Management';
  cartService = inject(CartService);
  router = inject(Router);
  menuItems = [
    {
      id: 1,
      name: 'home',
      routerLink: '/welcome',
    },
    {
      id: 1,
      name: 'Product List',
      routerLink: '/products',
    },
    {
      id: 1,
      name: 'Cart',
      routerLink: '/cart',
    },
  ];

  favorite(){
    this.router.navigate(['/favorites']);
  }
  cartCount = this.cartService.cartCount;
}
