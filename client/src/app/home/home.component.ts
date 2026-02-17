import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '../pipe/currency.pipe';
import { ProductData } from '../products/product-data';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product';
import { ProductSkeletonComponent } from '../products/product-skelton';
import { ProductService } from '../products/product.service';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [ProductSkeletonComponent],
})
export class HomeComponent {
  products = signal<Product[]>([]);
  cartService = inject(CartService);
  productService = inject(ProductService);
  isLoading = signal(true);
  environment = environment;
  displayLimit = signal(8);
  skeletonItems = signal(Array.from({ length: 8 }));
  router = inject(Router);
  product = input();
  ngOnInit() {
    this.loadProducts();
  }

  currentPage = signal(1);
  loadProducts() {
    this.isLoading.set(true);
    this.productService
      .getAllProducts(this.currentPage(), 8)
      .subscribe((res: any) => {
        this.isLoading.set(false);
        this.products.update((prev) => [...prev, ...(res.data.data || [])]);
      });
  }
  productDetail(product: Product) {
    this.router.navigate(['/products', product.id]);
  }
  loadMore() {
    this.currentPage.set(this.currentPage() + 1);
    debugger;
    this.loadProducts();
  }

  isFavorite(product: Product) {
    // return this.productService.favorites.has(product.id);
  }

  addFavorite(product: Product) {
    // if (this.productService.favorites.has(product.id)) {
    //   this.productService.favorites.delete(product.id);
    // } else {
    //   this..favorites.add(product.id);
    // }
  }

  // addFavorite(product: Product) {
  //   this.productService.setProduct(product);
  // }

  addToCart(product: Product) {
    this.cartService.checkDuplicate(product)
      ? null
      : this.cartService.addProduct(product);
  }
}
