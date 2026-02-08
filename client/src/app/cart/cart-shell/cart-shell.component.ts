import { Component } from '@angular/core';
import { CartTotalComponent } from '../cart-total/cart-total.component';
import { CartListComponent } from '../cart-list/cart-list.component';

@Component({
    imports: [CartListComponent, CartTotalComponent],
    template: `
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

  <!-- Cart header -->
  <h1 class="text-2xl font-bold text-gray-800 mb-6">
    Your Shopping Cart
  </h1>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

    <!-- Cart list (takes 2/3 on large screens) -->
    <div class="lg:col-span-2">
      <sw-cart-list/>
    </div>

    <!-- Cart total summary (takes 1/3 on large screens) -->
    <div class="lg:col-span-1">
      <sw-cart-total/>
    </div>

  </div>

</div>

  `
})
export class CartShellComponent {

}
