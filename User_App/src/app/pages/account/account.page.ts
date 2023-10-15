/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  seg_id: any = 1;
  name: any = '';
  photo: any = 'assets/images/user.png';
  email: any = '';
  id: any = '';
  userDetail: any;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) { }

  ngOnInit() {
  }

  goToAddress() {
    const param: NavigationExtras = {
      queryParams: {
        from: 'accont'
      }
    };
    this.util.navigateToPage('choose-address', param);
  }

  changeSegment(val: any) {
    this.seg_id = val;
  }

  goToselectRestaurants() {
    this.util.navigateToPage('choose-restaurant');
  }

  editProfile() {
    this.util.navigateToPage('edit-profile');
  }

  onWallet() {
    this.util.navigateToPage('wallet');
  }

  getProfile() {
    return this.util.userInfo && this.util.userInfo.cover ? this.api.mediaURL + this.util.userInfo.cover : 'assets/user.png';
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ?
      this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Foodies';
  }
  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@foodies.com';
  }

  orders() {
    this.util.navigateRoot('tabs/history');
  }

  reset() {
    this.util.navigateToPage('forgot');
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
    this.util.navigateToPage('chats');
  }

  goFaqs() {
    this.util.navigateRoot('tabs/account/faqs');
  }

  goHelp() {
    this.util.navigateRoot('tabs/account/help');
  }


  reviews() {
    console.log('review');
    this.util.navigateToPage('choose-restaurant');
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/auth/user_logout', {}).then((data: any) => {
      console.log(data);
      this.util.hide();
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  isActive() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    return false;
  }

  login() {
    this.util.navigateToPage('/login');
  }
}
