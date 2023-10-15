/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  constructor(
    public util: UtilService,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  goToAddCategoty() {
    this.util.navigateToPage('/tabs/account/category');
  }

  AddFoods() {
    this.util.navigateToPage('/tabs/account/foods');
  }

  venueDetails() {
    this.util.navigateToPage('/tabs/account/venue-profile');
  }

  orders() {
    this.util.navigateRoot('/tabs/orders');
  }

  reset() {
    this.util.navigateToPage('/reset');
  }

  goToAbout() {
    this.util.navigateRoot('tabs/account/about');
  }

  goToContact() {
    this.util.navigateRoot('tabs/account/contacts');
  }

  goLangs() {
    this.util.navigateRoot('tabs/account/languages');
  }

  goToChats() {
    this.util.navigateToPage('/tabs/account/chats');
  }

  goFaqs() {
    this.util.navigateRoot('tabs/account/faqs');
  }

  goHelp() {
    this.util.navigateRoot('tabs/account/help');
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/auth/store_logout', {}).then((data: any) => {
      console.log(data);
      this.util.hide();
      localStorage.clear();
      this.util.navigateRoot('/login');
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });

  }

  reviews() {
    this.util.navigateRoot('tabs/account/review');
  }
}
