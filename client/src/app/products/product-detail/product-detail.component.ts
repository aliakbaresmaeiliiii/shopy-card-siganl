import { Component, computed, inject } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    imports: [CurrencyPipe]
})
export class ProductDetailComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);

  product = this.productService.product;
  errorMessage = this.productService.producstError;

  pageTitle = computed(() => {
    const product = this.product();
    return product
      ? `Product Detail for: ${product.productName}`
      : 'Product Detail';
  });

  addToCart(product: Product) {
    this.cartService.checkDuplicate(product) ? null :
    this.cartService.addProduct(product);
  }
}
