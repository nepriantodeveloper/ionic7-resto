/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  list: any[] = [];
  dummy: any[] = [];
  dummyList: any[] = [];

  name: any = '';
  off: any = '';
  type: any = 'per';
  min: any = '';
  date_time: any = '';
  descriptions: any = '';
  upto: any = '';
  id: any = '';

  isNew: boolean = true;
  page: number = 1;
  dropdownList: any[] = [];
  selectedItems: any[] = [];
  dropdownSettings = {};

  submited: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'uid',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      allowSearchFilter: true
    };
    this.getStore();
    this.getAll();
  }

  ngOnInit(): void {
  }

  getAll() {
    this.list = [];
    this.dummy = Array(5);
    this.api.get_private('v1/offers/getAll').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.list = data.data;
        this.dummyList = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  getStore() {
    this.api.get_private('v1/stores/getAll').then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.dropdownList = data.data;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  createOffer() {
    console.log(this.selectedItems);
    const storeId = [...new Set(this.selectedItems.map((item: any) => item.uid))];
    console.log(storeId);
    this.submited = true;
    if (this.name == null || this.name == '' || this.off == null || this.off == '' ||
      this.min == null || this.min == '' || this.upto == null || this.upto == '' || this.date_time == null || this.date_time == '' ||
      this.descriptions == null || this.descriptions == '') {
      this.util.error('All Fields are required');
      return false;
    }
    if (this.selectedItems.length == 0) {
      this.util.error('Please select restaurant');
      return false;
    }
    const param = {
      code: this.name,
      discount: this.off,
      type: this.type,
      min: this.min,
      expire: this.date_time,
      details: this.descriptions,
      upto: this.upto,
      available: storeId.join(',')
    };
    this.util.show();
    this.api.post_private('v1/offers/save', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.getAll();
        this.cleanData();
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

  updateOffer() {
    console.log(this.selectedItems);
    this.submited = true;
    const storeId = [...new Set(this.selectedItems.map((item: any) => item.uid))];
    console.log(storeId);
    if (this.name == null || this.name == '' || this.off == null || this.off == '' ||
      this.min == null || this.min == '' || this.upto == null || this.upto == '' || this.date_time == null || this.date_time == '' ||
      this.descriptions == null || this.descriptions == '') {
      this.util.error('All Fields are required');
      return false;
    }
    if (this.selectedItems.length == 0) {
      this.util.error('Please select restaurant');
      return false;
    }
    const param = {
      code: this.name,
      discount: this.off,
      type: this.type,
      min: this.min,
      expire: this.date_time,
      details: this.descriptions,
      upto: this.upto,
      available: storeId.join(','),
      id: this.id
    };
    this.util.show();
    this.api.post_private('v1/offers/update', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.getAll();
        this.cleanData();
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

  cleanData() {
    this.selectedItems = [];
    this.isNew = true;
    this.name = '';
    this.off = '';
    this.type = 'per';
    this.min = '';
    this.date_time = '';
    this.descriptions = '';
    this.upto = '';
    this.submited = false;
  }

  importCSV() {
    this.myModal3.show();
  }

  saveType() {
    this.myModal3.hide();
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
      this.api.uploaCSV(files, 'v1/offers/importData').subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        this.myModal3.hide();
        this.util.success('Uploaded');
        this.getAll();
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
    window.open('assets/sample/offers.csv', '_blank');
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'available': this.util.replaceWithDot(element.available),
        'code': this.util.replaceWithDot(element.code),
        'details': this.util.replaceWithDot(element.details),
        'discount': this.util.replaceWithDot(element.discount),
        'expire': this.util.replaceWithDot(element.expire),
        'min': this.util.replaceWithDot(element.min),
        'type': this.util.replaceWithDot(element.type),
        'upto': this.util.replaceWithDot(element.upto),
        'status': this.util.replaceWithDot(element.status),
      }
      data.push(info);
    });
    const name = 'offers';
    this.util.downloadFile(data, name, ['id', 'available', 'code', 'details', 'discount', 'expire', 'min', 'type', 'upto', 'status']);
  }

  search(str: any) {
    this.resetChanges();
    console.log('string', str);
    this.list = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.list = this.dummyList;
  }

  filterItems(searchTerm: any) {
    return this.list.filter((item) => {
      return item.code.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyList;
  }

  getDate(item: any) {
    return moment(item).format('lll');
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
        this.util.show();
        this.api.post_private('v1/offers/update', body).then((data: any) => {
          this.util.hide();
          console.log("+++++++++++++++", data);
          if (data && data.status && data.status == 200 && data.success) {
            this.util.success(this.util.translate('Status Updated !'));
            this.getAll();
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

  deleteItem(id: any) {
    console.log(id);
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To delete this item?'),
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
        console.log(id);
        this.util.show();
        this.api.post_private('v1/offers/delete', { id: id }).then((data: any) => {
          console.log(data);
          this.util.hide();
          if (data && data.status && data.status == 200) {
            this.getAll();
          }
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    });
  }

  updateInfo(item: any) {
    console.log(item);
    this.isNew = false;
    this.name = item.code;
    this.off = item.discount;
    this.type = item.type;
    this.min = item.min;
    this.date_time = item.expire;
    this.descriptions = item.details;
    this.upto = item.upto;
    this.submited = false;
    this.id = item.id;
    console.log(item.available);
    if (item.available != '') {
      const savedIds = item.available.split(',').map(Number);
      console.log(savedIds);
      this.selectedItems = [];
      this.dropdownList.forEach((element: any) => {
        if (savedIds.includes(element.uid)) {
          const param = {
            "uid": element.uid,
            "name": element.name
          };
          this.selectedItems.push(param);
        }
      });
    }
  }
}
