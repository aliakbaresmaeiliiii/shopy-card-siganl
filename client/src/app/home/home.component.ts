import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '../pipe/currency.pipe';
import { ProductData } from '../products/product-data';
import { CartService } from '../cart/cart.service';
import { Product } from '../products/product';
import { ProductSkeletonComponent } from '../products/product-skelton';

@Component({
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CurrencyPipe, ProductSkeletonComponent],
})
export class HomeComponent {
  products = signal<Product[]>([
    {
      id: 1,
      productName: 'Wireless Headphones',
      productCode: 'WH-001',
      price: 99.99,
      image: 'assets/products/headphones.png',
    },
    {
      id: 2,
      productName: 'Smart Watch',
      productCode: 'SW-002',
      price: 149.99,
      image: 'assets/products/watch.png',
    },
    {
      id: 3,
      productName: 'Bluetooth Speaker',
      productCode: 'BS-003',
      price: 79.99,
      image: 'assets/products/speaker.png',
    },
    {
      id: 4,
      productName: 'Gaming Mouse',
      productCode: 'GM-004',
      price: 49.99,
      image: 'assets/products/mouse.png',
    },
    {
      id: 5,
      productName: 'Mechanical Keyboard',
      productCode: 'MK-005',
      price: 129.99,
      image: 'assets/products/keyboard.png',
    },
    {
      id: 6,
      productName: 'HD Webcam',
      productCode: 'WC-006',
      price: 59.99,
      image: 'assets/products/webcam.png',
    },
    {
      id: 7,
      productName: 'Portable Charger',
      productCode: 'PC-007',
      price: 39.99,
      image: 'assets/products/charger.png',
    },
    {
      id: 8,
      productName: 'VR Headset',
      productCode: 'VR-008',
      price: 299.99,
      image: 'assets/products/vr.png',
    },
    {
      id: 9,
      productName: 'Smartphone Gimbal',
      productCode: 'SG-009',
      price: 89.99,
      image: 'assets/products/gimbal.png',
    },
    {
      id: 10,
      productName: 'Action Camera',
      productCode: 'AC-010',
      price: 199.99,
      image: 'assets/products/action-camera.png',
    },
    {
      id: 11,
      productName: 'Noise Cancelling Earbuds',
      productCode: 'EB-011',
      price: 119.99,
      image: 'assets/products/earbuds.png',
    },
    {
      id: 12,
      productName: 'Laptop Stand',
      productCode: 'LS-012',
      price: 49.99,
      image: 'assets/products/laptop-stand.png',
    },
    {
      id: 13,
      productName: 'External Hard Drive',
      productCode: 'HD-013',
      price: 89.99,
      image: 'assets/products/hard-drive.png',
    },
    {
      id: 14,
      productName: 'Smart Light Bulb',
      productCode: 'LB-014',
      price: 29.99,
      image: 'assets/products/light-bulb.png',
    },
    {
      id: 15,
      productName: 'Fitness Tracker',
      productCode: 'FT-015',
      price: 59.99,
      image: 'assets/products/fitness-tracker.png',
    },
    {
      id: 16,
      productName: 'Wireless Charger',
      productCode: 'WC-016',
      price: 39.99,
      image: 'assets/products/wireless-charger.png',
    },
    {
      id: 17,
      productName: 'Digital Photo Frame',
      productCode: 'PF-017',
      price: 79.99,
      image: 'assets/products/photo-frame.png',
    },
    {
      id: 18,
      productName: 'Portable Projector',
      productCode: 'PJ-018',
      price: 249.99,
      image: 'assets/products/projector.png',
    },
    {
      id: 19,
      productName: 'Smart Thermostat',
      productCode: 'ST-019',
      price: 199.99,
      image: 'assets/products/thermostat.png',
    },
    {
      id: 20,
      productName: 'Tablet Stand',
      productCode: 'TS-020',
      price: 34.99,
      image: 'assets/products/tablet-stand.png',
    },
  ]);
  cartService = inject(CartService);

  displayLimit = signal(8);
  skeletonItems = signal(Array.from({ length: 8 }));

  displayProducts = computed(() =>
    this.products().slice(0, this.displayLimit()),
  );

  isLoading = signal(true);

  constructor() {
    this.loadProducts();
  }
  loadProducts() {
    // simulate API call
    setTimeout(() => {
      this.products();
      this.isLoading.set(false);
    }, 2000); // 2 seconds loading
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
