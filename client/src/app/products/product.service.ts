import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../environment/environment';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';
import { HttpErrorService } from '../utilities/http-error.service';
import { Product, Result } from './product';

const PAGE_SIZE = 20;
const FAVORITES_STORAGE_KEY = 'raavishop_favorites';

function loadFavoritesFromStorage(): Set<number> {
  if (typeof localStorage === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as number[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
}

function saveFavoritesToStorage(ids: Set<number>): void {
  if (typeof localStorage === 'undefined') return;
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...ids]));
  } catch {}
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storeProductSubject = new BehaviorSubject<Product[]>([]);
  storeProduct$ = this.storeProductSubject.asObservable();
  private _favorites = signal<Set<number>>(loadFavoritesFromStorage());
  favorites = this._favorites.asReadonly();

  toggle(productId: number) {
    const current = new Set(this._favorites());

    if (current.has(productId)) {
      current.delete(productId);
    } else {
      current.add(productId);
    }

    this._favorites.set(current);
    saveFavoritesToStorage(current);
  }

  isFavorite(productId: number): boolean {
    return this._favorites().has(productId);
  }

  removeFavorite(productId: number) {
    const updated = this.storeProductSubject.value.filter(
      (product) => product.id !== productId,
    );
    debugger;
    this.storeProductSubject.next(updated);
  }

  api = `${environment.apiUrl}/product`;
  http = inject(HttpClient);
  errorService = inject(HttpErrorService);
  reviewService = inject(ReviewService);

  selectedProductId = signal<number | undefined>(undefined);

  // Paginated catalog: load pages via API as user scrolls
  private accumulatedProducts = signal<Product[]>([]);
  private currentPage = signal(0);
  private loadError = signal<string | undefined>(undefined);
  private _hasMore = signal(true);

  loading = signal(false);
  hasMore = this._hasMore.asReadonly();

  products = computed<Product[]>(() => this.accumulatedProducts());

  producstError = computed(() => this.loadError());

  /** Load first page (resets list). Call when entering product list or on refresh. */
  loadInitial(): void {
    if (this.loading()) return;
    this.loadError.set(undefined);
    this.accumulatedProducts.set([]);
    this.currentPage.set(0);
    this._hasMore.set(true);
    this.loadNextPage();
  }

  /** Load next page and append. Called on scroll near bottom or after loadInitial. */
  loadMore(): void {
    if (this.loading() || !this._hasMore()) return;
    this.loadNextPage();
  }

  private loadNextPage(): void {
    if (this.loading()) return;
    const next = this.currentPage() + 1;
    this.loading.set(true);
    this.loadError.set(undefined);
    this.http
      .get<{ data: Product[] }>(`${this.api}?page=${next}&limit=${PAGE_SIZE}`)
      .pipe(
        map((res) => res?.data ?? []),
        catchError((error) => {
          this.loadError.set(this.errorService.formatError(error));
          this.loading.set(false);
          return of([]);
        }),
      )
      .subscribe((data) => {
        this.currentPage.set(next);
        this.accumulatedProducts.update((prev) => [...prev, ...data]);
        this._hasMore.set(data.length >= PAGE_SIZE);
        this.loading.set(false);
      });
  }

  refreshProducts(): void {
    this.loadInitial();
  }

  getAllProducts(
    page: number = 1,
    limit: number = 10,
  ): Observable<Result<Product[]>> {
    return this.http
      .get<{ data: Product[] }>(`${this.api}?page=${page}&limit=${limit}`)
      .pipe(
        map((res) => ({ data: res?.data ?? [] }) as Result<Product[]>),
        catchError((error) =>
          of({
            data: [],
            error: this.errorService.formatError(error),
          } as Result<Product[]>),
        ),
      );
  }

  private productResult$ = toObservable(this.selectedProductId).pipe(
    filter(Boolean),
    switchMap((id) => {
      const productUrl = `${this.api}/${id}`;
      return this.http.get<Product>(productUrl).pipe(
        tap(() => console.log('in http.get by id pipeLine')),
        switchMap((product) => this.getProductWithReview(product)),
        catchError((err) =>
          of({
            data: undefined,
            error: this.errorService.formatError(err),
          } as Result<Product>),
        ),
      );
    }),
    map((p) => ({ data: p }) as Result<Product>),
  );
  private productResult = toSignal(this.productResult$);

  product = computed(() => this.productResult()?.data);
  productError = computed(() => this.productResult()?.error);

  // product$ = combineLatest([this.productSelected$, this.productsResult$]).pipe(
  //   map(([selectedProduct, products]) =>
  //     products.find((product) => product.id === selectedProduct)
  //   ),
  //   filter((product): product is Product => !!product),
  //   switchMap((product) =>
  //     this.getProductWithReview(product).pipe(
  //       catchError((err) => this.handleError(err))
  //     )
  //   )
  // );

  private getProductWithReview(product: Product): Observable<Product> {
    const withStock = {
      ...product,
      quantityInStock: product.quantityInStock ?? 50,
    } as Product;
    return this.http
      .get<Review[]>(this.reviewService.getReviewUrl(product.id))
      .pipe(
        map((reviews) => ({ ...withStock, reviews: reviews ?? [] }) as Product),
        catchError(() => of({ ...withStock, reviews: [] } as Product)),
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessages = this.errorService.formatError(err);
    return throwError(() => formattedMessages);
  }

  productSelected(selectedProductId: number): void {
    this.selectedProductId.set(selectedProductId);
  }
}
