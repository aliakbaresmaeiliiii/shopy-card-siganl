import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'pm-app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.css'],
})
export class AppFooterComponent {
  private readonly router = inject(Router);

  get showFooter(): boolean {
    return !this.router.url.includes('/login');
  }

  currentYear = new Date().getFullYear();

  shopLinks = [
    { label: 'All products', route: '/products' },
    { label: 'Cart', route: '/cart' },
    { label: 'Favorites', route: '/favorites' },
  ];

  helpLinks = [
    { label: 'Contact us', route: '/products' },
    { label: 'Shipping & returns', route: '/products' },
    { label: 'FAQ', route: '/products' },
  ];

  companyLinks = [
    { label: 'About Raavishop', route: '/welcome' },
    { label: 'Privacy', route: '/products' },
    { label: 'Terms', route: '/products' },
  ];
}
