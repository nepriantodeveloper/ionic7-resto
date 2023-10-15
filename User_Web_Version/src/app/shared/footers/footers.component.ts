/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-footers',
  templateUrl: './footers.component.html',
  styleUrls: ['./footers.component.scss']
})
export class FootersComponent {
  constructor(
    public util: UtilService
  ) { }

  ngOnInit(): void {

  }

  getCopyright() {
    return moment().format('YYYY');
  }

  goToCart() {
    this.util.navigateToPage('/cart');
  }

  goToHome() {
    this.util.navigateToPage('/home');
  }

  goToOrders() {
    this.util.navigateToPage('/checkout');
  }

  goToAccount() {
    this.util.navigateToPage('/account');
  }

  goToReview() {
    this.util.navigateToPage('/review');
  }

  goToRestaurants(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        val: item
      }
    }

    this.util.navigateToPage('/restaurants', param);
  }

  goToRest(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        val: JSON.stringify(item)
      }
    }

    this.util.navigateToPage('/cityrest', param);
  }

  goToPrivacy() {
    this.util.navigateToPage('/privacy-policy');
  }

  goToContact() {
    this.util.navigateToPage('/contact');
  }

  goToAbout() {
    this.util.navigateToPage('/about');
  }

  goToFaqs() {
    this.util.navigateToPage('/faq');
  }

  goToNotice() {
    this.util.navigateToPage('/notice');
  }

  goToCookies() {
    this.util.navigateToPage('/cookie');
  }

  blogs() {
    this.util.navigateToPage('blog');
  }

  goToHelp() {
    this.util.navigateToPage('/help');
  }

  goToTracker() {
    this.util.navigateToPage('/tracker');
  }


  goToCheckout() {
    this.util.navigateToPage('/checkout');
  }
}
