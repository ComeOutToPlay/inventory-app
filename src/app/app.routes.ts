import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Product } from './components/product/product';
import { Category } from './components/category/category';

export const routes: Routes = [
  {
    path: '', // Default path
    component: Home
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'product',
    component: Product
  },
  {
    path: 'category',
    component: Category
  }
];

