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
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {
  seg_id = 1;
  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummy: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
  ) {
    this.getOrders('', false);
    this.util.subscribeOrderChange().subscribe((data) => {
      this.getOrders('', false);
    });
  }

  ngOnInit() {
    console.log('init');
  }
  doRefresh(event: any) {
    this.getOrders(event, true);
  }

  onClick(val: any) {
    this.seg_id = val;
  }

  goToOrderDetail(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item
      }
    };
    this.util.navigateToPage('/order-detail', param);
  }

  getOrders(event: any, haveRefresh: any) {
    console.log(event);
    console.log(haveRefresh);
    this.newOrders = [];
    this.onGoingOrders = [];
    this.oldOrders = [];
    this.dummy = Array(10);
    this.api.post_private('v1/orders/getUserOrders', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      this.newOrders = [];
      this.onGoingOrders = [];
      this.oldOrders = [];
      if (data && data.status && data.status == 200 && data.data) {
        data.data.forEach((element: any) => {
          element.time = moment(element.time).format('llll');
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
          if (element.status == 'created') {
            this.newOrders.push(element);
          } else if (element.status == 'accepted' || element.status == 'ongoing') {
            this.onGoingOrders.push(element);
          } else if (element.status == 'delivered' || element.status == 'cancel' || element.status == 'rejected') {
            this.oldOrders.push(element);
          }
        });
      }

      if (haveRefresh) {
        event.target.complete();
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.newOrders = [];
      this.onGoingOrders = [];
      this.oldOrders = [];
      this.util.apiErrorHandler(error);
      if (haveRefresh) {
        event.target.complete();
      }
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.newOrders = [];
      this.onGoingOrders = [];
      this.oldOrders = [];
      if (haveRefresh) {
        event.target.complete();
      }
      this.util.apiErrorHandler(error);
    });
  }
}
