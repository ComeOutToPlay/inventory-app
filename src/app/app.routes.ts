import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Product } from './components/product/product';
import { Category } from './components/category/category';
import { loginRouteGuard } from './core/guards/login-route.guard';
import { Login } from './components/login/login';

export const routes: Routes = [
{
    path: '', // Default path
    component: Login    // -> Your default must not be to AppComponent
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'home',
    component: Home,
    canActivate: [loginRouteGuard]
  },
  {
    path: 'product',
    component: Product,
    canActivate: [loginRouteGuard]    
  },
  {
    path: 'category',
    component: Category,
    canActivate: [loginRouteGuard]    
  }
];

