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
import { ActionSheetController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.page.html',
  styleUrls: ['./add-review.page.scss'],
})
export class AddReviewPage implements OnInit {
  id: any = '';
  name: any = '';
  rate: any = 2;
  comment: any = '';
  total: any = '';
  rating: any[] = [];
  way: any = '';
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
        if (data.way) {
          this.way = data.way;
        } else {
          this.way = 'manually';
        }

        this.util.show();
        this.api.post_private('v1/ratings/getStoreRatings', { id: this.id }).then((data: any) => {
          this.util.hide();
          console.log('data', data);
          if (data && data.status && data.status == 200 && data.data && data.data.length) {
            this.rating = data.data.map(function (x: any) {
              return parseInt(x.rate);
            });
            this.total = this.rating.length;
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.total = 0;
          this.rating = [];
        });
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

    this.rating.push(this.rate);
    const sumOfRatingCount = this.rating.length * 5;
    const sumOfStars = this.rating.reduce((a, b) => parseFloat(a) + parseFloat(b), 0);
    const ratings = ((sumOfStars * 5) / sumOfRatingCount).toFixed(2);
    console.log(ratings);
    console.log(this.rating);

    console.log('rate', this.rate, this.comment);

    const param = {
      uid: localStorage.getItem('uid'),
      pid: 0,
      did: 0,
      sid: this.id,
      rate: this.rate,
      msg: this.comment,
      way: this.way,
      status: 1,
      timestamp: moment().format('YYYY-MM-DD'),
      total_rating: this.total + 1,
      rating: ratings
    };
    console.log(param);
    this.util.show();
    this.api.post_private('v1/ratings/save', param).then((data: any) => {
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
