import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './utilities/page-not-found.component';

const SITE_TITLE = 'Raavishop';

export const routes: Routes = [
  { path: 'welcome', component: HomeComponent, data: { title: 'Welcome' } },
  {
    path: 'login',
    data: { title: 'Sign in' },
    loadComponent: () =>
      import('./core/auth-layout/auth-layout.component').then(
        (c) => c.AuthLayoutComponent,
      ),
  },
  {
    path: 'products',
    data: { title: 'Products' },
    loadComponent: () =>
      import('./products/product-list/product-list.component').then(
        (c) => c.ProductListComponent,
      ),
  },
  {
    path: 'products/:id',
    data: { title: 'Product' },
    loadComponent: () =>
      import('./products/product-detail/product-detail.component').then(
        (c) => c.ProductDetailComponent,
      ),
  },
  {
    path: 'favorites',
    data: { title: 'Favorites' },
    loadComponent: () =>
      import('./favorites/favorites.component').then(
        (c) => c.FavoritesComponent,
      ),
  },
  {
    path: 'cart',
    data: { title: 'Cart' },
    canActivate: [authGuard],
    loadComponent: () =>
      import('./cart/cart-shell/cart-shell.component').then(
        (c) => c.CartShellComponent,
      ),
  },
  {
    path: 'checkout',
    data: { title: 'Checkout' },
    canActivate: [authGuard],
    loadComponent: () =>
      import('./checkout/checkout.component').then((c) => c.CheckoutComponent),
  },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, data: { title: 'Page not found' } },
];

export const siteTitle = SITE_TITLE;
