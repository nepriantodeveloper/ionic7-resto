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
  selector: 'app-driver-stats',
  templateUrl: './driver-stats.component.html',
  styleUrls: ['./driver-stats.component.scss']
})
export class DriverStatsComponent implements OnInit {
  drivers: any[] = [];
  driverId: any = '';
  from: any = '';
  to: any = '';

  orders: any[] = [];
  driverCommission: any = 0;
  totalAmount: any = 0;
  commisionAmount: any = 0;
  toPay: any = 0;

  apiCalled: boolean = false;
  driverName: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getAll();
  }

  ngOnInit(): void {
  }

  getAll() {
    this.api.get_private('v1/drivers/getAll').then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.drivers = data.data;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getStats() {
    console.log(this.driverId);
    console.log(this.from);
    console.log(this.to);
    if (this.from == null || this.from == '' || this.to == null || this.to == '' || this.driverId == null || this.driverId == '' ||
      this.driverCommission == '' || this.driverCommission == null) {
      this.util.error('All Fields are required');
      return false;
    }
    const param = {
      id: this.driverId,
      from: moment(this.from).format('YYYY-MM-DD'),
      end: moment(this.to).format('YYYY-MM-DD')
    }
    console.log(param);
    this.util.show();
    this.apiCalled = false;
    this.api.post_private('v1/orders/getDriverStatsAdmin', param).then((data: any) => {
      console.log(data);
      this.apiCalled = true;
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
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
          console.log(total, this.driverCommission);
          const totalPrice = percentage(total, parseFloat(this.driverCommission));
          console.log('commistion=====>>>>>', totalPrice.toFixed(2));
          this.commisionAmount = totalPrice.toFixed(2);
          this.totalAmount = total;
          this.toPay = this.totalAmount - this.commisionAmount;
        }, 1000);
        const driverInfo = this.drivers.filter(x => x.id == this.driverId);
        if (driverInfo && driverInfo.length) {
          this.driverName = driverInfo[0].first_name + ' ' + driverInfo[0].last_name;
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
    return ((parseFloat(total) * this.driverCommission) / 100).toFixed(2);
  }

  getName() {
    return this.driverName + '_' + moment(this.from).format('DDMMYYYY') + '_' + moment(this.to).format('DDMMYYYY');
  }
}
