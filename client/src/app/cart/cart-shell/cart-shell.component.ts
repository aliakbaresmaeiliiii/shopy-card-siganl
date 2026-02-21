import { Component } from '@angular/core';
import { CartTotalComponent } from '../cart-total/cart-total.component';
import { CartListComponent } from '../cart-list/cart-list.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'sw-cart-shell',
  standalone: true,
  imports: [CartListComponent, CartTotalComponent, RouterLink],
  templateUrl: './cart-shell.component.html',
  styleUrls: ['./cart-shell.component.css'],
})
export class CartShellComponent {}
