/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  categories: any[] = [];
  dummy: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private alertController: AlertController
  ) {
    this.getCategories();
  }

  ngOnInit() {
  }

  getCategories() {
    this.dummy = Array(10);
    this.api.post_private('v1/categories/getMyCategories', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.categories = [];
      this.dummy = [];
      if (data && data.status && data.status == 200) {
        this.categories = data.data;
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

  onBack() {
    this.util.onBack();
  }

  async addNewCat() {
    const alert = await this.alertController.create({
      header: this.util.translate('Add New!'),
      mode: 'ios',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: this.util.translate('Category Name'),
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.translate('Ok'),
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data && data.name1 != '') {
              console.log('add new');
              const param = {
                restId: localStorage.getItem('uid'),
                name: data.name1,
              };
              this.util.show();
              this.api.post_private('v1/categories/save', param).then((datas: any) => {
                console.log(datas);
                this.util.hide();
                if (datas && datas.status && datas.status == 200) {
                  this.getCategories();
                } else {
                  this.util.errorToast(this.util.translate('Something went wrong'));
                }
              }, error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              }).catch(error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              });
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async edit(item: any) {
    const alert = await this.alertController.create({
      header: this.util.translate('Edit'),
      mode: 'ios',
      inputs: [
        {
          name: 'name1',
          type: 'text',
          placeholder: this.util.translate('Category Name'),
          value: item.name
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: this.util.translate('Ok'),
          handler: (data) => {
            console.log('Confirm Ok', data);
            if (data && data.name1 != '') {
              console.log('add new');
              const param = {
                id: item.id,
                name: data.name1,
              };
              this.util.show();
              this.api.post_private('v1/categories/update', param).then((datas: any) => {
                console.log(datas);
                this.util.hide();
                if (datas && datas.status == 200) {
                  this.getCategories();
                } else {
                  this.util.errorToast(this.util.translate('Something went wrong'));
                }
              }, error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              }).catch(error => {
                console.log(error);
                this.util.hide();
                this.util.errorToast(this.util.translate('Something went wrong'));
              });

            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteItem(item: any) {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('to delete') + ' ' + item.name + ' ' + '?',
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
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.translate('Something went wrong'));
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
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
}
