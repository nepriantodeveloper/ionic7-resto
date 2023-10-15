/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  stores: any[] = [];
  storeId: any = '';
  from: any = '';
  to: any = '';

  orders: any[] = [];
  storecommission: any = 0;
  totalAmount: any = 0;
  commisionAmount: any = 0;
  toPay: any = 0;

  apiCalled: boolean = false;
  storename: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getStores();
  }

  ngOnInit(): void {
  }

  getStores() {
    this.util.show();
    this.api.get_private('v1/stores/getAll').then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.stores = data.data;
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

  getStats() {
    console.log(this.storeId);
    console.log(this.from);
    console.log(this.to);
    if (this.from == null || this.from == '' || this.to == null || this.to == '' || this.storeId == null || this.storeId == '') {
      this.util.error('All Fields are required');
      return false;
    }
    const param = {
      id: this.storeId,
      from: moment(this.from).format('YYYY-MM-DD'),
      end: moment(this.to).format('YYYY-MM-DD')
    }
    console.log(param);
    this.util.show();
    this.apiCalled = false;
    this.api.post_private('v1/orders/getStatsByDateAdmin', param).then((data: any) => {
      console.log(data);
      this.apiCalled = true;
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.storecommission = data.commission.commission;
        console.log('commission', this.storecommission);
        let total = 0;
        data.data.forEach((element: any) => {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(element.orders)) {
            element.orders = JSON.parse(element.orders);
            element.date_time = moment(element.date_time).format('dddd, MMMM Do YYYY');
            console.log(element.total);
            total = total + parseFloat(element.total);
          }
        });
        this.orders = data.data;
        console.log(this.orders);
        console.log(total);
        setTimeout(() => {
          function percentage(num: any, per: any) {
            return (num / 100) * per;
          }
          console.log(this.orders);
          console.log(total, this.storecommission);
          const totalPrice = percentage(total, parseFloat(this.storecommission));
          console.log('commistion=====>>>>>', totalPrice.toFixed(2));
          this.commisionAmount = totalPrice.toFixed(2);
          this.totalAmount = total;
          this.toPay = this.totalAmount - this.commisionAmount;
        }, 1000);
        const storeInfo = this.stores.filter(x => x.uid == this.storeId);
        if (storeInfo && storeInfo.length) {
          this.storename = storeInfo[0].name;
        }
      }
    }, error => {
      console.log(error);
      this.orders = [];
      this.util.hide();
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.orders = [];
      this.util.hide();
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    });
  }

  today() {
    return moment().format('ll');
  }
  getDate(date: any) {
    return moment(date).format('ll');
  }

  getCommisions(total: any) {
    return ((parseFloat(total) * this.storecommission) / 100).toFixed(2);
  }

  printStats() {
    const param = {
      id: this.storeId,
      from: moment(this.from).format('YYYY-MM-DD'),
      end: moment(this.to).format('YYYY-MM-DD'),
      from_date: this.getDate(this.from),
      end_date: this.getDate(this.to),
      total: this.totalAmount,
      commission: this.commisionAmount,
      amount_received: this.toPay
    };
    const url = this.api.baseUrl + 'v1/orders/printStatsDate?' + this.api.JSON_to_URLEncoded(param);
    window.open(url, '_system');
  }
}
