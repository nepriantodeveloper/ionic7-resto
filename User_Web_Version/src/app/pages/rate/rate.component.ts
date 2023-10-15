/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent {
  @ViewChild('productRating') public productRating: ModalDirective;
  @ViewChild('storeRating') public storeRating: ModalDirective;
  @ViewChild('driverRating') public driverRating: ModalDirective;

  products: any;

  product_id: any;
  product_name: any;
  product_rate: any = 2;
  product_comment: any = '';
  product_total: any;
  product_rating: any[] = [];
  product_way: any;

  store_id: any;
  store_name: any;
  store_rate: any = 2;
  store_comment: any = '';
  store_total: any;
  store_rating: any[] = [];
  store_way: any;

  driver_id: any;
  driver_name: any;
  driver_rate: any = 2;
  driver_comment: any = '';
  driver_total: any;
  driver_rating: any[] = [];
  driver_way: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: Location,
    private router: Router,
  ) {
    console.log(this.util.orderDetails);
    if (this.util.orderDetails && this.util.orderDetails.orders) {
      this.products = JSON.parse(this.util.orderDetails.orders);
      console.log(this.products);
    } else {
      this.util.errorToast(this.util.translate('Something went wrong'));
      this.navCtrl.back();
    }
  }

  ngOnInit(): void {
  }

  onRatingChange(event: any) {
    console.log(event);
  }

  rateStore() {
    this.store_id = this.util.orderDetails.restId;
    this.store_name = this.util.orderDetails.store_name;
    this.store_way = 'order'
    this.util.start();
    this.api.post_private('v1/ratings/getStoreRatings', { id: this.store_id }).then((data: any) => {
      this.util.stop();
      console.log('data', data);
      if (data && data.status == 200) {
        if (data && data.data && data.data) {
          this.store_rating = data.data.map(function (x: any) {
            return parseInt(x.rate);
          });
          this.store_total = this.store_rating.length;
        } else {
          this.store_total = 0;
          this.store_rating = [];
        }
      } else {
        this.store_total = 0;
        this.store_rating = [];
      }
      this.storeRating.show();
      console.log('total', this.store_total);
    }, error => {
      console.log(error);
      this.util.stop();
      this.store_total = 0;
      this.store_rating = [];
    });

  }

  ratDriver() {
    this.driver_id = this.util.orderDetails.driverInfo.id;
    this.driver_name = this.util.orderDetails.driverInfo.first_name + ' ' + this.util.orderDetails.driverInfo.last_name;
    this.driver_way = 'order';
    this.driverRating.show();
  }

  async rateProduct(item: any) {
    console.log('content', item);
    this.product_id = item.id;
    this.product_name = item.name;
    this.product_way = 'order';
    console.log('id', this.product_id);
    console.log('name', this.product_name);

    this.util.start();
    this.api.post_private('v1/ratings/getProductsReview', { id: this.product_id }).then((data: any) => {
      this.util.stop();
      console.log('data', data);
      if (data && data.status == 200) {
        if (data && data.data && data.data) {
          this.product_rating = data.data.map(function (x: any) {
            return parseInt(x.rate);
          });
          this.product_total = this.product_rating.length;
        } else {
          this.product_total = 0;
          this.product_rating = [];
        }
      } else {
        this.product_total = 0;
        this.product_rating = [];
      }
      console.log('total', this.product_total);
      this.productRating.show();
    }, error => {
      console.log(error);
      this.util.stop();
      this.product_total = 0;
      this.product_rating = [];
    });
  }


  addProductRating() {
    if (this.product_comment == '') {
      this.util.errorToast(this.util.translate('Please enter comment'));
      return false;
    }

    this.product_rating.push(this.product_rate);
    const sumOfRatingCount = this.product_rating.length * 5;
    const sumOfStars = this.product_rating.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    const ratings = ((sumOfStars * 5) / sumOfRatingCount).toFixed(2);
    console.log(ratings);
    console.log(this.product_rating);

    console.log('rate', this.product_rate, this.product_comment);

    const param = {
      uid: localStorage.getItem('uid'),
      pid: this.product_id,
      did: 0,
      sid: 0,
      rate: this.product_rate,
      msg: this.product_comment,
      way: 'order',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
      rating: ratings
    };
    console.log(param);
    this.util.start();
    this.api.post_private('v1/ratings/save_product_review', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status == 200) {
        this.util.successToast(this.util.translate('Rating added'));
        this.product_rate = 0;
        this.product_comment = '';
        this.productRating.hide();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.stop();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }

  addStoreRating() {
    if (this.store_comment == '') {
      this.util.errorToast(this.util.translate('Please enter comment'));
      return false;
    }
    this.store_rating.push(this.store_rate);
    const sumOfRatingCount = this.store_rating.length * 5;
    const sumOfStars = this.store_rating.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    const ratings = ((sumOfStars * 5) / sumOfRatingCount).toFixed(2);
    console.log(ratings);
    console.log(this.store_rating);

    console.log('rate', this.store_rate, this.store_comment);

    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: 0,
      sid: this.store_id,
      rate: this.store_rate,
      msg: this.store_comment,
      way: this.store_way,
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
      total_rating: this.store_total + 1,
      rating: ratings
    };
    console.log(param);
    this.util.start();
    this.api.post_private('v1/ratings/save', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status == 200) {
        this.util.successToast(this.util.translate('Rating added'));
        this.store_rate = 0;
        this.store_comment = '';
        this.storeRating.hide();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.stop();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }


  addDriverRating() {
    if (this.driver_comment == '') {
      this.util.errorToast(this.util.translate('Please enter comment'));
      return false;
    }

    console.log('rate', this.driver_rate, this.driver_comment);

    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: this.driver_id,
      sid: 0,
      rate: this.driver_rate,
      msg: this.driver_comment,
      way: 'order',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
    };
    console.log(param);
    this.util.start();
    this.api.post_private('v1/ratings/save_driver_review', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status == 200) {
        this.util.successToast(this.util.translate('Rating added'));
        this.driverRating.hide();
        this.driver_rate = 0;
        this.driver_comment = '';
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.stop();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }
}
