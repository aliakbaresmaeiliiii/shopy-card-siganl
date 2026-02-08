import { Component, computed, inject } from '@angular/core';

import { CurrencyPipe } from '@angular/common';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  imports: [CurrencyPipe, MatButtonModule],
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
    this.cartService.checkDuplicate(product)
      ? null
      : this.cartService.addProduct(product);
  }
}
