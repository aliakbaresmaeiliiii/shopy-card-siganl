import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Product, Result } from './product';
import {
  catchError,
  map,
  mergeMap,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
  shareReplay,
  BehaviorSubject,
  filter,
  combineLatest,
} from 'rxjs';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';

  http = inject(HttpClient);
  errorService = inject(HttpErrorService);
  reviewService = inject(ReviewService);

  selectedProductId = signal<number | undefined>(undefined);

  private productsResult$ = this.http.get<Product[]>(this.productsUrl).pipe(
    map((p) => ({ data: p } as Result<Product[]>)),
    tap((p) => console.log(JSON.stringify(p))),
    shareReplay(1),
    tap(() => console.log('After shareReplay')),

    catchError((error) =>
      of({
        data: [],
        err: this.errorService.formatError(error),
      } as Result<Product[]>)
    )
  );

  private productsResult = toSignal(this.productsResult$, {
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
          } as Result<Product>)
        )
      );
    }),
    map((p) => ({ data: p } as Result<Product>))
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
        .pipe(map((reviews) => ({ ...product, reviews } as Product)));
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
