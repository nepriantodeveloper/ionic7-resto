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
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  segId = 1;
  orders: any[] = [];
  oldOrders: any;
  dummy: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getOrders('', false);
    this.util.subscribeOrderChange().subscribe(() => {
      this.orders = [];
      this.oldOrders = [];
      this.getOrders('', false);
    });
  }

  ngOnInit() {
  }

  doRefresh(event: any) {
    this.getOrders(event, true);
  }

  onClick(val: any) {
    this.segId = val;
  }

  getOrders(event: any, haveRefresh: any) {
    this.orders = [];
    this.oldOrders = [];
    this.dummy = Array(10);
    this.api.post_private('v1/orders/getDriverOrders', { id: localStorage.getItem('uid') }).then((data) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        data.data.forEach((element: any) => {
          element.time = moment(element.time).format('llll');
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
          if (element.status == 'delivered' || element.status == 'cancel' || element.status == 'rejected') {
            this.oldOrders.push(element);
          } else {
            this.orders.push(element);
          }
        });
        if (haveRefresh) {
          event.target.complete();
        }
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.oldOrders = [];
      this.orders = [];
      if (haveRefresh) {
        event.target.complete();
      }
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      console.log(error);
      this.dummy = [];
      this.oldOrders = [];
      this.orders = [];
      if (haveRefresh) {
        event.target.complete();
      }
      this.util.apiErrorHandler(error);
    });
  }

  goToOrderDetail(ids: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: ids
      }
    };
    this.util.navigateToPage('/order-detail', param);
  }

  getProfilePic(item: any) {
    return item && item.cover ? item.cover : 'assets/images/placeholder.jpg';
  }
}
