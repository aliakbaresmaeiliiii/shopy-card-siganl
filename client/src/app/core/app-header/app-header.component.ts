import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'pm-app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatMenuModule],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
})
export class AppHeaderComponent {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  pageTitle = 'Acme Product Management';
  cartCount = this.cartService.cartCount;

  menuItems = [
    { id: 1, name: 'home', routerLink: '/welcome' },
    { id: 2, name: 'Product List', routerLink: '/products' },
    { id: 3, name: 'Cart', routerLink: '/cart' },
  ];

  get showMenu(): boolean {
    return !this.router.url.includes('/login');
  }

  favorite(): void {
    this.router.navigate(['/favorites']);
  }
}
