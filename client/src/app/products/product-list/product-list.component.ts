import { Component, inject } from '@angular/core';

import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list.component.html',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent],
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
