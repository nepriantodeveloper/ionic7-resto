/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-select-drivers',
  templateUrl: './select-drivers.page.html',
  styleUrls: ['./select-drivers.page.scss'],
})
export class SelectDriversPage implements OnInit {
  drivers: any[] = [];
  selectedDriver: any = '';
  distanceType: any = '';
  constructor(
    private navParam: NavParams,
    private modalController: ModalController,
    public api: ApiService,
    public util: UtilService
  ) {
    this.drivers = this.navParam.get('item');
    this.distanceType = this.navParam.get('distanceType');
    console.log('drivers->', this.drivers);
    if (this.drivers.length && this.drivers.length > 0) {
      this.selectedDriver = this.drivers[0].id;
    }
  }

  ngOnInit() {
  }

  select() {
    console.log(this.selectedDriver);
    let driver = this.drivers.filter(x => x.id == this.selectedDriver);
    console.log(driver);
    this.modalController.dismiss(driver, 'selected');
  }

  close() {
    this.modalController.dismiss([], 'close');
  }

}
