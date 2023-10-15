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
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
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
    this.api.get_private('v1/address/getAll').then((data: any) => {
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
        'address': this.util.replaceWithDot(element.address),
        'house': this.util.replaceWithDot(element.house),
        'landmark': this.util.replaceWithDot(element.landmark),
        'lat': this.util.replaceWithDot(element.lat),
        'lng': this.util.replaceWithDot(element.lng),
        'pincode': this.util.replaceWithDot(element.pincode),
        'status': this.util.replaceWithDot(element.status),
        'title': this.util.replaceWithDot(element.title),
        'uid': this.util.replaceWithDot(element.uid),
      }
      data.push(info);
    });
    const name = 'address';
    this.util.downloadFile(data, name, ['id', 'address', 'house', 'landmark', 'lat', 'lng', 'pincode', 'status', 'title', 'uid']);
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
      this.api.uploaCSV(files, 'v1/address/importData').subscribe((data: any) => {
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
    window.open('assets/sample/address.csv', '_blank');
  }

  saveType() {
    this.myModal3.hide();
  }
}
