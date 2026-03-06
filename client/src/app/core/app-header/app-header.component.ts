import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'pm-app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
})
export class AppHeaderComponent {
  private readonly router = inject(Router);
  private readonly cartService = inject(CartService);

  brandName = 'Raavishop';
  cartCount = this.cartService.cartCount;
  accountMenuOpen = signal(false);

  menuItems = [
    { id: 1, name: 'Home', routerLink: '/products' },
    { id: 2, name: 'Cart', routerLink: '/cart' },
    { id: 3, name: 'Favorites', routerLink: '/favorites' },
  ];

  get showMenu(): boolean {
    return !this.router.url.includes('/login');
  }

  toggleAccountMenu(): void {
    this.accountMenuOpen.update((open) => !open);
  }

  closeAccountMenu(): void {
    this.accountMenuOpen.set(false);
  }

}
