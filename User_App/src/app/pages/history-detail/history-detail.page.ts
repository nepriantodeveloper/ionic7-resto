/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.page.html',
  styleUrls: ['./history-detail.page.scss'],
})
export class HistoryDetailPage implements OnInit {
  id: any = '';
  isLoaded: boolean = false;

  grandTotal: any = '';
  orders: any[] = [];
  serviceTax: any = '';
  walletUsed: boolean = false;
  walletPrice: any = '';
  status: any = '';
  time: any = '';
  total: any = '';
  uid: any = '';
  restId: any = '';
  address: any = '';
  restName: any = '';
  deliveryAddress: any = '';
  paid: any = '';
  restPhone: any = '';
  coupon: boolean = false;
  dicount: any = '';
  restFCM: any = '';
  driverFCM: any = '';
  dId: any = '';
  driverName: any = '';
  driverMobile: any = '';
  driverCover: any = '';
  orderNotes: any = '';
  delivery_charge: any = 0;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getOrderInfo();
      }
    });
  }

  getOrderInfo() {
    this.isLoaded = false;
    this.api.post_private('v1/orders/getById', { id: this.id }).then((data: any) => {
      console.log(data);
      this.isLoaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.grandTotal = info.grand_total;
        this.serviceTax = info.serviceTax;
        this.walletUsed = info.wallet_used == 1 ? true : false;
        this.walletPrice = info.wallet_price;
        this.status = info.status;
        this.time = moment(info.time).format('llll');
        this.total = info.total;
        this.uid = info.uid;
        this.address = info.store_address;
        this.restName = info.store_name;
        this.paid = info.pay_method;
        this.restPhone = info.store_mobile;
        this.coupon = info.applied_coupon == 1 ? true : false;
        this.dicount = info.discount;
        this.orderNotes = info && info.notes && info.notes != 'NA' ? info.notes : '';
        this.delivery_charge = info.delivery_charge;
        this.restId = info.restId;
        if (info && info.address) {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.address)) {
            const add = JSON.parse(info.address);
            this.deliveryAddress = add.house + ' ' + add.landmark + ' ' + add.address + add.pincode;
          }
        }
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.orders)) {
          this.orders = JSON.parse(info.orders);
        }

        if (info && info.did && info.did != 0) {
          this.dId = info.did;
          this.getDriverInfo();
        }
      }
    }, error => {
      console.log(error);
      this.isLoaded = true;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.isLoaded = true;
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit() {
  }

  getDriverInfo() {
    this.api.post_private('v1/driver/getDriverInfo', { id: this.dId }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.driverName = info.first_name + ' ' + info.last_name;
        this.driverMobile = info.mobile;
        this.driverCover = info.cover;
        this.driverFCM = info.fcm_token;
        console.log(this);
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.util.translate('How was your experience?'),
      message: this.util.translate('Rate') + this.restName + ' ' + this.util.translate('and') + ' ' + this.driverName,
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Yes'),
          handler: () => {
            console.log('Confirm Okay');
            const param: NavigationExtras = {
              queryParams: {
                id: this.id
              }
            }
            this.util.navigateToPage('/rate', param);
          }
        }
      ]
    });

    await alert.present();
  }

  trackMyOrder() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    };
    this.util.navigateToPage('/tracker', param);
  }

  call() {
    if (this.restPhone) {
      window.open('tel:' + this.restPhone, '_system');
    }
  }

  driverCall() {
    if (this.driverMobile) {
      window.open('tel:' + this.driverMobile, '_system');
    } else {
      this.util.errorToast(this.util.translate('Number not found'));
    }
  }

  chat() {
    const param: NavigationExtras = {
      queryParams: {
        "id": this.restId,
        "name": this.restName
      }
    };
    this.util.navigateToPage('inbox', param);
  }

  changeStatus() {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To Cancel this order'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        console.log('cancle,delivered');
        this.util.show('Please wait');
        this.api.post_private('v1/orders/update', { id: this.id, status: 'cancel' }).then((data: any) => {
          console.log(data);
          if (data && data.status && data.status == 200 && data.data) {
            if (this.dId && this.dId != '' && this.dId != 0) {
              this.api.post_private('v1/driver/updateOrderStatus', { id: this.dId, current: 'active' }).then((data: any) => {
                console.log(data);
                this.util.hide();
                if (data && data.status && data.status == 200 && data.data) {
                  Swal.fire({
                    title: this.util.translate('success'),
                    text: this.util.translate('Order status changed to cancelled'),
                    icon: 'success',
                    timer: 2000,
                    backdrop: false,
                    background: 'white'
                  });
                  this.onBack();
                  this.sendNotification();
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
          } else {
            this.util.hide();
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
    });
  }

  onBack() {
    this.util.onBack();
  }

  sendNotification() {
    const param = {
      title: this.util.translate('Order status changed'),
      message: this.util.translate('Order status changed'),
      id: this.driverFCM
    };
    this.api.post_private('v1/notification/sendNotification', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch((error: any) => {
      console.log(error);
    });
  }
}
