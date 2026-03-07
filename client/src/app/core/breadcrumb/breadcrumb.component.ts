import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { ProductService } from '../../products/product.service';

export interface BreadcrumbItem {
  label: string;
  url: string | null;
}

const PATH_LABELS: Record<string, string> = {
  welcome: 'Home',
  products: 'Products',
  cart: 'Cart',
  favorites: 'Favorites',
  checkout: 'Checkout',
  login: 'Sign in',
};

@Component({
  selector: 'pm-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css'],
})
export class BreadcrumbComponent {
  private readonly router = inject(Router);
  private readonly productService = inject(ProductService);

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(() => this.router.url),
    ),
    { initialValue: this.router.url },
  );

  showBreadcrumb = computed(() => !this.router.url.includes('/login'));

  breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const url = this.url();
    if (!url || url.includes('/login')) return [];
    const parts = url.split('?')[0].split('/').filter(Boolean);
    if (parts.length === 0 || parts[0] === 'welcome') {
      return [{ label: 'Home', url: null }];
    }
    const items: BreadcrumbItem[] = [{ label: 'Home', url: '/welcome' }];
    let path = '';
    for (let i = 0; i < parts.length; i++) {
      const segment = parts[i];
      path += '/' + segment;
      const isLast = i === parts.length - 1;
      if (/^\d+$/.test(segment)) {
        const product = this.productService.product();
        items.push({ label: product?.productName ?? 'Product', url: null });
      } else {
        const label = PATH_LABELS[segment] ?? this.titleCase(segment);
        items.push({ label, url: isLast ? null : path });
      }
    }
    return items;
  });

  private titleCase(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }
}
