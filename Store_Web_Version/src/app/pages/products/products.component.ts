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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  categories: any[] = [];
  dummyCategories: any[] = [];

  foods: any[] = [];
  dummyFoods: any[] = [];

  cateId: any = '';
  page: number = 1;

  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router
  ) {
    this.getCategories();
  }

  ngOnInit(): void {
  }

  getCategories() {
    this.dummyCategories = Array(10);
    this.api.post_private('v1/categories/getMyCategories', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.categories = [];
      this.dummyCategories = [];
      if (data && data.status && data.status == 200) {
        this.categories = data.data;
        if (this.categories.length != 0) {
          this.cateId = this.categories[0].id;
          this.getFoods();
        }
      }
    }, error => {
      console.log(error);
      this.dummyCategories = [];
      this.categories = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummyCategories = [];
      this.categories = [];
      this.util.apiErrorHandler(error);
    });
  }

  getFoods() {
    console.log(this.cateId);
    this.dummyFoods = Array(10);
    this.foods = [];
    this.api.post_private('v1/foods/getByCategories', { restId: localStorage.getItem('uid'), cid: this.cateId }).then((data: any) => {
      this.dummyFoods = [];
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.foods = data.data;
      }
    }, error => {
      console.log(error);
      this.dummyFoods = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummyFoods = [];
      this.util.apiErrorHandler(error);
    });
  }

  segmentChanged() {
    this.getFoods();
  }

  addNew() {
    this.router.navigate(['manage-products']);
  }

  saveItem() {
    console.log('add');
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
        this.api.post_private('v1/foods/delete', { id: item.id }).then((datas: any) => {
          console.log(datas);
          this.util.hide();
          if (datas && datas.status == 200) {
            this.getFoods();
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
    this.api.post_private('v1/foods/update', param).then((datas: any) => {
      console.log(datas);
      this.util.hide();
      if (datas && datas.status == 200) {
        item.status = item.status == 1 ? 0 : 1
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

  getProduct(id: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: id
      }
    };
    this.router.navigate(['manage-products'], param);
  }

}
