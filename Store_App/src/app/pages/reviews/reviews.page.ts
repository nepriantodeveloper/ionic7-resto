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
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
})
export class ReviewsPage implements OnInit {
  list: any[] = [];
  dummy: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getList();
  }

  ngOnInit() {
  }

  getList() {
    this.dummy = Array(5);
    this.api.post_private('v1/stores/getMyReviews', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.list = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.list = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.list = [];
      this.util.apiErrorHandler(error);
    });
  }

  onBack() {
    this.util.onBack();
  }

  getDate(date: any) {
    return moment(date).format('lll');
  }
}
