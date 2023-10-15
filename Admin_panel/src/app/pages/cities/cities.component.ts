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
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  id: any = '';
  name: any = '';
  lat: any = '';
  lng: any = '';
  action: any = 'create';

  dummy: any[] = [];
  list: any[] = [];
  dummyCities: any[] = [];

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
    this.list = [];
    this.dummyCities = [];
    this.dummy = Array(5);
    this.api.get_private('v1/cities/getAll').then((data: any) => {
      console.log(data);
      this.dummy = [];
      this.list = [];
      this.dummyCities = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.list = data.data;
        this.dummyCities = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.list = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.list = [];
      this.util.apiErrorHandler(error);
    });
  }

  cleanData() {
    this.id = '';
    this.name = '';
    this.lat = '';
    this.lng = '';
    this.action = 'create';
  }

  createItem() {
    if (this.name == '') {
      this.util.error('Please enter name');
      return false;
    }
    if (this.lat == '') {
      this.util.error('Please enter latitude');
      return false;
    }
    if (this.lng == '') {
      this.util.error('Please enter longiture');
      return false;
    }
    const param = {
      "name": this.name,
      "lat": this.lat,
      "lng": this.lng,
      "status": 1
    };
    this.util.show();
    this.api.post_private('v1/cities/save', param).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.cleanData();
        this.getAll();
      } else {
        this.util.error('Something went wrong');
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  updateItem() {
    if (this.name == '') {
      this.util.error('Please enter name');
      return false;
    }
    if (this.lat == '') {
      this.util.error('Please enter latitude');
      return false;
    }
    if (this.lng == '') {
      this.util.error('Please enter longiture');
      return false;
    }
    const param = {
      "name": this.name,
      "lat": this.lat,
      "lng": this.lng,
      "id": this.id
    };
    this.util.show();
    this.api.post_private('v1/cities/update', param).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.cleanData();
        this.getAll();
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  search(str: any) {
    this.resetChanges();
    console.log('string', str);
    this.list = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.list = this.dummyCities;
  }

  filterItems(searchTerm: any) {
    return this.list.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyCities;
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
      this.api.uploaCSV(files, 'v1/cities/importData').subscribe((data: any) => {
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
    window.open('assets/sample/cities.csv', '_blank');
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'name': this.util.replaceWithDot(element.name),
        'lat': this.util.replaceWithDot(element.lat),
        'lng': this.util.replaceWithDot(element.lng),
        'extra_field': this.util.replaceWithDot(element.extra_field),
        'status': this.util.replaceWithDot(element.status),
      }
      data.push(info);
    });
    const name = 'cities';
    this.util.downloadFile(data, name, ['id', 'name', 'lat', 'lng', 'extra_field', 'status']);
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
        this.api.post_private('v1/cities/update', body).then((data: any) => {
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

  updateInfo(id: any) {
    console.log(id);
    this.id = id;
    this.util.show();
    this.api.post_private('v1/cities/getById', { "id": id }).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success) {
        this.name = data.data.name;
        this.lat = data.data.lat;
        this.lng = data.data.lng;
        this.action = 'update';
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
        this.api.post_private('v1/cities/delete', { id: id }).then((data: any) => {
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
