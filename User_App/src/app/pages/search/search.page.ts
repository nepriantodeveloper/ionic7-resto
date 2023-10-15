/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchContent: any = '';
  list: any[] = [];
  distanceType: any = '';
  constructor(
    private modalController: ModalController,
    public api: ApiService,
    public util: UtilService
  ) { }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss();
  }

  onSearchChange(event: any) {
    console.log(event);
    if (event && event.detail && event.detail.value && event.detail.value != '') {
      const uid = localStorage.getItem('uid') && localStorage.getItem('uid') != null && localStorage.getItem('uid') != 'null' ? localStorage.getItem('uid') : 'NA';
      const param = {
        "param": event.detail.value,
        "lat": localStorage.getItem('lat'),
        "lng": localStorage.getItem('lng'),
      };
      this.api.get_public('v1/stores/searchResult?' + this.api.JSON_to_URLEncoded(param)).then((data: any) => {
        console.log(data);
        if (data && data.status && data.status == 200 && data.data && data.data.length) {
          data.data.forEach(async (element: any) => {
            element.rating = parseFloat(element.rating);
            element.time = parseInt(element.time);
            element.dish = parseInt(element.dish);
            element['isOpen'] = this.isOpen(element.open_time, element.close_time);
          });
          this.list = data.data;
          this.distanceType = data.distanceType;
          this.list = this.list.sort((a, b) =>
            parseFloat(a.distance) < parseFloat(b.distance) ? -1
              : (parseFloat(a.distance) > parseFloat(b.distance) ? 1 : 0));
          console.log(this.list);

        }
      }, error => {
        console.log(error);
        this.list = [];
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.list = [];
        this.util.apiErrorHandler(error);
      });
    } else {
      this.list = [];
    }
  }

  isOpen(open: any, close: any) {
    const format = 'HH:mm:ss';
    const currentTime = moment().format(format);
    const time = moment(currentTime, format);
    const beforeTime = moment(open, format);
    const afterTime = moment(close, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false;
  }

  openMenu(item: any) {
    console.log(item);
    this.modalController.dismiss(item, 'ok');
  }
}
