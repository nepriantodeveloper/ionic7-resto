/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Main'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' }
  },
  {
    name: 'Categories',
    url: '/categories',
    iconComponent: { name: 'cil-apps' }
  },
  {
    name: 'Products',
    url: '/products',
    iconComponent: { name: 'cil-fastfood' }
  },
  {
    name: 'Store Stats',
    url: '/stats',
    iconComponent: { name: 'cil-chart' }
  },
  {
    name: 'Support',
    url: '/contacts',
    iconComponent: { name: 'cil-chat-bubble' }
  },
  {
    name: 'Reviews',
    url: '/reviews',
    iconComponent: { name: 'cil-star' }
  },
];
