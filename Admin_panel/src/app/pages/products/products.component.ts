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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  list: any[] = [];
  dummy: any[] = [];
  dummyList: any[] = [];
  page: number = 1;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getAll();
  }

  ngOnInit(): void {
  }

  getAll() {
    this.dummy = Array(5);
    this.list = [];
    this.api.get_private('v1/foods/getAll').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.list = data.data;
        this.dummyList = data.data;
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
      this.api.uploaCSV(files, 'v1/foods/importData').subscribe((data: any) => {
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
    window.open('assets/sample/foods.csv', '_blank');
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'restId': this.util.replaceWithDot(element.restId),
        'cid': this.util.replaceWithDot(element.cid),
        'cover': this.util.replaceWithDot(element.cover),
        'details': this.util.replaceWithDot(element.details),
        'price': this.util.replaceWithDot(element.price),
        'rating': this.util.replaceWithDot(element.rating),
        'veg': this.util.replaceWithDot(element.veg),
        'name': this.util.replaceWithDot(element.name),
        'variations': this.util.replaceWithDot(element.variations),
        'size': this.util.replaceWithDot(element.size),
        'status': this.util.replaceWithDot(element.status),
        'extra_field': this.util.replaceWithDot(element.extra_field),
      }
      data.push(info);
    });
    const name = 'foods';
    this.util.downloadFile(data, name, ['id', 'restId', 'cid', 'cover', 'details', 'price', 'rating', 'veg', 'name', 'variations', 'size', 'status', 'extra_field']);
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
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyList;
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
        this.api.post_private('v1/foods/updateStatus', body).then((data: any) => {
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
        this.api.post_private('v1/foods/deleteItem', { id: id }).then((data: any) => {
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
}
