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
  selector: 'app-cusine-modal',
  templateUrl: './cusine-modal.page.html',
  styleUrls: ['./cusine-modal.page.scss'],
})
export class CusineModalPage implements OnInit {
  savedCusine: any[] = [];
  list: any[] = [];
  dummyList: any[] = [];
  isLoaded: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private navParam: NavParams,
    private modalController: ModalController
  ) {
    this.savedCusine = this.navParam.get('value');
    console.log(this.savedCusine);
    this.api.getLocalAssets('cuisines.json').then((data: any) => {
      console.log(data);
      this.isLoaded = true;
      this.list = data;
      this.dummyList = data;
    }, error => {
      console.log(error);
      this.dummyList = [];
      this.isLoaded = true;
      this.list = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummyList = [];
      this.isLoaded = true;
      this.list = [];
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit() {
  }

  close() {
    this.modalController.dismiss('close', 'close');
  }

  search(str: any) {
    this.resetChanges();
    console.log('string', str.detail.value);
    this.list = this.filterItems(str.detail.value);
  }

  protected resetChanges = () => {
    this.list = this.dummyList;
  }

  filterItems(searchTerm: any) {
    return this.list.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyList;
  }

  onSave() {
    this.modalController.dismiss(this.savedCusine, 'ok');
  }

  onCheckChange(name: any) {
    console.log(name);
    if (this.savedCusine.includes(name)) {
      this.savedCusine = this.savedCusine.filter((x: any) => x != name);
    } else {
      this.savedCusine.push(name);
    }
  }
}
