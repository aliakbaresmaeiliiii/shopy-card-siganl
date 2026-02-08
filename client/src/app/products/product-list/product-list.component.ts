import { Component, effect, inject } from '@angular/core';

import { NgClass } from '@angular/common';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    imports: [NgClass, ProductDetailComponent]
})
export class ProductListComponent {
  pageTitle = 'Products';
  productService = inject(ProductService);

  products = this.productService.products;
  errorMessage = this.productService.productError;
  // Selected product id to highlight the entry
  selectedProductId = this.productService.selectedProductId;

  onSelected(productId: number): void {
    this.productService.productSelected(productId);
    // this.service.getProduct(productId).pipe(
    //   tap(()=>console.log('data product come'))
    // ).subscribe((res) => {});
  }
}
