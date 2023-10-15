/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-driver-rating',
  templateUrl: './driver-rating.page.html',
  styleUrls: ['./driver-rating.page.scss'],
})
export class DriverRatingPage implements OnInit {
  id: any = '';
  name: any = '';
  rate: any = 2;
  comment: any = '';
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.name = data.name;
      }
    });
  }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

  onClick(val: any) {
    this.rate = val;
  }

  submit() {
    if (this.comment == '') {
      this.util.errorToast(this.util.translate('Please enter comment'));
      return false;
    }

    console.log('rate', this.rate, this.comment);

    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: this.id,
      sid: 0,
      rate: this.rate,
      msg: this.comment,
      way: 'order',
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
    };
    console.log(param);
    this.util.show();
    this.api.post_private('v1/ratings/save_driver_review', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status == 200) {
        this.util.showToast(this.util.translate('Rating added'), 'success', 'bottom');
        this.util.onBack();
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
}
