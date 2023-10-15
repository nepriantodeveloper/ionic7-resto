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
  selector: 'app-banners',
  templateUrl: './banners.component.html',
  styleUrls: ['./banners.component.scss']
})
export class BannersComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  list: any[] = [];
  dummy: any[] = [];
  dummyList: any[] = [];
  page: number = 1;

  id: any = '';
  banner: any = '';
  value: any = '';
  type: any = 0;
  message: any = '';
  isNew: boolean = true;
  submited: boolean = false;
  searchStore: any = '';

  stores: any[] = [];
  dummyStores: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getStore();
    this.getAll();
  }

  ngOnInit(): void {
  }

  getStore() {
    this.api.get_private('v1/stores/getAll').then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.dummyStores = data.data;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getAll() {
    this.dummy = Array(5);
    this.list = [];
    this.api.get_private('v1/banners/getAll').then((data: any) => {
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

  searchCate(str: any) {
    console.log(str);
    if (str && str !== '') {
      this.stores = this.dummyStores.filter((item) => {
        return item.name.toLowerCase().indexOf(str.toLowerCase()) > -1;
      });
    } else {
      this.stores = [];
    }
  }

  selectCate(item: any) {
    this.value = item.uid;
    this.searchStore = item.name;
    this.stores = [];
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
      this.api.uploaCSV(files, 'v1/banners/importData').subscribe((data: any) => {
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
    window.open('assets/sample/banners.csv', '_blank');
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'banner': this.util.replaceWithDot(element.banner),
        'message': this.util.replaceWithDot(element.message),
        'value': this.util.replaceWithDot(element.value),
        'type': this.util.replaceWithDot(element.type),
        'status': this.util.replaceWithDot(element.status),
      }
      data.push(info);
    });
    const name = 'banners';
    this.util.downloadFile(data, name, ['id', 'banner', 'message', 'value', 'type', 'status']);
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
      return item.message.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
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
        this.api.post_private('v1/banners/update', body).then((data: any) => {
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
        this.api.post_private('v1/banners/delete', { id: id }).then((data: any) => {
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

  addNew() {
    this.cleanData();
  }

  cleanData() {
    this.message = '';
    this.value = '';
    this.banner = '';
    this.searchStore = '';
    this.type = 0;
    this.isNew = true;
  }

  preview_banner(files: any) {
    console.log('fle', files);
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        if (data && data.data.image_name) {
          this.banner = data.data.image_name;
        }
      }, err => {
        console.log(err);
        this.util.hide();
      });
    } else {
      console.log('no');
    }
  }

  createBanner() {
    this.submited = true;
    if (this.value == '' || this.value == null || this.message == '' || this.message == null) {
      this.util.error('All Fields are required');
      return false;
    }

    if (this.banner == '' || this.banner == null) {
      this.util.error('banner Image is missing');
      return false;
    }

    const param = {
      "message": this.message,
      "banner": this.banner,
      "value": this.value,
      "type": this.type
    }
    this.util.show();
    this.api.post_private('v1/banners/save', param).then((data: any) => {
      this.util.hide();
      console.log(data);
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

  updateInfo(item: any) {
    console.log(item);
    this.id = item.id;
    this.banner = item.banner;
    this.message = item.message;
    this.type = item.type;
    if (this.type == 0) {
      const store = this.dummyStores.filter((x: any) => x.uid == item.value);
      console.log(store);
      if (store && store.length != 0) {
        this.value = item.value;
        this.searchStore = store[0].name;
      }
    } else {
      this.value = item.value;
    }
    this.isNew = false;
  }

  updateBanner() {
    this.submited = true;
    if (this.value == '' || this.value == null || this.message == '' || this.message == null) {
      this.util.error('All Fields are required');
      return false;
    }

    if (this.banner == '' || this.banner == null) {
      this.util.error('banner Image is missing');
      return false;
    }

    const param = {
      "message": this.message,
      "banner": this.banner,
      "value": this.value,
      "type": this.type,
      "id": this.id
    }
    this.util.show();
    this.api.post_private('v1/banners/update', param).then((data: any) => {
      this.util.hide();
      console.log(data);
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
}
