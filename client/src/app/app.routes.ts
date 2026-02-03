import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './utilities/page-not-found.component';

export const routes: Routes = [
  { path: 'welcome', component: HomeComponent },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent,
      ),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-list/product-list.component').then(
        (c) => c.ProductListComponent,
      ),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./cart/cart-shell/cart-shell.component').then(
        (c) => c.CartShellComponent,
      ),
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
