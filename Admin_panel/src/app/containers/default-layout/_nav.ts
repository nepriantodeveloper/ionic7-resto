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
    name: 'Available Cities',
    url: '/cities',
    iconComponent: { name: 'cil-location-pin' }
  },
  {
    name: 'Restaurants',
    url: '/stores',
    iconComponent: { name: 'cil-restaurant' }
  },
  {
    name: 'Users',
    url: '/users',
    iconComponent: { name: 'cil-people' }
  },
  {
    name: 'Drivers',
    url: '/drivers',
    iconComponent: { name: 'cil-bike' }
  },
  {
    name: 'Orders',
    url: '/orders',
    iconComponent: { name: 'cil-cart' }
  },
  {
    name: 'Categories',
    url: '/category',
    iconComponent: { name: 'cil-applications' }
  },
  {
    name: 'Products',
    url: '/products',
    iconComponent: { name: 'cil-burger' }
  },
  {
    name: 'Payments',
    url: '/payments',
    iconComponent: { name: 'cil-cash' }
  },
  {
    title: true,
    name: 'Manage'
  },
  {
    name: 'Languages',
    url: '/languages',
    iconComponent: { name: 'cil-language' }
  },
  {
    name: 'Banners',
    url: '/banners',
    iconComponent: { name: 'cil-airplay' }
  },
  {
    name: 'Blogs',
    url: '/blogs',
    iconComponent: { name: 'cil-align-left' }
  },
  {
    name: 'Coupons',
    url: '/offers',
    iconComponent: { name: 'cil-audio-description' }
  },
  {
    name: 'Notification',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' }
  },
  {
    name: 'Referral',
    url: '/referral',
    iconComponent: { name: 'cil-tags' }
  },
  {
    name: 'Support',
    url: '/supports',
    iconComponent: { name: 'cil-chat-bubble' }
  },
  {
    name: 'Contacts',
    url: '/contact-forms',
    iconComponent: { name: 'cil-send' }
  },
  {
    name: 'Store Stats',
    url: '/stats',
    iconComponent: { name: 'cil-pen-nib' }
  },
  {
    name: 'Drivers Stats',
    url: '/driver-stats',
    iconComponent: { name: 'cil-walk' }
  },
  {
    name: 'Manage App',
    url: '/manage-app',
    iconComponent: { name: 'cil-window-maximize' }
  },
  {
    name: 'Send Emails',
    url: '/emails',
    iconComponent: { name: 'cil-paper-plane' }
  },
  {
    name: 'App Settings',
    url: '/app-settings',
    iconComponent: { name: 'cil-settings' }
  },
  {
    name: 'General',
    url: '/general',
    iconComponent: { name: 'cil-short-text' }
  },
  {
    name: 'App Pages',
    url: '/app-pages',
    iconComponent: { name: 'cil-notes' }
  },
  {
    name: 'Manage Popup',
    url: '/manage-popup',
    iconComponent: { name: 'cil-object-group' }
  },
  {
    name: 'Administrator',
    url: '/administrator',
    iconComponent: { name: 'cil-lock-locked' }
  },
  {
    name: 'Address List',
    url: '/address-list',
    iconComponent: { name: 'cil-address-book' }
  },
  {
    name: 'Reviews',
    url: '/reviews',
    iconComponent: { name: 'cil-star' }
  },
];
