import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-skeleton',
  template: `
    <div class="product-skeleton">
      <div class="product-skeleton__image"></div>
      <div class="product-skeleton__body">
        <div class="product-skeleton__line product-skeleton__line--title"></div>
        <div class="product-skeleton__line product-skeleton__line--code"></div>
        <div class="product-skeleton__cta"></div>
      </div>
    </div>
  `,
  styles: `
    .product-skeleton {
      background: #fff;
      border-radius: 1rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04);
      overflow: hidden;
    }
    .product-skeleton__image {
      aspect-ratio: 1;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: product-skeleton-shine 1.2s ease-in-out infinite;
    }
    .product-skeleton__body {
      padding: 1rem 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .product-skeleton__line {
      height: 0.875rem;
      border-radius: 0.25rem;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: product-skeleton-shine 1.2s ease-in-out infinite;
    }
    .product-skeleton__line--title {
      width: 85%;
      height: 1rem;
    }
    .product-skeleton__line--code {
      width: 50%;
    }
    .product-skeleton__cta {
      margin-top: 0.5rem;
      height: 2.5rem;
      border-radius: 0.5rem;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%;
      animation: product-skeleton-shine 1.2s ease-in-out infinite;
    }
    @keyframes product-skeleton-shine {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
})
export class ProductSkeletonComponent {
  count = input<number>(1);
}
