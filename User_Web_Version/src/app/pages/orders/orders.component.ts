/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as moment from 'moment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {
  haveItems: boolean = false;
  myOrders: any[] = [];
  dummy = Array(10);
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private chMod: ChangeDetectorRef
  ) {
    this.getMyOrders('', false);
  }

  ngOnInit(): void {
  }

  doRefresh(event: any) {
    console.log(event);
    this.getMyOrders(event, true);
  }

  getMyOrders(event: any, haveRefresh: any) {

    this.api.post_private('v1/orders/getMyOrders', { "id": localStorage.getItem('uid') }).then((data: any) => {
      this.dummy = [];
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.haveItems = true;
        data.data.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
        });
        this.myOrders = data.data;
      } else {
        this.haveItems = false;
      }
      this.chMod.detectChanges();
      if (haveRefresh) {
        event.target.complete();
      }

    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  getCart() {
    this.router.navigate(['/tabs']);
  }
  goToHistoryDetail(orderId: any) {
    const navData: NavigationExtras = {
      queryParams: {
        id: orderId
      }
    };
    this.router.navigate(['/order-details'], navData);
  }

  getDate(date: any) {
    return moment(date).format('llll');
  }
}
