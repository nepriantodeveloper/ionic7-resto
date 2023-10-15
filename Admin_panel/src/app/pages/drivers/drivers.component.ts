/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-drivers',
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss']
})
export class DriversComponent implements OnInit {
  @ViewChild('myModal3') public myModal3: ModalDirective;
  @ViewChild('myModal1') public myModal1: ModalDirective;
  @ViewChild('largeModal') public largeModal: ModalDirective;
  list: any[] = [];
  dummy: any[] = [];
  dummyList: any[] = [];
  page: number = 1;

  countries: any[] = [];
  dummyCC: any[] = [];
  dummyLoad: any[] = [];
  cities: any = [] = [];

  submited: boolean = false;
  cover: any = '';
  fname: any = '';
  lname: any = '';
  email: any = '';
  password: any = '';
  phone: any = '';
  gender: any = 1;
  country_code: any = '';
  displayed: any = '';
  city: any = '';
  address: any = '';
  lat: any = '';
  lng: any = '';
  driverId: any = '';
  action: any = 'create';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.getAll();
    this.getCities();
  }

  ngOnInit(): void {
  }

  getAll() {
    this.list = [];
    this.dummyList = [];
    this.dummy = Array(5);
    this.api.get_private('v1/drivers/getAll').then((data: any) => {
      console.log(data);
      this.list = [];
      this.dummy = [];
      this.dummyList = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.list = data.data;
        this.dummyList = data.data;
      }
    }, error => {
      console.log(error);
      this.list = [];
      this.dummy = [];
      this.dummyList = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.list = [];
      this.dummy = [];
      this.dummyList = [];
      this.util.apiErrorHandler(error);
    });
  }

  getCities() {
    this.api.get_private('v1/cities/getAll').then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.cities = data.data;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  importCSV() {
    this.myModal3.show();
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
      var name = item.first_name + " " + item.last_name;
      return name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyList;
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
      this.api.uploaCSV(files, 'v1/drivers/importData').subscribe((data: any) => {
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
    window.open('assets/sample/drivers.csv', '_blank');
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'first_name': this.util.replaceWithDot(element.first_name),
        'last_name': this.util.replaceWithDot(element.last_name),
        'country_code': this.util.replaceWithDot(element.country_code),
        'mobile': this.util.replaceWithDot(element.mobile),
        'email': this.util.replaceWithDot(element.email),
        'cover': this.util.replaceWithDot(element.cover),
      }
      data.push(info);
    });
    const name = 'driver';
    this.util.downloadFile(data, name, ['id', 'first_name', 'last_name', 'cover', 'country_code', 'mobile', 'email']);
  }

  saveType() {
    this.myModal3.hide();
  }

  addNew() {
    console.log('add new');
    this.cleanData();
    this.myModal1.show();
  }

  onSearchChange(events: any) {
    console.log(events);
    if (events !== '') {
      this.countries = this.dummyCC.filter((item) => {
        return item.country_name.toLowerCase().indexOf(events.toLowerCase()) > -1;
      });
    } else {
      this.countries = this.dummyCC;
    }
  }

  useCode() {
    console.log(this.country_code);
    this.displayed = '+' + this.country_code;
    this.largeModal.hide();
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
          this.cover = data.data.image_name;
        }
      }, err => {
        console.log(err);
        this.util.hide();
      });
    } else {
      console.log('no');
    }
  }

  openCountryModel() {
    console.log('open moda');
    this.dummyLoad = Array(10);
    setTimeout(() => {
      this.dummyLoad = [];
      this.dummyCC = this.util.countrys;
      this.countries = this.dummyCC;
      this.util.countrys;
      console.log(this.dummyCC);
    }, 500);
    this.largeModal.show();
  }

  saveChanges() {
    console.log('create account');
    this.submited = true;
    if (this.fname == null || this.fname == '' || this.lname == null || this.lname == '' || this.email == null || this.email == '' || this.password == null || this.password == '' ||
      this.phone == null || this.phone == '' || this.country_code == null || this.country_code == '' || this.city == null || this.city == '' || this.address == null || this.address == '' ||
      this.lat == null || this.lat == '' || this.lng == null || this.lng == '') {
      this.util.error('All Fields are required');
      return false;
    }
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(this.email)) {
      this.util.error(this.util.translate('Please enter valid Email ID'));
      return false;
    }
    if (this.cover == '' || this.cover == null) {
      this.util.error('Cover Image is missing');
      return false;
    }

    console.log(typeof this.country_code)
    const cc: string = (this.country_code).toString();
    if (!cc.includes('+')) {
      this.country_code = '+' + this.country_code
    };
    const param = {
      "email": this.email,
      "first_name": this.fname,
      "last_name": this.lname,
      "mobile": this.phone,
      "country_code": this.country_code,
      "password": this.password,
      "cover": this.cover,
      "gender": this.gender,
      "city": this.city,
      "address": this.address,
      "lat": this.lat,
      "lng": this.lng
    };
    console.log(param);
    this.util.show();
    this.api.post_private('v1/drivers/create_driver_account', param).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data.status == 500) {
        this.util.error(data.message);
      }
      if (data && data.status && data.status == 200 && data.user && data.user.id) {
        this.cleanData();
        this.util.success(this.util.translate('Driver Created'));
        this.myModal1.hide();
        this.getAll();
      } else if (data && data.error && data.error.msg) {
        this.util.error(data.error.msg);
      } else if (data && data.error && data.error.message == 'Validation Error.') {
        for (let key in data.error[0]) {
          console.log(data.error[0][key][0]);
          this.util.error(data.error[0][key][0]);
        }
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.error(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.error(error.error.error[key][0]);
        }
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }).catch(error => {
      console.log(error);
      this.util.hide();
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.error(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.error(error.error.error[key][0]);
        }
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    });
  }

  updateChanges() {
    console.log('update account');
    this.submited = true;
    if (this.fname == null || this.fname == '' || this.lname == null || this.lname == '' || this.city == null || this.city == '' || this.address == null || this.address == '' ||
      this.lat == null || this.lat == '' || this.lng == null || this.lng == '') {
      this.util.error('All Fields are required');
      return false;
    }
    if (this.cover == '' || this.cover == null) {
      this.util.error('Cover Image is missing');
      return false;
    }
    const param = {
      "id": this.driverId,
      "first_name": this.fname,
      "last_name": this.lname,
      "cover": this.cover,
      "city": this.city,
      "address": this.address,
      "lat": this.lat,
      "lng": this.lng
    };
    this.util.show();
    this.api.post_private('v1/drivers/update', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.cleanData();
        this.util.success(this.util.translate('Driver Updated'));
        this.myModal1.hide();
        this.getAll();
      }
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  cleanData() {
    this.cover = '';
    this.fname = '';
    this.lname = '';
    this.email = '';
    this.password = '';
    this.country_code = '';
    this.phone = '';
    this.lat = '';
    this.lng = '';
    this.address = '';
    this.city = '';
    this.action = 'create';
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
        this.api.post_private('v1/drivers/update', body).then((data: any) => {
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

  viewsInfo(id: any) {
    console.log(id);
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.router.navigate(['manage-drivers'], param);
  }

  editInfo(item: any) {
    console.log(item);
    this.driverId = item.id;
    this.fname = item.first_name;
    this.lname = item.last_name;
    this.cover = item.cover;
    this.city = item.city;
    this.address = item.address;
    this.lat = item.lat;
    this.lng = item.lng;
    this.action = 'edit';
    this.myModal1.show();
  }
}
