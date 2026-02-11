import { Component, inject, signal } from '@angular/core';
import { Product } from '../products/product';
import { ProductService } from '../products/product.service';
import { ProductSkeletonComponent } from '../products/product-skelton';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'pm-favorites',
  imports: [ProductSkeletonComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css',
})
export class FavoritesComponent {
  productService = inject(ProductService);
  favoriteProduct!: any;
  isLoading = signal(true);
  skeletonItems = signal(Array.from({ length: 8 }));
  products = signal<Product[]>([]);
  environment = environment;
  router = inject(Router);

  ngOnInit() {
    this.productService.getProduct().subscribe((product) => {
      debugger;
      this.favoriteProduct = product;
      this.isLoading.set(false);
    });
  }

  removeFavorite(product: Product) {
    debugger;
    this.productService.removeFavorite(product.id);
  }
}
