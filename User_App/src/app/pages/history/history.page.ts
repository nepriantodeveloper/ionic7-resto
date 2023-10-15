/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  haveItems: boolean = false;
  myOrders: any[] = [];
  dummy: any[] = [];
  constructor(
    public api: ApiService,
    public util: UtilService,
    private chMod: ChangeDetectorRef
  ) {
    this.getMyOrders('', false);
    this.util.getOrderObservable().subscribe((data) => {
      this.getMyOrders('', false);
    });
  }

  ngOnInit() {
  }

  doRefresh(event: any) {
    console.log(event);
    this.getMyOrders(event, true);
  }

  getMyOrders(event: any, haveRefresh: any) {
    this.dummy = Array(10);
    this.api.post_private('v1/orders/getMyOrders', { "id": localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.haveItems = true;
        data.data.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
        });
        this.myOrders = data.data;
      }
      this.chMod.detectChanges();
      if (haveRefresh) {
        event.target.complete();
      }
    }).catch((error: any) => {
      this.chMod.detectChanges();
      if (haveRefresh) {
        event.target.complete();
      }
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  getCart() {
    this.util.navigateRoot('/tabs/home');
  }

  goToHistoryDetail(orderId: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: orderId
      }
    };
    this.util.navigateToPage('history-detail', param);
  }

  getDate(date: any) {
    return moment(date).format('llll');
  }

}
