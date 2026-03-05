import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CartService } from 'src/app/cart/cart.service';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['../product-list/product-list.component.css'],
  imports: [FormsModule, ProductCardComponent],
})
export class ProductListComponent {
  pageTitle = 'Products';
  productService = inject(ProductService);
  cartService = inject(CartService);

  products = this.productService.products;
  errorMessage = this.productService.productError;

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

    let result = list.filter((p) => {
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

      if (stockOnly && (p.quantityInStock ?? 0) <= 0) {
        return false;
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
    if (!this.cartService.checkDuplicate(product)) {
      this.cartService.addProduct(product);
    }
  }

  onToggleFavorite(productId: number): void {
    this.productService.toggle(productId);
  }

  // Handlers for template bindings
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }

  onMinPriceChange(value: string): void {
    const v = value.trim();
    this.minPrice.set(v === '' ? null : Number(v));
  }

  onMaxPriceChange(value: string): void {
    const v = value.trim();
    this.maxPrice.set(v === '' ? null : Number(v));
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
}
