/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-stores',
  templateUrl: './manage-stores.component.html',
  styleUrls: ['./manage-stores.component.scss']
})
export class ManageStoresComponent implements OnInit {
  id: any = '';
  activeTab: number = 0;
  orders: any[] = [];
  dummyOrders: any[] = [];
  orderPage: number = 1;

  reviews: any[] = [];
  dummyReviews: any[] = [];
  reviewsPage: number = 1;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;

      }
    });
  }

  ngOnInit(): void {
  }

  getOrders() {
    this.dummyOrders = Array(5);
    this.orders = [];
    this.api.post_private('v1/orders/getUserOrdersAdmin', { id: this.id }).then((data: any) => {
      console.log(data);
      this.dummyOrders = [];
      if (data && data.status && data.status == 200 && data.data) {
        data.data.forEach((element: any) => {
          element.time = moment(element.time).format('llll');
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
        });
        this.orders = data.data;
      }

    }, error => {
      console.log(error);
      this.dummyOrders = [];
      this.orders = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummyOrders = [];
      this.orders = [];
      this.util.apiErrorHandler(error);
    });
  }

  onTabChange(event: any) {
    console.log(event);
    this.activeTab = event;
    if (this.activeTab == 0) {
      this.getOrders();
    } else {
      this.getReviews();
    }
  }

  openOrder(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-orders'], param);
  }

  getReviews() {
    this.dummyReviews = Array(5);
    this.api.post_private('v1/stores/getMyReviewsAdmin', { id: this.id }).then((data: any) => {
      console.log(data);
      this.dummyReviews = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.reviews = data.data;
      }
    }, error => {
      console.log(error);
      this.dummyReviews = [];
      this.reviews = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummyReviews = [];
      this.reviews = [];
      this.util.apiErrorHandler(error);
    });
  }

  getDate(date: any) {
    return moment(date).format('lll');
  }
}
