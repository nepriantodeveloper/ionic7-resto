/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  newOrders: any[] = [];
  onGoingOrders: any[] = [];
  oldOrders: any[] = [];
  dummy: any[] = [];

  activeTab: number = 0;
  newOrderPage: number = 1;
  activeOrderPage: number = 1;
  oldOrderPage: number = 1;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.getOrders();
  }

  ngOnInit() {
  }

  onTabChange(event: any) {
    console.log(event);
    this.activeTab = event;
  }

  getOrders() {
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
    }, error => {
      console.log(error);
      this.dummy = [];
      this.newOrders = [];
      this.onGoingOrders = [];
      this.oldOrders = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.newOrders = [];
      this.onGoingOrders = [];
      this.oldOrders = [];
      this.util.apiErrorHandler(error);
    });
  }

  goToOrderDetail(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item
      }
    };
    this.router.navigate(['manage-orders'], param);
  }
}
