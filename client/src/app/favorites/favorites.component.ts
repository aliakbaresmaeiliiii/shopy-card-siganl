import { Component, inject, signal } from '@angular/core';
import { Product } from '../products/product';
import { ProductService } from '../products/product.service';
import { ProductSkeletonComponent } from '../products/product-skelton';
import { environment } from '../environment/environment';
import { Router } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'pm-favorites',
  imports: [ HomeComponent],
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

  ngOnInit() {}

  removeFavorite(product: Product) {
    debugger;
    this.productService.removeFavorite(product.id);
  }
}
