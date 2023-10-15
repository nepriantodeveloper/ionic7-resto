/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;

  dummy: any[] = [];
  list: any[] = [];
  page: number = 1;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getList();
  }

  ngOnInit(): void {
  }

  getList() {
    this.dummy = Array(5);
    this.api.get_private('v1/reviews/getAll').then((data: any) => {
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

  importCSV() {
    this.myModal3.show();
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'did': this.util.replaceWithDot(element.did),
        'msg': this.util.replaceWithDot(element.msg),
        'pid': this.util.replaceWithDot(element.pid),
        'rate': this.util.replaceWithDot(element.rate),
        'sid': this.util.replaceWithDot(element.sid),
        'status': this.util.replaceWithDot(element.status),
        'uid': this.util.replaceWithDot(element.uid),
        'way': this.util.replaceWithDot(element.way),
      }
      data.push(info);
    });
    const name = 'rating';
    this.util.downloadFile(data, name, ['id', 'did', 'msg', 'pid', 'rate', 'sid', 'status', 'uid', 'way']);
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
      this.api.uploaCSV(files, 'v1/reviews/importData').subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        this.myModal3.hide();
        this.util.success('Uploaded');
        this.getList();
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
    window.open('assets/sample/rating.csv', '_blank');
  }

  saveType() {
    this.myModal3.hide();
  }

}
