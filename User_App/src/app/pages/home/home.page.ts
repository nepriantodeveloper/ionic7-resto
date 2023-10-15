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
import * as moment from 'moment';
import { register } from 'swiper/element/bundle';
import { orderBy } from 'lodash';
import { NavigationExtras } from '@angular/router';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { ModalController } from '@ionic/angular';
import { SearchPage } from '../search/search.page';

register();
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  addressTitle: any = '';
  apiCalled: boolean = false;
  list: any[] = [];
  dummy: any[] = [];
  distanceType: any = '';
  chips: any[] = [];
  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1.2,
  };
  banners: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private iab: InAppBrowser,
    private modalController: ModalController
  ) {
    this.chips = [
      this.util.translate('Rating 4.0+'),
      this.util.translate('Fastest Delivery'),
      this.util.translate('Cost'),
      this.util.translate('A-Z'),
      this.util.translate('Z-A'),
      this.util.translate('Distance'),
    ];
    this.addressTitle = localStorage.getItem('address');
    this.getStoresNearMe();
  }

  ngOnInit() {
  }

  getStoresNearMe() {
    this.dummy = Array(10);
    this.apiCalled = false;
    this.api.post_public('v1/stores/getNearMe', { "lat": localStorage.getItem('lat'), "lng": localStorage.getItem('lng') }).then((data: any) => {
      console.log(data);
      this.apiCalled = true;
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        data.data.forEach(async (element: any) => {
          element.rating = parseFloat(element.rating);
          element.time = parseInt(element.time);
          element.dish = parseInt(element.dish);
          element['isOpen'] = this.isOpen(element.open_time, element.close_time);
        });
        this.list = data.data;
        this.distanceType = data.distanceType;
        this.list = this.list.sort((a, b) =>
          parseFloat(a.distance) < parseFloat(b.distance) ? -1
            : (parseFloat(a.distance) > parseFloat(b.distance) ? 1 : 0));
        console.log(this.list);

        this.banners = data.banners;
      }
    }, error => {
      console.log(error);
      this.apiCalled = true;
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.apiCalled = true;
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  isOpen(open: any, close: any) {
    const format = 'HH:mm:ss';
    const currentTime = moment().format(format);
    const time = moment(currentTime, format);
    const beforeTime = moment(open, format);
    const afterTime = moment(close, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false;
  }

  findLocation() {
    this.util.navigateRoot('location');
  }

  async openSearch() {
    const modal = await this.modalController.create({
      component: SearchPage,
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data && data.role == 'ok') {
        this.openMenu(data.data);
      }
    });
    await modal.present();
  }

  openMenu(item: any) {
    console.log(item);
    if (item.isOpen == false) {
      return false;
    }
    const param: NavigationExtras = {
      queryParams: {
        id: item.uid
      }
    };
    this.util.navigateToPage('category', param);
  }

  openOffers(item: any) {
    console.log(item);
    if (item.type == 0) {
      const param: NavigationExtras = {
        queryParams: {
          id: item.value
        }
      };
      this.util.navigateToPage('category', param);
    } else {
      this.iab.create(item.value);
    }
  }

  addFilter(index: any) {
    console.log(index);
    if (index == 0) {
      console.log('rating');
      this.list = orderBy(this.list, 'rating', 'desc');
    } else if (index == 1) {
      console.log('fast');
      this.list = orderBy(this.list, 'time', 'asc');
    } else if (index == 2) {
      console.log('cost');
      this.list = orderBy(this.list, 'dish', 'asc');
    } else if (index == 3) {
      console.log('A-Z');
      this.list = orderBy(this.list, 'name', 'asc');
    } else if (index == 4) {
      console.log('Z-A');
      this.list = orderBy(this.list, 'name', 'desc');
    } else if (index == 5) {
      console.log('distance');
      this.list = this.list.sort((a, b) =>
        parseFloat(a.distance) < parseFloat(b.distance) ? -1
          : (parseFloat(a.distance) > parseFloat(b.distance) ? 1 : 0));
    }
  }
}
