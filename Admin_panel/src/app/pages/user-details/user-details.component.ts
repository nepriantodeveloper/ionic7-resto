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
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  id: any = '';
  name: any = '';
  cover: any = '';
  email: any = '';
  mobile: any = '';
  balance: any = '0';

  address: any[] = [];
  orders: any[] = [];
  reviews: any[] = [];

  activeTab: number = 0;
  orderPage: number = 1;
  reviewPage: number = 1;
  addressPage: number = 1;
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
        this.getUserProfile();
      }
    });
  }

  ngOnInit(): void {
  }

  getUserProfile() {
    this.util.show();
    this.api.post_private('v1/orders/userProfileAdmin', { id: this.id }).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200) {
        const userInfo = data.data;
        this.name = userInfo.first_name + ' ' + userInfo.last_name;
        this.cover = userInfo.cover;
        this.email = userInfo.email;
        this.mobile = userInfo.country_code + userInfo.mobile;
        if (userInfo && userInfo.wallet && userInfo.wallet.balance) {
          this.balance = userInfo.wallet.balance;
        }

        if (data && data.orders && data.orders.length) {
          data.orders.forEach((element: any) => {
            element.time = moment(element.time).format('llll');
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
              element.orders = JSON.parse(element.orders);
            }
          });
          this.orders = data.orders;
        }

        if (data && data.address && data.address.length) {
          this.address = data.address;
        }

        if (data && data.reviews && data.reviews.length) {
          data.reviews.forEach((element: any) => {
            element.updated_at = moment(element.updated_at).format('llll');
          });
          this.reviews = data.reviews;
        }
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  onTabChange(event: any) {
    console.log(event);
    this.activeTab = event;
  }

  // getDate(date: any) {
  //   return moment(date).format('llll');
  // }

  openOrder(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };
    this.router.navigate(['manage-orders'], param);
  }
}
