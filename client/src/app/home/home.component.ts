import { Component, inject, signal, viewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../products/product';
import { ProductService } from '../products/product.service';
import { ProductCardComponent } from '../products/product-card/product-card.component';

/** Sub-category tile: image + label inside a category box */
interface SubCategory {
  id: string;
  label: string;
  image: string;
}

/** Main category box: title + 4 sub-category tiles + "See more" link */
interface CategoryBox {
  id: string;
  title: string;
  subCategories: SubCategory[];
  linkText: string;
}

const CATEGORY_BOXES: CategoryBox[] = [
  {
    id: 'family',
    title: 'Have more fun with family',
    linkText: 'See more',
    subCategories: [
      { id: 'play', label: 'Outdoor Play Sets', image: 'https://picsum.photos/seed/play/200/200' },
      { id: 'learning', label: 'Learning Toys', image: 'https://picsum.photos/seed/learning/200/200' },
      { id: 'action', label: 'Action Figures', image: 'https://picsum.photos/seed/action/200/200' },
      { id: 'pretend', label: 'Pretend Play Toys', image: 'https://picsum.photos/seed/pretend/200/200' },
    ],
  },
  {
    id: 'wireless',
    title: 'Wireless Tech',
    linkText: 'Discover more',
    subCategories: [
      { id: 'phones', label: 'Smartphones', image: 'https://picsum.photos/seed/phones/200/200' },
      { id: 'watches', label: 'Watches', image: 'https://picsum.photos/seed/watches/200/200' },
      { id: 'headphones', label: 'Headphones', image: 'https://picsum.photos/seed/headphones/200/200' },
      { id: 'tablets', label: 'Tablets', image: 'https://picsum.photos/seed/tablets/200/200' },
    ],
  },
  {
    id: 'pc',
    title: 'Level up your PC here',
    linkText: 'Discover more',
    subCategories: [
      { id: 'laptops', label: 'Laptops', image: 'https://picsum.photos/seed/laptops/200/200' },
      { id: 'pcs', label: 'PCs', image: 'https://picsum.photos/seed/pcs/200/200' },
      { id: 'drives', label: 'Hard Drives', image: 'https://picsum.photos/seed/drives/200/200' },
      { id: 'monitors', label: 'Monitors', image: 'https://picsum.photos/seed/monitors/200/200' },
    ],
  },
  {
    id: 'fitness',
    title: 'Gear up to get fit',
    linkText: 'Discover more',
    subCategories: [
      { id: 'clothing', label: 'Clothing', image: 'https://picsum.photos/seed/fitcloth/200/200' },
      { id: 'trackers', label: 'Trackers', image: 'https://picsum.photos/seed/trackers/200/200' },
      { id: 'equipment', label: 'Equipment', image: 'https://picsum.photos/seed/equipment/200/200' },
      { id: 'deals', label: 'Deals', image: 'https://picsum.photos/seed/deals/200/200' },
    ],
  },
];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  styleUrls: ['./home.component.css'],
  imports: [RouterLink, ProductCardComponent],
})
export class HomeComponent {
  private readonly productService = inject(ProductService);

  topPicksCarousel = viewChild<ElementRef>('topPicksCarousel');

  readonly categoryBoxes = CATEGORY_BOXES;
  readonly topPicks = signal<Product[]>([]);
  readonly topPicksLoading = signal(true);

  constructor() {
    this.productService.getAllProducts(1, 8).subscribe((result) => {
      this.topPicks.set(result.data ?? []);
      this.topPicksLoading.set(false);
    });
  }

  isFavorite(productId: number): boolean {
    return this.productService.isFavorite(productId);
  }

  onToggleFavorite(productId: number): void {
    this.productService.toggle(productId);
  }

  scrollTopPicks(direction: 'left' | 'right'): void {
    const el = this.topPicksCarousel()?.nativeElement;
    if (!el) return;
    const step = 280;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  }
}
