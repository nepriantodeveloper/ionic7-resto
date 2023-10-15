/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  dummyCategories: any[] = [];
  dummy: any[] = [];
  page: number = 1;
  constructor(
    public util: UtilService,
    public api: ApiService,
  ) {
    this.getCategories();
  }

  ngOnInit(): void {
  }

  getCategories() {
    this.dummy = Array(10);
    this.categories = [];
    this.dummyCategories = [];
    this.api.post_private('v1/categories/getMyCategories', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.categories = [];
      this.dummy = [];
      if (data && data.status && data.status == 200) {
        this.categories = data.data;
        this.dummyCategories = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.categories = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.categories = [];
      this.util.apiErrorHandler(error);
    });
  }

  deleteItem(item: any) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('to delete') + ' ' + item.name + ' ?',
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: this.util.translate('Delete'),
      backdrop: false,
      background: 'white'
    }).then(status => {
      if (status && status.value) {
        this.util.show();
        this.api.post_private('v1/categories/delete', { id: item.id }).then((datas: any) => {
          console.log(datas);
          this.util.hide();
          if (datas && datas.status == 200) {
            this.getCategories();
          } else {
            this.util.error(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.error(this.util.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.error(this.util.translate('Something went wrong'));
        });
      }
    });
  }

  hideStatus(item: any) {
    const param = {
      id: item.id,
      status: item.status == 1 ? 0 : 1
    };
    this.util.show();
    this.api.post_private('v1/categories/update', param).then((datas: any) => {
      console.log(datas);
      this.util.hide();
      if (datas && datas.status == 200) {
        this.getCategories();
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.error(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.error(this.util.translate('Something went wrong'));
    });
  }


  search(str: any) {
    this.resetChanges();
    console.log('string', str);
    this.categories = this.filterItems(str);
  }

  protected resetChanges = () => {
    this.categories = this.dummyCategories;
  }

  filterItems(searchTerm: any) {
    return this.categories.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });
  }

  setFilteredItems() {
    console.log('clear');
    this.categories = [];
    this.categories = this.dummyCategories;
  }

  addNew() {
    Swal.fire({
      title: this.util.translate('Enter Name'),
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: this.util.translate('Submit'),
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        console.log(result.value);
        this.util.show();
        const param = {
          restId: localStorage.getItem('uid'),
          name: result.value,
        };
        this.util.show();
        this.api.post_private('v1/categories/save', param).then((datas: any) => {
          console.log(datas);
          this.util.hide();
          if (datas && datas.status && datas.status == 200) {
            this.getCategories();
          } else {
            this.util.error(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.error(this.util.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.error(this.util.translate('Something went wrong'));
        });
      }
    });
  }

  updateInfo(item: any) {
    console.log(item);
    Swal.fire({
      title: this.util.translate('Enter Name'),
      input: 'text',
      inputValue: item.name,
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: this.util.translate('Submit'),
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        console.log(result.value);
        const param = {
          id: item.id,
          name: result.value,
        };
        this.util.show();
        this.api.post_private('v1/categories/update', param).then((datas: any) => {
          console.log(datas);
          this.util.hide();
          if (datas && datas.status == 200) {
            this.getCategories();
          } else {
            this.util.error(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.error(this.util.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.error(this.util.translate('Something went wrong'));
        });
      }
    });
  }
}
