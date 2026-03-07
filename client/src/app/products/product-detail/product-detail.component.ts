import { Component, computed, DestroyRef, effect, inject, signal, HostListener } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environment/environment';
import { siteTitle } from '../../app.routes';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [CurrencyPipe, MatButtonModule, FormsModule],
})
export class ProductDetailComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);
  private title = inject(Title);

  product = this.productService.product;
  errorMessage = this.productService.producstError;
  apiUrl = environment.apiUrl;

  selectedThumb = signal<string>('');
  selectedSpec = signal<string>('');
  quantity = signal<number>(1);
  private countdownEnd = Date.now() + 47 * 60 * 1000 + 23 * 1000;
  private now = signal(Date.now());

  private routeId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: this.route.snapshot.paramMap.get('id') },
  );

  constructor() {
    effect(() => {
      const idParam = this.routeId();
      const id = idParam ? Number(idParam) : undefined;
      if (id && !Number.isNaN(id)) {
        this.productService.productSelected(id);
      }
    });
    effect(() => {
      const p = this.product();
      if (p?.productName) {
        this.title.setTitle(`${p.productName} | ${siteTitle}`);
      }
    });
    effect(() => {
      const p = this.product();
      if (p) {
        this.selectedThumb.set(this.mainImageUrl(p));
        this.quantity.set(1);
        this.selectedSpec.set('109999PA');
      }
    });
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.now.set(Date.now()));
  }

  /** Treat missing/undefined quantityInStock as in stock (50). */
  stockQuantity(product: Product): number {
    const q = product?.quantityInStock;
    if (q != null && Number.isFinite(Number(q))) return Number(q);
    return 50;
  }

  /** Shopee-style delivery estimate: "Arrives tomorrow" or "Within 2 days". */
  deliveryLabel(product: Product): string {
    return product?.id % 2 === 0 ? 'Arrives tomorrow' : 'Within 2 days';
  }

  /** Sold count for display (fallback when not from API). */
  soldCount(product: Product): number {
    const n = product?.soldCount;
    if (n != null && Number.isFinite(Number(n)) && n > 0) return Number(n);
    return (product?.id ?? 0) * 12 + 50;
  }

  thumbnails(product: Product): { src: string; alt: string }[] {
    const main = this.mainImageUrl(product);
    if (!main) return [];
    const list = [{ src: main, alt: product?.productName ?? '' }];
    for (let i = 1; i <= 3; i++) {
      list.push({ src: main, alt: `${product?.productName ?? ''} view ${i}` });
    }
    return list;
  }

  favoriteCount(product: Product): number {
    return 10 + ((product?.id ?? 0) % 15);
  }

  ratingCount(product: Product): number {
    const reviews = product?.reviews?.length ?? 0;
    return reviews > 0 ? reviews : 4;
  }

  countdownDisplay = computed(() => {
    const now = Date.now();
    const left = Math.max(0, this.countdownEnd - now);
    const h = Math.floor(left / 3600000);
    const m = Math.floor((left % 3600000) / 60000);
    const s = Math.floor((left % 60000) / 1000);
    return `${String(h).padStart(2, '0')} ${String(m).padStart(2, '0')} ${String(s).padStart(2, '0')}`;
  });

  originalPrice(product: Product): number {
    const p = product?.price;
    if (p == null || !Number.isFinite(p)) return 99.99;
    return Math.round(p * (1 + 0.5 + (product?.id ?? 0) % 3));
  }

  discountPercent(product: Product): number {
    const orig = this.originalPrice(product);
    const curr = product?.price;
    if (curr == null || orig <= 0) return 0;
    return Math.min(99, Math.round(((orig - curr) / orig) * 100));
  }

  guaranteeDate(): string {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  specificationOptions(_product: Product): string[] {
    return ['109999PA', '99999PA'];
  }

  setQuantity(v: number | string, product?: Product): void {
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    const max = product ? this.stockQuantity(product) : 999;
    this.quantity.set(Math.max(1, Math.min(max, Math.floor(n))));
  }

  incrementQty(product: Product): void {
    const max = this.stockQuantity(product);
    this.quantity.update((q) => Math.min(max, q + 1));
  }

  decrementQty(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  buyNow(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/products/${product.id}` } });
      return;
    }
    if (!this.cartService.checkDuplicate(product)) {
      this.cartService.addProduct(product, this.quantity());
    }
    this.router.navigate(['/cart']);
  }

  /** Use CDN image when absolute URL, otherwise backend-relative. */
  imageSrc(image: string | undefined): string {
    if (!image) return '';
    return image.startsWith('http://') || image.startsWith('https://')
      ? image
      : this.apiUrl + image;
  }

  /** Main image URL with fallback so image always shows. */
  mainImageUrl(product: Product): string {
    const src = this.imageSrc(product?.image);
    if (src) return src;
    const id = product?.id ?? 0;
    return `https://picsum.photos/seed/product-${id}/600/600`;
  }

  imageDialogOpen = signal(false);
  imageDialogSrc = signal<string>('');
  imageDialogAlt = signal('');

  openImageDialog(src: string, alt: string): void {
    this.imageDialogSrc.set(src);
    this.imageDialogAlt.set(alt);
    this.imageDialogOpen.set(true);
  }

  closeImageDialog(): void {
    this.imageDialogOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.imageDialogOpen()) this.closeImageDialog();
  }

  pageTitle = computed(() => {
    const product = this.product();
    return product
      ? `Product Detail for: ${product.productName}`
      : 'Product Detail';
  });

  addToCart(product: Product): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${product.id}` },
      });
      return;
    }
    this.cartService.addProduct(product, this.quantity());
  }
}
