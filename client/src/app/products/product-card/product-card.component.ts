import { Component, input, output } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product';
import { environment } from '../../environment/environment';

@Component({
  selector: 'pm-product-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
})
export class ProductCardComponent {
  product = input.required<Product>();
  isFavorite = input<boolean>(false);
  apiUrl = environment.apiUrl;

  addToCart = output<Product>();
  toggleFavorite = output<number>();
}
