import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '../pipe/currency.pipe';
import { ProductData } from '../products/product-data';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product';
import { ProductSkeletonComponent } from '../products/product-skelton';
import { ProductService } from '../products/product.service';
import { environment } from '../environment/environment';

@Component({
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CurrencyPipe, ProductSkeletonComponent],
})
export class HomeComponent {
  products = signal<Product[]>([]);
  cartService = inject(CartService);
  productService = inject(ProductService);
  isLoading = signal(true);
  environment = environment;
  displayLimit = signal(8);
  skeletonItems = signal(Array.from({ length: 8 }));

  displayProducts = computed(() =>
    this.productService.getAllProducts().subscribe((res) => {
      debugger;
      this.products.set(res.data || []);
      this.products().slice(0, this.displayLimit());
    }),
  );

  ngOnInit() {
    this.loadProducts();
  }

 


  loadProducts() {
    // simulate API call
    this.productService.getAllProducts().subscribe((result: any) => {
      this.isLoading.set(false);
      console.log(result.data.data);
      this.products.set(result.data.data || []);
    });
  }

  loadMore() {
    this.displayLimit.set(this.displayLimit() + 8);
  }

  addToCart(product: Product) {
    this.cartService.checkDuplicate(product)
      ? null
      : this.cartService.addProduct(product);
  }
}
