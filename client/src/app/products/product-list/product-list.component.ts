import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  ElementRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CartService } from 'src/app/cart/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../product-card-skeleton/product-card-skeleton.component';
import { ProductService } from '../product.service';

const SKELETON_ITEMS = 12;

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['../product-list/product-list.component.css'],
  imports: [FormsModule, ProductCardComponent, ProductCardSkeletonComponent],
})
export class ProductListComponent {
  pageTitle = 'Products';
  productService = inject(ProductService);
  cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });

  loadMoreSentinel = viewChild<ElementRef>('loadMoreSentinel');

  readonly skeletonItems = Array.from({ length: SKELETON_ITEMS }, (_, i) => i);

  products = this.productService.products;
  errorMessage = this.productService.producstError;

  constructor() {
    effect(() => {
      const q = (this.queryParams() as Params)?.['q'];
      if (q !== undefined) {
        this.searchTerm.set(typeof q === 'string' ? q : '');
      }
    });
    if (this.productService.products().length === 0 && !this.productService.loading()) {
      this.productService.loadInitial();
    }
    effect(() => {
      this.products();
      const sentinel = this.loadMoreSentinel()?.nativeElement as HTMLElement | undefined;
      if (!sentinel) return;
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0]?.isIntersecting) return;
          if (this.productService.hasMore() && !this.productService.loading()) {
            this.productService.loadMore();
          }
        },
        { rootMargin: '200px', threshold: 0 },
      );
      observer.observe(sentinel);
      return () => observer.disconnect();
    });
  }

  // Category filter: null = All
  selectedCategory = signal<string | null>(null);

  readonly categories: { id: string | null; label: string }[] = [
    { id: null, label: 'All' },
    { id: 'Pet Supplies', label: 'Pet Supplies' },
    { id: 'Furniture', label: 'Furniture' },
    { id: 'TVs & Accessories', label: 'TVs & Accessories' },
    { id: 'Home & Kitchen', label: 'Home & Kitchen' },
    { id: 'Grocery', label: 'Grocery' },
    { id: 'Health & Beauty', label: 'Health & Beauty' },
    { id: 'Electronics', label: 'Electronics' },
  ];

  // Filter & sort state
  searchTerm = signal<string>('');
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  inStockOnly = signal<boolean>(false);
  withReviewsOnly = signal<boolean>(false);
  sortBy = signal<'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'>(
    'relevance',
  );

  filteredProducts = computed(() => {
    const products = this.products();
    const list = Array.isArray(products) ? products : [];
    const term = this.searchTerm().trim().toLowerCase();
    const min = this.minPrice();
    const max = this.maxPrice();
    const stockOnly = this.inStockOnly();
    const reviewsOnly = this.withReviewsOnly();
    const category = this.selectedCategory();

    let result = list.filter((p) => {
      if (category != null && (p.category ?? '') !== category) {
        return false;
      }

      if (term) {
        const haystack =
          (p.productName ?? '') +
          ' ' +
          (p.productCode ?? '') +
          ' ' +
          (p.description ?? '');
        if (!haystack.toLowerCase().includes(term)) {
          return false;
        }
      }

      if (min !== null && p.price < min) {
        return false;
      }

      if (max !== null && p.price > max) {
        return false;
      }

      if (stockOnly) {
        const qty = Number(p.quantityInStock);
        if (!Number.isFinite(qty) || qty <= 0) return false;
      }

      if (reviewsOnly && !p.hasReviews) {
        return false;
      }

      return true;
    });

    switch (this.sortBy()) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result = [...result].sort((a, b) =>
          (a.productName ?? '').localeCompare(b.productName ?? ''),
        );
        break;
      case 'name-desc':
        result = [...result].sort((a, b) =>
          (b.productName ?? '').localeCompare(a.productName ?? ''),
        );
        break;
      case 'relevance':
      default:
        break;
    }

    return result;
  });

  onAddToCart(product: any): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/products' },
      });
      return;
    }
    if (!this.cartService.checkDuplicate(product)) {
      this.cartService.addProduct(product);
    }
  }

  onToggleFavorite(productId: number): void {
    this.productService.toggle(productId);
  }

  onRetry(): void {
    this.productService.refreshProducts();
  }

  // Handlers for template bindings
  onSearchChange(value: string | null | undefined): void {
    this.searchTerm.set(String(value ?? ''));
  }

  onMinPriceChange(value: string | number): void {
    const v = String(value ?? '').trim();
    const num = v === '' ? null : Number(v);
    this.minPrice.set(Number.isNaN(num) ? null : num);
  }

  onMaxPriceChange(value: string | number): void {
    const v = String(value ?? '').trim();
    const num = v === '' ? null : Number(v);
    this.maxPrice.set(Number.isNaN(num) ? null : num);
  }

  onSortChange(value: string): void {
    if (
      value === 'relevance' ||
      value === 'price-asc' ||
      value === 'price-desc' ||
      value === 'name-asc' ||
      value === 'name-desc'
    ) {
      this.sortBy.set(value);
    }
  }

  onCategorySelect(categoryId: string | null): void {
    this.selectedCategory.set(categoryId);
  }

  onInStockOnlyChange(checked: boolean): void {
    this.inStockOnly.set(!!checked);
  }
}
