import { Component, inject, signal } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product';
import { ProductSkeletonComponent } from '../products/product-skelton';
import { ProductService } from '../products/product.service';
import { ProductCardComponent } from '../products/product-card/product-card.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [ProductSkeletonComponent, ProductCardComponent],
})
export class HomeComponent {
  products = signal<Product[]>([]);
  cartService = inject(CartService);
  productService = inject(ProductService);
  isLoading = signal(true);
  displayLimit = signal(8);
  skeletonItems = signal(Array.from({ length: 8 }));

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
  loadMore() {
    this.currentPage.set(this.currentPage() + 1);
    this.loadProducts();
  }

  addToCart(product: Product) {
    this.cartService.checkDuplicate(product)
      ? null
      : this.cartService.addProduct(product);
  }
}
