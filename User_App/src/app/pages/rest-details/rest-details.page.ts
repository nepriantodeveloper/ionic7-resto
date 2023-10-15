/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { register } from 'swiper/element/bundle';

register();
@Component({
  selector: 'app-rest-details',
  templateUrl: './rest-details.page.html',
  styleUrls: ['./rest-details.page.scss'],
})
export class RestDetailsPage implements OnInit {
  id: any;
  name: any;
  descritions: any;
  cover: any = '';
  address: any;
  ratting: any;
  time: any;
  totalRatting: any;
  dishPrice: any;
  cusine: any[] = [];
  foods: any[] = [];
  dummyFoods: any[] = [];
  categories: any[] = [];
  dummy = Array(50);
  veg: boolean = true;
  totalItem: any = 0;
  totalPrice: any = 0;
  deliveryAddress: any = '';
  images: any[] = [];
  isOpen: boolean = false;
  open: any;
  close: any;
  email: any;
  phone: any;
  apiCalled: boolean = false;
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((data: any) => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.getVenueDetails();
      }
    });
  }

  onBack() {
    this.util.onBack();
  }

  getVenueDetails() {
    this.apiCalled = false;
    this.api.post_public('v1/stores/getStoreData', { "id": this.id }).then((data: any) => {
      console.log(data);
      this.apiCalled = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.name = info.name;
        this.descritions = info.descriptions;
        this.cover = info.cover;
        this.address = info.address;
        this.ratting = info.rating ? info.rating : 0;
        this.totalRatting = info.total_rating ? info.total_rating : 0;
        this.dishPrice = info.dish;
        this.time = info.time;
        if (info.cusine && info.cusine != '') {
          this.cusine = info.cusine.split(',');
        } else {
          this.cusine = [];
        }
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.images)) {
          this.images = JSON.parse(info.images);
        }
        this.open = moment('10-10-2020 ' + info.open_time).format('LT');
        this.close = moment('10-10-2020 ' + info.close_time).format('LT');
        this.phone = info.mobile;
        const format = 'HH:mm:ss';

        const currentTime = moment().format(format);
        console.log(currentTime);
        const time = moment(currentTime, format);
        const beforeTime = moment(info.open_time, format);
        const afterTime = moment(info.close_time, format);

        if (time.isBetween(beforeTime, afterTime)) {
          console.log('is between');
          this.isOpen = true;
        } else {
          this.isOpen = false;
          console.log('is not between');
        }
      }
    }, error => {
      console.log(error);
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    });
  }
}
