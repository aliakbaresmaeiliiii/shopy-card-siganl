import { Component, inject, OnDestroy, OnInit } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';
import { catchError, EMPTY, Subscription, tap } from 'rxjs';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe],
})
export class ProductListComponent {
  // Just enough here for the template to compile
  pageTitle = 'Products';
  productSerice = inject(ProductService);

  products = this.productSerice.products;
  errorMessage = this.productSerice.producstError;
  // Selected product id to highlight the entry
  selectedProductId = this.productSerice.selectedProductId;



  onSelected(productId: number): void {
    this.productSerice.productSelected(productId);
    // this.service.getProduct(productId).pipe(
    //   tap(()=>console.log('data product come'))
    // ).subscribe((res) => {});
  }
}
