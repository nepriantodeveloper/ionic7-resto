/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.page.html',
  styleUrls: ['./rate.page.scss'],
})
export class RatePage implements OnInit {
  id: any[] = [];
  isLoaded: boolean = false;
  products: any[] = [];
  dId: any = '';
  driverName: any = '';
  driverCover: any = '';
  driverEmail: any = '';
  driverMobile: any = '';
  storeName: any = '';
  storeCover: any = '';
  storeId: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getOrderInfo();
      }
    });
  }

  ngOnInit() {
  }

  getOrderInfo() {
    this.isLoaded = false;
    this.api.post_private('v1/orders/getById', { id: this.id }).then((data: any) => {
      console.log(data);
      this.isLoaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.storeName = info.store_name;
        this.storeCover = info.store_cover;
        this.storeId = info.restId;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.orders)) {
          this.products = JSON.parse(info.orders);
        }
        if (info && info.did && info.did != 0) {
          this.dId = info.did;
          this.getDriverInfo();
        }
      }
    }, error => {
      console.log(error);
      this.isLoaded = true;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.isLoaded = true;
      this.util.apiErrorHandler(error);
    });
  }

  getDriverInfo() {
    this.api.post_private('v1/driver/getDriverInfo', { id: this.dId }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.driverName = info.first_name + ' ' + info.last_name;
        this.driverEmail = info.email;
        this.driverMobile = info.mobile;
        console.log(this);
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  onBack() {
    this.util.onBack();
  }

  rateStore() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.storeId,
        name: this.storeName,
        way: 'order'
      }
    };
    this.util.navigateToPage('/add-review', param);
  }

  ratDriver() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.dId,
        name: this.driverName
      }
    };
    this.util.navigateToPage('driver-rating', param);
  }

  async rateProduct(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        name: item.name
      }
    };
    this.util.navigateToPage('/product-rating', param);
  }
}
