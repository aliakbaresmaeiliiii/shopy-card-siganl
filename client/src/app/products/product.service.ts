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

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  // private productsUrl = `${environment.apiUrl}/product`;
  private storeProductSubject = new BehaviorSubject<Product[]>([]);
  storeProduct$ = this.storeProductSubject.asObservable();

  setProduct(product: Product) {
    const current = this.storeProductSubject.value;
    this.storeProductSubject.next([...current, product]);
  }

  getProduct(): Observable<Product | null> {
    return this.storeProduct$.pipe(
      map((products) => (products.length > 0 ? products[0] : null)),
    );
  }

  removeFavorite(productId: number) {
    const updated = this.storeProductSubject.value.filter(
      (product) => product.id !== productId,
    );
debugger;
    this.storeProductSubject.next(updated);
  }

  api = `${environment.apiUrl}/api/product`;
  http = inject(HttpClient);
  errorService = inject(HttpErrorService);
  reviewService = inject(ReviewService);

  selectedProductId = signal<number | undefined>(undefined);

  private productsResult$ = this.http.get<Product[]>(this.productsUrl).pipe(
    map((p) => ({ data: p }) as Result<Product[]>),
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
    tap(() => console.log('After shareReplay')),

    catchError((error) =>
      of({
        data: [],
        err: this.errorService.formatError(error),
      } as Result<Product[]>),
    ),
  );

  getAllProducts(
    page: number = 1,
    limit: number = 10,
  ): Observable<Result<Product[]>> {
    return this.http
      .get<Product[]>(`${this.api}?page=${page}&limit=${limit}`)
      .pipe(
        map((p) => ({ data: p }) as Result<Product[]>),
        catchError((error) =>
          of({
            data: [],
            err: this.errorService.formatError(error),
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

  products = computed(() => this.productsResult().data);
  producstError = computed(() => this.productsResult().error);

  private productResult$ = toObservable(this.selectedProductId).pipe(
    filter(Boolean),
    switchMap((id) => {
      const productUrl = this.productsUrl + '/' + id;
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
