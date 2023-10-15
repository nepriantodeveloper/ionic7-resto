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
import { AuthGuard } from './guard/auth.guard';
import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './pages/auth/page404/page404.component';
import { Page500Component } from './pages/auth/page500/page500.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SetupAuthGuard } from './setupGuard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/auth/pages.module').then((m) => m.PagesModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'app-pages',
        loadChildren: () => import('./pages/app-pages/app-pages.module').then(m => m.AppPagesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'payments',
        loadChildren: () => import('./pages/payments/payments.module').then(m => m.PaymentsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'contact-forms',
        loadChildren: () => import('./pages/contact-forms/contact-forms.module').then(m => m.ContactFormsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'administrator',
        loadChildren: () => import('./pages/administrator/administrator.module').then(m => m.AdministratorModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'app-settings',
        loadChildren: () => import('./pages/app-settings/app-settings.module').then(m => m.AppSettingsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'general',
        loadChildren: () => import('./pages/app-web/app-web.module').then(m => m.AppWebModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'banners',
        loadChildren: () => import('./pages/banners/banners.module').then(m => m.BannersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'blogs',
        loadChildren: () => import('./pages/blogs/blogs.module').then(m => m.BlogsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'category',
        loadChildren: () => import('./pages/category/category.module').then(m => m.CategoryModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'cities',
        loadChildren: () => import('./pages/cities/cities.module').then(m => m.CitiesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'driver-stats',
        loadChildren: () => import('./pages/driver-stats/driver-stats.module').then(m => m.DriverStatsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'drivers',
        loadChildren: () => import('./pages/drivers/drivers.module').then(m => m.DriversModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'emails',
        loadChildren: () => import('./pages/emails/emails.module').then(m => m.EmailsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'languages',
        loadChildren: () => import('./pages/languages/languages.module').then(m => m.LanguagesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-app',
        loadChildren: () => import('./pages/manage-app/manage-app.module').then(m => m.ManageAppModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-languages',
        loadChildren: () => import('./pages/manage-languages/manage-languages.module').then(m => m.ManageLanguagesModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-popup',
        loadChildren: () => import('./pages/manage-popup/manage-popup.module').then(m => m.ManagePopupModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'stats',
        loadChildren: () => import('./pages/stats/stats.module').then(m => m.StatsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'supports',
        loadChildren: () => import('./pages/supports/supports.module').then(m => m.SupportsModule),
        canActivate: [AuthGuard],
        canDeactivate: [LeaveGuard]
      },
      {
        path: 'notifications',
        loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'offers',
        loadChildren: () => import('./pages/offers/offers.module').then(m => m.OffersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'stores',
        loadChildren: () => import('./pages/stores/stores.module').then(m => m.StoresModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'users',
        loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders.module').then(m => m.OrdersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'user-details',
        loadChildren: () => import('./pages/user-details/user-details.module').then(m => m.UserDetailsModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'referral',
        loadChildren: () => import('./pages/referral/referral.module').then(m => m.ReferralModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-orders',
        loadChildren: () => import('./pages/manage-orders/manage-orders.module').then(m => m.ManageOrdersModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-stores',
        loadChildren: () => import('./pages/manage-stores/manage-stores.module').then(m => m.ManageStoresModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'manage-drivers',
        loadChildren: () => import('./pages/manage-drivers/manage-drivers.module').then(m => m.ManageDriversModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'address-list',
        loadChildren: () => import('./pages/address-list/address-list.module').then(m => m.AddressListModule),
        canActivate: [AuthGuard]
      },
      {
        path: 'reviews',
        loadChildren: () => import('./pages/reviews/reviews.module').then(m => m.ReviewsModule),
        canActivate: [AuthGuard]
      },
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    },
    canActivate: [SetupAuthGuard]
  },
  {
    path: 'setup',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    },
  },
  {
    path: 'forgot',
    loadChildren: () => import('./pages/forgot/forgot.module').then(m => m.ForgotModule),
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      relativeLinkResolution: 'legacy',
      useHash: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
