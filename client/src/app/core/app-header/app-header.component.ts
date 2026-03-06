import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../cart/cart.service';

/** Shopee-style search suggestions (keywords that match products). */
const SEARCH_SUGGESTIONS = [
  'phone', 'headphones', 'laptop', 'watch', 'speaker', 'keyboard', 'mouse',
  'camera', 'charger', 'gaming', 'ps5', 'tv', 'desk', 'bag', 'monitor',
  'wireless', 'smart', 'bluetooth', 'usb', 'stand', 'led', 'webcam',
  'printer', 'coffee', 'kettle', 'yoga', 'fitness', 'vacuum', 'scale',
];

@Component({
  selector: 'pm-app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css'],
})
export class AppHeaderComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cartService = inject(CartService);

  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });

  brandName = 'Raavishop';
  headerSearchQuery = signal('');
  searchDropdownOpen = signal(false);
  cartCount = this.cartService.cartCount;
  accountMenuOpen = signal(false);

  filteredSuggestions = computed(() => {
    const q = this.headerSearchQuery().trim().toLowerCase();
    if (!q) {
      return SEARCH_SUGGESTIONS.slice(0, 10);
    }
    return SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q)).slice(0, 10);
  });

  constructor() {
    effect(() => {
      const q = (this.queryParams() as Params)?.['q'];
      if (q !== undefined && typeof q === 'string') {
        this.headerSearchQuery.set(q);
      }
    });
  }

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

  onHeaderSearch(): void {
    const q = this.headerSearchQuery().trim();
    this.searchDropdownOpen.set(false);
    this.router.navigate(['/products'], { queryParams: q ? { q } : {} });
  }

  openSearchDropdown(): void {
    this.searchDropdownOpen.set(true);
  }

  closeSearchDropdown(): void {
    setTimeout(() => this.searchDropdownOpen.set(false), 150);
  }

  selectSuggestion(suggestion: string): void {
    this.headerSearchQuery.set(suggestion);
    this.searchDropdownOpen.set(false);
    this.router.navigate(['/products'], { queryParams: { q: suggestion } });
  }
}
