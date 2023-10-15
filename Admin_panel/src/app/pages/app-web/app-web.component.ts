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
  selector: 'app-app-web',
  templateUrl: './app-web.component.html',
  styleUrls: ['./app-web.component.scss']
})
export class AppWebComponent implements OnInit {
  id: any = '';
  name: any = '';
  mobile: any = '';
  email: any = '';
  address: any = '';
  city: any = '';
  state: any = '';
  zip: any = '';
  country: any = '';
  min: any = '';
  free: any = '';
  tax: any = '';
  shipping: any = 'fixed';
  shippingPrice: any = '';
  allowDistance: any = '';
  facebook: any = '';
  instagram: any = '';
  twitter: any = '';
  google_playstore: any = '';
  apple_appstore: any = '';
  web_footer: any = '';
  haveData: boolean = false;
  submited: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getDefault();
  }

  ngOnInit(): void {
  }

  getDefault() {
    this.util.show();
    this.api.get_private('v1/general/getDefault').then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.haveData = true
        this.id = data.data.id;
        const info = data.data;
        this.name = info.name;
        this.address = info.address;
        this.city = info.city;
        this.country = info.country;
        this.email = info.email;
        this.free = info.free;
        this.min = info.min;
        this.mobile = info.mobile;
        this.shippingPrice = info.shippingPrice;
        this.shipping = info.shipping;
        this.state = info.state;
        this.tax = info.tax;
        this.zip = info.zip;
        this.allowDistance = info.allowDistance;
        this.facebook = info.facebook;
        this.instagram = info.instagram;
        this.twitter = info.twitter;
        this.apple_appstore = info.apple_appstore;
        this.google_playstore = info.google_playstore;
        this.web_footer = info.web_footer;
      } else {
        this.haveData = false;
      }
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

  saveSettings() {
    console.log(this.haveData);
    this.submited = true;
    if (this.name == null || this.name == '' || !this.mobile || this.mobile == '' || !this.email || this.email == '' || !this.address || this.address == '' ||
      !this.city || this.city == '' || !this.state || this.state == '' || !this.zip || this.zip == '' || !this.country ||
      this.country == '' || !this.min || this.min == '' || !this.free || this.free == '' || !this.tax || this.tax == '' ||
      !this.shippingPrice || this.shippingPrice == '') {
      console.log('not ok');
      this.util.error('All Fields are required');
      return false;
    }
    if (this.haveData == false) {
      console.log('create');
      const param = {
        name: this.name,
        mobile: this.mobile,
        email: this.email,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        min: this.min,
        free: this.free,
        tax: this.tax,
        shipping: this.shipping,
        shippingPrice: this.shippingPrice,
        allowDistance: this.allowDistance,
        facebook: this.facebook,
        instagram: this.instagram,
        twitter: this.twitter,
        apple_appstore: this.apple_appstore,
        google_playstore: this.google_playstore,
        web_footer: this.web_footer
      };
      this.util.show();
      this.api.post_private('v1/general/save', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        this.getDefault();
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.util.hide();
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('update');
      const param = {
        "id": this.id,
        name: this.name,
        mobile: this.mobile,
        email: this.email,
        address: this.address,
        city: this.city,
        state: this.state,
        zip: this.zip,
        country: this.country,
        min: this.min,
        free: this.free,
        tax: this.tax,
        shipping: this.shipping,
        shippingPrice: this.shippingPrice,
        allowDistance: this.allowDistance,
        facebook: this.facebook,
        instagram: this.instagram,
        twitter: this.twitter,
        apple_appstore: this.apple_appstore,
        google_playstore: this.google_playstore,
        web_footer: this.web_footer
      };
      this.util.show();
      this.api.post_private('v1/general/update', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        this.getDefault();
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
  }
}
