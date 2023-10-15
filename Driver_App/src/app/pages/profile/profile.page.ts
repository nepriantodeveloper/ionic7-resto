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
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  seg_id: any = 1;
  constructor(
    public api: ApiService,
    public util: UtilService
  ) {

  }

  ngOnInit() {
  }

  changeSegment(val: any) {
    this.seg_id = val;
  }

  goToselectRestaurants() {
    this.util.navigateToPage('/choose-restaurant')
  }

  editProfile() {
    this.util.navigateToPage('/edit-profile');
  }

  getProfile() {
    return this.util.driverInfo && this.util.driverInfo.cover ? this.api.mediaURL + this.util.driverInfo.cover : 'assets/images/placeholder.jpg';
  }

  getName() {
    return this.util.driverInfo && this.util.driverInfo.first_name ?
      this.util.driverInfo.first_name + ' ' + this.util.driverInfo.last_name : this.util.generalSettings.name;
  }
  getEmail() {
    return this.util.driverInfo && this.util.driverInfo.email ? this.util.driverInfo.email : this.util.generalSettings.email;
  }

  orders() {
    this.util.navigateRoot('/tabs/orders');
  }

  reset() {
    this.util.navigateToPage('/forgot-password');
  }

  goToAbout() {
    this.util.navigateRoot('/tabs/profile/about');
  }

  goToContact() {
    this.util.navigateRoot('/tabs/profile/contacts');
  }

  goLangs() {
    this.util.navigateRoot('/tabs/profile/languages');
  }

  goFaqs() {
    this.util.navigateRoot('/tabs/profile/faqs');
  }

  goHelp() {
    this.util.navigateRoot('/tabs/profile/help');
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/driver/user_logout', {}).then((data: any) => {
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
    console.log('review');
    this.util.navigateToPage('/reviews');
  }
}
