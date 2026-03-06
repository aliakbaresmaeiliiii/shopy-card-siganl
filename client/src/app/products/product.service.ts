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
  startWith,
  Subject,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { environment } from '../environment/environment';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';
import { HttpErrorService } from '../utilities/http-error.service';
import { Product, Result } from './product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private storeProductSubject = new BehaviorSubject<Product[]>([]);
  storeProduct$ = this.storeProductSubject.asObservable();
  private _favorites = signal<Set<number>>(new Set());
  favorites = this._favorites.asReadonly();

  toggle(productId: number) {
    const current = new Set(this._favorites());

    if (current.has(productId)) {
      current.delete(productId);
    } else {
      current.add(productId);
    }

    this._favorites.set(current);
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

  private refreshProducts$ = new Subject<void>();

  // All products for catalog view – first page with a high limit; refetch on refreshProducts$
  private productsResult$ = this.refreshProducts$.pipe(
    startWith(undefined),
    switchMap(() => this.getAllProducts(1, 100)),
    shareReplay(1),
  );

  refreshProducts(): void {
    this.refreshProducts$.next();
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
  // private productsResult = toSignal(this.productsResult$, {
  //   initialValue: { data: [] } as Result<Product[]>,
  // });

  productsResult = toSignal(this.productsResult$, {
    initialValue: { data: [] } as Result<Product[]>,
  });

  // Always expose a plain Product[] array, regardless of backend shape
  products = computed<Product[]>(() => {
    const result = this.productsResult();
    const raw: any = result?.data;

    if (Array.isArray(raw)) {
      return raw;
    }

    if (raw && Array.isArray(raw.data)) {
      return raw.data;
    }

    if (raw && raw.data && Array.isArray(raw.data.data)) {
      return raw.data.data;
    }

    return [];
  });
  producstError = computed(() => this.productsResult()?.error);

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
    if (product.hasReviews) {
      return this.http
        .get<Review[]>(this.reviewService.getReviewUrl(product.id))
        .pipe(map((reviews) => ({ ...product, reviews }) as Product));
    } else {
      return of(product);
    }
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessages = this.errorService.formatError(err);
    return throwError(() => formattedMessages);
  }

  productSelected(selectedProductId: number): void {
    this.selectedProductId.set(selectedProductId);
  }
}
