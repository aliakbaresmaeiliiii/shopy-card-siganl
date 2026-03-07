import { Component, computed, effect, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CartService } from 'src/app/cart/cart.service';
import { Product } from '../product';
import { ProductService } from '../product.service';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environment/environment';
import { siteTitle } from '../../app.routes';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [CurrencyPipe, MatButtonModule],
})
export class ProductDetailComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private route = inject(ActivatedRoute);
  private title = inject(Title);

  product = this.productService.product;
  errorMessage = this.productService.producstError;
  apiUrl = environment.apiUrl;

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : undefined;
    if (id) {
      this.productService.productSelected(id);
    }
    effect(() => {
      const p = this.product();
      if (p?.productName) {
        this.title.setTitle(`${p.productName} | ${siteTitle}`);
      }
    });
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
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/products/${product.id}` },
      });
      return;
    }
    if (!this.cartService.checkDuplicate(product)) {
      this.cartService.addProduct(product);
    }
  }
}
