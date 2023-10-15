/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  orders: any[] = [];
  dummOrders: any[] = [];
  dummy = Array(5);
  page = 1;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.getOrders();
  }

  ngOnInit(): void {
  }

  getOrders() {
    this.dummOrders = [];
    this.orders = [];
    this.dummy = Array(5);
    this.api.get_private('v1/orders/allOrders').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        const orders = data.data;
        orders.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
          }
        });
        this.orders = orders;
        this.dummOrders = this.orders;
      }
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  search(string: any) {
    this.resetChanges();
    console.log('string', string);
    this.orders = this.filterItems(string);
  }

  protected resetChanges = () => {
    this.orders = this.dummOrders;
  }

  setFilteredItems() {
    console.log('clear');
    this.orders = [];
    this.orders = this.dummOrders;
  }

  filterItems(searchTerm: any) {
    return this.orders.filter(x => x.id == searchTerm);
  }

  getDates(date: any) {
    return moment(date).format('llll');
  }

  importCSV() {
    this.myModal3.show();
  }

  exportCSV() {
    let data: any = [];
    this.orders.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'address': this.util.replaceWithDot(element.address),
        'applied_coupon': this.util.replaceWithDot(element.applied_coupon),
        'coupon_id': this.util.replaceWithDot(element.coupon_id),
        'did': this.util.replaceWithDot(element.did),
        'delivery_charge': this.util.replaceWithDot(element.delivery_charge),
        'discount': this.util.replaceWithDot(element.discount),
        'grand_total': this.util.replaceWithDot(element.grand_total),
        'orders': this.util.replaceWithDot(element.orders),
        'paid': this.util.replaceWithDot(element.paid),
        'pay_method': this.util.replaceWithDot(element.pay_method),
        'restId': this.util.replaceWithDot(element.restId),
        'serviceTax': this.util.replaceWithDot(element.serviceTax),
        'time': this.util.replaceWithDot(element.time),
        'total': this.util.replaceWithDot(element.total),
        'uid': this.util.replaceWithDot(element.uid),
        'notes': this.util.replaceWithDot(element.notes),
        'status': this.util.replaceWithDot(element.status),
      }
      data.push(info);
    });
    const name = 'orders';
    this.util.downloadFile(data, name, ['id', 'address', 'applied_coupon', 'coupon_id', 'did', 'delivery_charge', 'discount', 'grand_total', 'orders', 'paid', 'pay_method', 'restId', 'serviceTax', 'time', 'total', 'uid', 'notes', 'status']);
  }

  uploadCSV(files: any) {
    console.log('fle', files);
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/text\/*/) == null) {
      return;
    }

    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploaCSV(files, 'v1/orders/importData').subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        this.myModal3.hide();
        this.util.success('Uploaded');
        this.getOrders();
      }, err => {
        console.log(err);
        this.util.hide();
        this.util.apiErrorHandler(err);
      });
    } else {
      console.log('no');
    }
  }

  downloadSample() {
    window.open('assets/sample/orders.csv', '_blank');
  }

  saveType() {
    this.myModal3.hide();
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
