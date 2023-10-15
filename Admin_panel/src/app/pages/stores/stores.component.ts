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
import * as moment from 'moment';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
  @ViewChild('myModal1') public myModal1: ModalDirective;
  @ViewChild('myModal3') public myModal3: ModalDirective;
  @ViewChild('largeModal') public largeModal: ModalDirective;

  list: any[] = [];
  dummy: any[] = [];
  dummyList: any[] = [];
  page: number = 1;

  cities: any[] = [];

  storeId: any = '';
  storeUid: any = '';
  submited: boolean = false;
  cover: any = '';
  fname: any = '';
  lname: any = '';
  email: any = '';
  password: any = '';
  country_code: any = '';
  displayed: any = '';
  phone: any = '';
  gender: any = 1;
  name: any = '';
  address: any = '';
  lat: any = '';
  lng: any = '';
  openTime: any = '';
  closeTime: any = '';
  commission: any = '';
  descriptions: any = '';
  city: any = '';
  dishPrice: any = '';
  deliveryTime: any = '';
  action: any = 'create';

  countries: any[] = [];
  dummyCC: any[] = [];
  dummyLoad: any[] = [];

  cuisine: any[] = [];
  savedCuisine: any[] = [];

  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'name',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    setTimeout(() => {
      this.cuisine = this.util.cuisine;
    }, 1000);
    this.getAll();
    this.getCities();
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

  ngOnInit(): void {
  }

  getAll() {
    this.dummy = Array(5);
    this.list = [];
    this.dummyList = [];
    this.api.get_private('v1/stores/getAll').then((data: any) => {
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
      this.dummy = [];
      this.dummyList = [];
      this.list = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.dummyList = [];
      this.list = [];
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
      this.api.uploaCSV(files, 'v1/stores/importData').subscribe((data: any) => {
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
    window.open('assets/sample/store.csv', '_blank');
  }

  exportCSV() {
    let data: any = [];
    this.list.forEach(element => {
      const info = {
        'id': this.util.replaceWithDot(element.id),
        'name': this.util.replaceWithDot(element.name),
        'address': this.util.replaceWithDot(element.address),
        'commission': this.util.replaceWithDot(element.commission),
        'cover': this.util.replaceWithDot(element.cover),
        'lat': this.util.replaceWithDot(element.lat),
        'lng': this.util.replaceWithDot(element.lng),
        'mobile': this.util.replaceWithDot(element.mobile),
        'rating': this.util.replaceWithDot(element.rating),
        'total_rating': this.util.replaceWithDot(element.total_rating),
        'uid': this.util.replaceWithDot(element.uid),
        'city_name': this.util.replaceWithDot(element.city_name),
        'owner': this.util.replaceWithDot(element.first_name) + ' ' + this.util.replaceWithDot(element.last_name),
      }
      data.push(info);
    });
    const name = 'store';
    this.util.downloadFile(data, name, ['id', 'name', 'address', 'commission', 'cover', 'lat', 'lng', 'mobile', 'rating', 'total_rating', 'uid', 'city_name', 'owner']);
  }

  saveType() {
    this.myModal3.hide();
  }

  getTime(time: any) {
    return moment('2020-12-05 ' + time).format('hh:mm a');
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
        this.api.post_private('v1/stores/update', body).then((data: any) => {
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

  viewsInfo(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.uid,
      }
    };
    this.router.navigate(['manage-stores'], param);
  }

  addNew() {
    console.log('add new store');
    this.cleanData();
    this.myModal1.show();
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

  saveChanges() {
    console.log('create account');
    console.log(this.submited);

    this.submited = true;
    if (this.fname == '' || this.fname == null || this.lname == '' || this.lname == null || this.email == '' || this.email == null ||
      this.password == '' || this.password == null || this.country_code == '' || this.country_code == null || this.phone == '' || this.phone == null || this.name == '' || this.name == null ||
      this.address == null || this.address == '' || this.lat == null || this.lat == '' || this.lng == '' || this.lng == null || this.closeTime == null || this.closeTime == '' ||
      this.openTime == '' || this.openTime == null || this.commission == null || this.commission == '' || this.descriptions == '' || this.descriptions == null || this.city == '' || this.city == null ||
      this.deliveryTime == '' || this.deliveryTime == null || this.dishPrice == '' || this.dishPrice == null) {
      this.util.error('All Fields are required');
      return false;
    }
    if (this.savedCuisine.length == 0) {
      this.util.error('Please select cuisine');
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
      first_name: this.fname,
      last_name: this.lname,
      mobile: this.phone,
      email: this.email,
      country_code: this.country_code,
      password: this.password,
      cover: this.cover
    };
    this.util.show();
    this.api.post_private('v1/users/create_store_account', param).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data.status == 500) {
        this.util.error(data.message);
      }
      if (data && data.status && data.status == 200 && data.user && data.user.id) {
        this.createStoreProfile(data.user.id);
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

  createStoreProfile(uid: any) {
    const cuisines = this.savedCuisine.map((x: any) => x.name);
    console.log('saved cuisine', cuisines);
    const param = {
      uid: uid,
      name: this.name,
      mobile: this.phone,
      lat: this.lat,
      lng: this.lng,
      verified: 1,
      address: this.address,
      descriptions: this.descriptions,
      images: 'NA',
      cover: this.cover,
      commission: this.commission,
      open_time: moment('1997-07-15 ' + this.openTime).format('HH:mm'),
      close_time: moment('1997-07-18 ' + this.closeTime).format('HH:mm'),
      isClosed: 0,
      certificate_url: 'NA',
      certificate_type: 'NA',
      rating: 0,
      total_rating: 0,
      cid: this.city,
      cusine: cuisines.join(','),
      time: this.deliveryTime,
      dish: this.dishPrice
    }

    this.util.show();
    this.api.post_private('v1/stores/save', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.cleanData();
        this.util.success(this.util.translate('Store Created'));
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
    this.action = 'create';
    this.password = '';
    this.displayed = '';
    this.country_code = '';
    this.phone = '';
    this.name = '';
    this.address = '';
    this.lat = '';
    this.lng = '';
    this.openTime = '';
    this.closeTime = '';
    this.commission = '';
    this.savedCuisine = [];
    this.descriptions = '';
    this.city = '';
    this.deliveryTime = '';
    this.dishPrice = '';
  }

  editInfo(item: any) {
    console.log(item);
    this.cover = item.cover;
    this.name = item.name;
    this.address = item.address;
    this.lat = item.lat;
    this.lng = item.lng;
    this.openTime = item.open_time;
    this.closeTime = item.close_time;
    this.commission = item.commission;
    this.descriptions = item.descriptions;
    this.city = item.cid;
    this.dishPrice = item.dish;
    this.deliveryTime = item.time;
    this.storeId = item.id;
    this.storeUid = item.uid;
    if (item.cusine != '' && item.cusine != null) {
      try {
        const cusines = item.cusine.split(',');
        console.log(cusines);
        if (cusines && cusines.length) {
          this.savedCuisine = [];
          cusines.forEach((element: any) => {
            this.savedCuisine.push({ name: element });
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.action = 'edit';
    this.myModal1.show();
  }

  updateChanges() {
    this.submited = true;
    if (this.name == '' || this.name == null ||
      this.address == null || this.address == '' || this.lat == null || this.lat == '' || this.lng == '' || this.lng == null || this.closeTime == null || this.closeTime == '' ||
      this.openTime == '' || this.openTime == null || this.commission == null || this.commission == '' || this.descriptions == '' || this.descriptions == null || this.city == '' || this.city == null ||
      this.deliveryTime == '' || this.deliveryTime == null || this.dishPrice == '' || this.dishPrice == null) {
      this.util.error('All Fields are required');
      return false;
    }
    if (this.savedCuisine.length == 0) {
      this.util.error('Please select cuisine');
      return false;
    }
    if (this.cover == '' || this.cover == null) {
      this.util.error('Cover Image is missing');
      return false;
    }
    console.log('update', this.savedCuisine);
    const cuisines = this.savedCuisine.map((x: any) => x.name);
    console.log('saved cuisine', cuisines);
    const param = {
      uid: this.storeUid,
      id: this.storeId,
      name: this.name,
      lat: this.lat,
      lng: this.lng,
      address: this.address,
      descriptions: this.descriptions,
      cover: this.cover,
      commission: this.commission,
      open_time: moment('1997-07-15 ' + this.openTime).format('HH:mm'),
      close_time: moment('1997-07-18 ' + this.closeTime).format('HH:mm'),
      cid: this.city,
      cusine: cuisines.join(','),
      time: this.deliveryTime,
      dish: this.dishPrice
    }

    this.util.show();
    this.api.post_private('v1/stores/update_store_user', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.cleanData();
        this.util.success(this.util.translate('Store Updated'));
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
}

