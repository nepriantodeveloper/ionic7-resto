/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit {
  list: any[] = [];
  dummy: any[] = [];
  dummyList: any[] = [];
  page: number = 1;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.getAll();
  }

  ngOnInit(): void {
  }

  getAll() {
    this.list = [];
    this.dummyList = [];
    this.dummy = Array(5);
    this.api.get_private('v1/languages/getAll').then((data: any) => {
      console.log(data);
      this.list = [];
      this.dummy = [];
      this.dummyList = [];
      if (data && data.status && data.status == 200) {
        this.list = data.data;
      }
    }, error => {
      console.log(error);
      this.list = [];
      this.dummyList = [];
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.list = [];
      this.dummyList = [];
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  search(str: any) {
    this.resetChanges();
    console.log('string', str);
    this.list = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.list = this.dummyList;
  }

  setFilteredItems() {
    console.log('clear');
    this.list = [];
    this.list = this.dummyList;
  }

  filterItems(searchTerm: any) {
    return this.list.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  changeDefault(event: any, item: any) {
    console.log(event, item);
    this.util.show();
    this.api.post_private('v1/languages/changeDefault', { id: item.id }).then((datas) => {
      this.util.hide();
      console.log(datas);
      // localStorage.setItem('translateKey', item.id);
      window.location.reload();
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

  createNew() {
    this.router.navigate(['manage-languages']);
  }

  changeStatus(item: any) {
    const text = item.status == 1 ? 'Deactive' : 'Active';
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To') + ' ' + this.util.translate(text) + ' ' + this.util.translate('this language!'),
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
        const query = item.status == 1 ? 0 : 1;
        item.status = query;
        this.util.show();
        this.api.post_private('v1/languages/update', item).then((datas) => {
          this.util.hide();
          this.getAll();
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

  view(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        edit: true
      }
    };
    this.router.navigate(['manage-languages'], param);
  }
}
