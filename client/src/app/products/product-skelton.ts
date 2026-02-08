import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-skeleton',
  template: ` <div
    class="bg-white rounded-2xl shadow-lg animate-pulse overflow-hidden h-full flex flex-col"
  >
    <div class="relative w-full h-60 bg-gray-200"></div>
    <div class="p-4 flex-1 flex flex-col justify-between">
      <div class="space-y-2">
        <div class="h-6 bg-gray-200 rounded w-3/4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-5 bg-gray-200 rounded w-1/3"></div>
      </div>
      <div class="mt-4 h-10 bg-gray-200 rounded w-full"></div>
    </div>
  </div>`,
})
export class ProductSkeletonComponent {
  count = input<number>(1);
}
