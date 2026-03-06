import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environment/environment';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [CurrencyPipe, MatButtonModule],
})
export class ProductDetailComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  product = this.productService.product;
  errorMessage = this.productService.producstError;
  apiUrl = environment.apiUrl;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      this.productService.productSelected(id);
    }
  }

  /** Use CDN image when absolute URL, otherwise backend-relative. */
  imageSrc(image: string | undefined): string {
    if (!image) return '';
    return image.startsWith('http://') || image.startsWith('https://')
      ? image
      : this.apiUrl + image;
  }

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
