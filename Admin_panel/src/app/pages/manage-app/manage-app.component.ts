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
  selector: 'app-manage-app',
  templateUrl: './manage-app.component.html',
  styleUrls: ['./manage-app.component.scss']
})
export class ManageAppComponent implements OnInit {
  id: any = '';
  status: any = 1;
  message: any = '';
  haveData: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getDefault();
  }

  ngOnInit(): void {
  }

  getDefault() {
    this.util.show();
    this.api.get_private('v1/manage/getDefault').then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.haveData = true
        this.id = data.data.id;
        this.status = data.data.app_close;
        this.message = data.data.message;
      } else {
        this.haveData = false;
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

  saveSettings() {
    console.log(this.haveData);
    if (this.message == null || this.message == '') {
      this.util.error('Please enter message');
      return false;
    }
    if (this.haveData == false) {
      console.log('create');
      const param = {
        "app_close": this.status,
        "message": this.message,
        "date_time": moment().format('YYYY-MM-DD HH:mm:SS'),
      };
      this.util.show();
      this.api.post_private('v1/manage/save', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        this.getDefault();
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.util.hide();
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('update');
      const param = {
        "app_close": this.status,
        "message": this.message,
        "date_time": moment().format('YYYY-MM-DD HH:mm:SS'),
        "id": this.id
      };
      this.util.show();
      this.api.post_private('v1/manage/update', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        this.getDefault();
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
  }
}
