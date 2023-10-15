/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeaveGuard } from './leaved/leaved.guard';
import { LocationGuard } from './locationGuard/location.guard';
import { AwaitLeaveGuard } from './await-leaved/leaved.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'restaurants',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    data: { title: 'Home' }
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule),
    data: { title: 'About' }
  },
  {
    path: 'contact',
    loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule),
    data: { title: 'Contact' }
  },
  {
    path: 'restaurants',
    loadChildren: () => import('./pages/restaurants/restaurants.module').then(m => m.RestaurantsModule),
    canActivate: [LocationGuard],
    data: { title: 'Restaurants' },
    canDeactivate: [LeaveGuard]
  },
  {
    path: 'order/:id/:name',
    loadChildren: () => import('./pages/all-food/all-food.module').then(m => m.AllFoodModule),
    data: { title: 'Restaurants details' }
  },
  {
    path: 'notice',
    loadChildren: () => import('./pages/notice/notice.module').then(m => m.NoticeModule),
    data: { title: 'Notice' }
  },
  {
    path: 'faq',
    loadChildren: () => import('./pages/faq/faq.module').then(m => m.FaqModule),
    data: { title: 'Faqs' }
  },
  {
    path: 'help',
    loadChildren: () => import('./pages/help/help.module').then(m => m.HelpModule),
    data: { title: 'Help' }
  },
  {
    path: 'cookie',
    loadChildren: () => import('./pages/cookie/cookie.module').then(m => m.CookieModule),
    data: { title: 'Cookies' }
  },
  {
    path: 'blog',
    loadChildren: () => import('./pages/blog/blog.module').then(m => m.BlogModule),
    data: { title: 'Blog' }
  },
  {
    path: 'blog-detail',
    loadChildren: () => import('./pages/blog-detail/blog-detail.module').then(m => m.BlogDetailModule),
    data: { title: 'Blog Details' }
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule),
    data: { title: 'Cart' }
  },
  {
    path: 'user/:id/:from',
    loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
    data: { title: 'User Informations' }
  },
  {
    path: 'await-payments',
    loadChildren: () => import('./pages/await-payments/await-payments.module').then(m => m.AwaitPaymentsModule),
    data: { title: 'Confirm Payment' },
    canDeactivate: [AwaitLeaveGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule),
    data: { title: 'Orders' }
  },
  {
    path: 'order-details',
    loadChildren: () => import('./pages/order-details/order-details.module').then(m => m.OrderDetailsModule),
    data: { title: 'Orders Details' },
    canDeactivate: [LeaveGuard]
  },
  {
    path: 'rate',
    loadChildren: () => import('./pages/rate/rate.module').then(m => m.RateModule),
    data: { title: 'Rate' }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
