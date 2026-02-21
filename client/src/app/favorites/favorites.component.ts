import { Component, computed, inject, signal } from '@angular/core';
import { Product } from '../products/product';
import { ProductService } from '../products/product.service';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'pm-favorites',
  imports: [ProductCardComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  productService = inject(ProductService);
  cartService = inject(CartService);
  products = signal<Product[]>([]);
  isLoading = signal(true);

  favoriteProducts = computed(() =>
    this.products().filter((p) => this.productService.favorites().has(p.id))
  );

  ngOnInit() {
    this.productService.getAllProducts(1, 100).subscribe((res: any) => {
      this.isLoading.set(false);
      const data = res.data?.data ?? res.data ?? [];
      this.products.set(Array.isArray(data) ? data : []);
    });
  }

  addToCart(product: Product) {
    if (!this.cartService.checkDuplicate(product)) {
      this.cartService.addProduct(product);
    }
  }
}
