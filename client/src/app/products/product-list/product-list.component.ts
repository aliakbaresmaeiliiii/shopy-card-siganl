import {
  Component,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  ElementRef,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductCardSkeletonComponent } from '../product-card-skeleton/product-card-skeleton.component';
import { ProductService } from '../product.service';

const SKELETON_ITEMS = 12;

const BANNER_SLIDES = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/shop1/1200/400',
    title: 'Discover something you’ll love',
    sub: 'Curated products, trusted quality. Browse by category or search to find your next favourite.',
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/shop2/1200/400',
    title: 'New arrivals every week',
    sub: 'Fresh picks and bestsellers. Free shipping on orders over a threshold.',
  },
  {
    id: 3,
    image: 'https://picsum.photos/seed/shop3/1200/400',
    title: 'Shop by category',
    sub: 'Electronics, Home, Health & Beauty and more. Filter and sort to find exactly what you need.',
  },
  {
    id: 4,
    image: 'https://picsum.photos/seed/shop4/1200/400',
    title: 'Easy returns & secure checkout',
    sub: 'Buy with confidence. We’re here to help if you need anything.',
  },
];

const PROMO_BANNERS = [
  {
    id: 1,
    image: 'https://picsum.photos/seed/promo1/400/240',
    title: 'Under promotion',
    link: ['/products'],
    queryParams: { q: 'deal' },
  },
  {
    id: 2,
    image: 'https://picsum.photos/seed/promo2/400/240',
    title: 'Special offer',
    link: ['/products'],
  },
];

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['../product-list/product-list.component.css'],
  imports: [FormsModule, RouterLink, ProductCardComponent, ProductCardSkeletonComponent],
})
export class ProductListComponent {
  pageTitle = 'Products';
  productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private queryParams = toSignal(this.route.queryParams, { initialValue: {} });

  loadMoreSentinel = viewChild<ElementRef>('loadMoreSentinel');

  readonly skeletonItems = Array.from({ length: SKELETON_ITEMS }, (_, i) => i);
  readonly bannerSlides = BANNER_SLIDES;
  readonly promoBanners = PROMO_BANNERS;
  activeSlideIndex = signal(0);

  goToSlide(index: number): void {
    this.activeSlideIndex.set((index + BANNER_SLIDES.length) % BANNER_SLIDES.length);
  }

  nextSlide(): void {
    this.goToSlide(this.activeSlideIndex() + 1);
  }

  prevSlide(): void {
    this.goToSlide(this.activeSlideIndex() - 1);
  }

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
    interval(5000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.nextSlide());
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
