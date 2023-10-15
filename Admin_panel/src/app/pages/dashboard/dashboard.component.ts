/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavigationExtras, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dummy: any[] = [];
  dummyList: any[] = [];
  page: any = 1;
  recentOrders: any[] = [];
  recentUsers: any[] = [];

  users: any = 0;
  order: any = 0;
  stores: any = 0;
  products: any = 0;

  labelToday: any = '';
  labelWeekly: any = '';
  labelMonthly: any = '';

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  name: any = '';
  email: any = '';
  message: any = '';

  reply: any = '';
  id: any = '';


  chartBarData = {
    labels: [this.util.translate('Sells')],
    datasets: [
      {
        label: this.util.translate('Sells'),
        backgroundColor: '#f87979',
        data: [0]
      }
    ]
  };

  chartBarData2 = {
    labels: [this.util.translate('Sells')],
    datasets: [
      {
        label: this.util.translate('Sells'),
        backgroundColor: '#f87979',
        data: [0]
      }
    ]
  };

  chartBarData3 = {
    labels: [this.util.translate('Sells')],
    datasets: [
      {
        label: this.util.translate('Sells'),
        backgroundColor: '#f87979',
        data: [0]
      }
    ]
  };
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.getHome();
  }


  ngOnInit() {

  }

  openPage(url: any) {
    this.router.navigate([url]);
  }

  getHome() {
    this.dummy = Array(5);
    this.api.get_private('v1/orders/getDashboard').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200) {
        this.users = data.users;
        this.order = data.orders;
        this.stores = data.store;
        this.products = data.foods;

        console.log(data.today);
        if (data && data && data.today && data.today.label) {
          data.today.label.forEach((element: any) => {
            this.chartBarData.labels.push(element);
          });
          data.today.data.forEach((element: any) => {
            this.chartBarData.datasets[0].data.push(element);
          });
        }
        this.labelToday = data.todayLabel;

        console.log(data.week);
        if (data && data && data.week && data.week.label) {
          data.week.label.forEach((element: any) => {
            this.chartBarData2.labels.push(element);
          });
          data.week.data.forEach((element: any) => {
            this.chartBarData2.datasets[0].data.push(element);
          });
        }
        this.labelWeekly = data.weekLabel;

        console.log(data.month);
        if (data && data && data.month && data.month.label) {
          data.month.label.forEach((element: any) => {
            this.chartBarData3.labels.push(element);
          });
          data.month.data.forEach((element: any) => {
            this.chartBarData3.datasets[0].data.push(element);
          });
        }
        this.labelMonthly = data.monthLabel;

        console.log(this);

        this.recentUsers = data.recentUsers;
        this.recentOrders = data.recentOrders;

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

  statusUpdate(item: any) {
    console.log(item);
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To update this item?'),
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      if (data && data.value) {
        console.log('update it');
        const body = {
          id: item.id,
          status: item.status == 0 ? 1 : 0
        };
        item.status = item.status == 0 ? 1 : 0
        this.util.show();
        this.api.post_private('v1/users/update', body).then((data: any) => {
          this.util.hide();
          console.log("+++++++++++++++", data);
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
          }
        }, error => {
          this.util.hide();
          console.log('Error', error);
          this.util.apiErrorHandler(error);
        }).catch(error => {
          this.util.hide();
          console.log('Err', error);
          this.util.apiErrorHandler(error);
        });
      }
    });
  }

  viewsInfo(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item
      }
    };
    this.router.navigate(['manage-users'], param);
  }

  viewsInfoUser(id: any) {
    console.log(id);
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.router.navigate(['user-details'], param);
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

  getDates(date: any) {
    return moment(date).format('ll');
  }

}
