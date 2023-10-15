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
  selector: 'app-manage-drivers',
  templateUrl: './manage-drivers.component.html',
  styleUrls: ['./manage-drivers.component.scss']
})
export class ManageDriversComponent implements OnInit {
  id: any = '';
  name: any = '';
  cover: any = '';
  email: any = '';
  mobile: any = '';

  orders: any[] = [];
  reviews: any[] = [];

  activeTab: number = 0;
  orderPage: number = 1;
  reviewPage: number = 1;
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
        this.getInfo();
      }
    });
  }

  ngOnInit(): void {
  }

  getInfo() {
    this.util.show();
    this.api.post_private('v1/orders/driverProfileAdmin', { id: this.id }).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200) {
        const userInfo = data.data;
        this.name = userInfo.first_name + ' ' + userInfo.last_name;
        this.cover = userInfo.cover;
        this.email = userInfo.email;
        this.mobile = userInfo.country_code + userInfo.mobile;


        if (data && data.orders && data.orders.length) {
          data.orders.forEach((element: any) => {
            element.time = moment(element.time).format('llll');
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
              element.orders = JSON.parse(element.orders);
            }

            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.address)) {
              const addr = JSON.parse(element.address);
              element['delivery_address'] = addr.house + ' ' + addr.landmark + ' ' + addr.address + ' ' + addr.pincode;
            }
          });
          this.orders = data.orders;
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
