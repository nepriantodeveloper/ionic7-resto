/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.page.html',
  styleUrls: ['./coupons.page.scss'],
})
export class CouponsPage implements OnInit {
  list: any[] = [];
  restId: any = '';
  name: any = '';
  total: any = '';
  dummy: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navParam: NavParams,
    private modalController: ModalController
  ) {
    this.restId = this.navParam.get('restId');
    this.name = this.navParam.get('name');
    this.total = Number(this.navParam.get('totalPrice'));
    console.log(this.restId, this.name, this.total);

    this.getOffers();
  }

  ngOnInit() {

  }
  getOffers() {
    this.dummy = Array(5);
    this.api.get_private('v1/offers/getActiveOffers').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.list = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  claim(item: any) {
    console.log(item);
    console.log(this.restId);
    if (item && item.available && item.available.length) {
      const data = item.available.includes(this.restId);
      console.log(data);
      if (data) {
        console.log(this.total, Number(item.min));
        if (this.total >= Number(item.min)) {
          console.log('ok');
          this.util.showToast(this.util.translate('Coupon Applied'), 'success', 'bottom');
          this.util.publishCoupon(item);
          this.modalController.dismiss();
        } else {
          this.util.errorToast(this.util.translate('For claiming this coupon your order required minimum order of') + this.util.appSettings.currencySymbol + ' ' + item.min);
        }
      } else {
        this.util.errorToast(this.util.translate('This coupon is not valid for') + ' ' + this.name);
      }
    } else {
      this.util.errorToast(this.util.translate('This coupon is not valid for') + ' ' + this.name);
    }
  }

  expire(date: any) {
    return moment(date).format('llll');
  }

  close() {
    this.modalController.dismiss();
  }
}
