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
import * as moment from 'moment';
import { mobileLogin } from 'src/app/interfaces/mobileLogin';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { VerifyPage } from '../verify/verify.page';
import Swal from 'sweetalert2';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.page.html',
  styleUrls: ['./order-detail.page.scss'],
})
export class OrderDetailPage implements OnInit {
  id: any = '';
  isLoaded: boolean = false;
  grandTotal: any = '';
  discount: any = '';
  walletPrice: any = '';
  orders: any[] = [];
  serviceTax: any = '';
  status: any = '';
  time: any = '';
  total: any = '';
  payment: any = '';
  address: any = '';
  orderNotes: any = '';
  deliveryAddress: any = '';
  deliveryCharge: any = '';
  restName: any = '';
  storeFCM: any = '';
  username: any = '';
  useremail: any = '';
  userphone: any = '';
  usercover: any = '';
  token: any = '';
  changeStatusOrder: any = '';
  mobileLogin: mobileLogin = { country_code: '', mobile: '' };
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private iab: InAppBrowser,
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getOrder();
      }
    });
  }

  ngOnInit() {
  }

  getOrder() {
    this.isLoaded = false;
    this.api.post_private('v1/orders/getDriverOrderById', { id: this.id }).then((data: any) => {
      console.log(data);
      this.isLoaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.grandTotal = info.grand_total;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.orders)) {
          this.orders = JSON.parse(info.orders);
        }
        this.serviceTax = info.serviceTax;
        this.discount = info.discount;
        this.walletPrice = info.wallet_price;
        this.status = info.status;
        this.time = moment(info.time).format('llll');
        this.total = info.total;
        this.payment = info.pay_method;
        this.address = info.store_address;
        this.orderNotes = info.notes;
        if (info && info.address && info.address != '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.address)) {
            const addr = JSON.parse(info.address);
            this.deliveryAddress = addr.house + ' ' + addr.landmark + ' ' + addr.address + ' ' + addr.pincode;
          }
        }
        this.deliveryCharge = info.delivery_charge;
        this.restName = info.store_name;
        this.storeFCM = info.store_fcm_token;

        this.username = info.first_name + ' ' + info.last_name;
        this.useremail = info.user_email;
        this.userphone = info.user_mobile;
        this.mobileLogin.mobile = info.user_mobile;
        this.mobileLogin.country_code = info.user_country_code;
        this.usercover = info.user_cover;
        this.token = info.user_fcm_token;

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

  onBack() {
    this.util.onBack();
  }

  call() {
    window.open('tel:' + this.userphone, '_system')
  }
  mail() {
    window.open('mailto:' + this.useremail, '_system')
  }

  goToTracker() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.id
      }
    };
    this.util.navigateToPage('/tracker', param);
  }

  changeOrderStatus() {
    console.log('order status', this.changeStatusOrder);
    if (this.changeStatusOrder) {
      this.changeStatus(this.changeStatusOrder);
    }
  }

  sendSMSNotification() {
    console.log(this.mobileLogin);
    if (this.util.appSettings.sms_name == '2') {
      console.log('send OTP with firebase');
      this.util.show();
      this.api.post_public('v1/auth/verifyPhoneForFirebase', this.mobileLogin).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data) {
          console.log('open firebase web version');
          this.openFirebaseAuthModal();
        }
      }, error => {
        this.util.hide();
        this.util.apiErrorHandler(error);
      }).catch((error) => {
        this.util.hide();
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('send OTP with other SMS');
      this.util.show();
      this.api.post_public('v1/otp/verifyPhone', this.mobileLogin).then((data: any) => {
        this.util.hide();
        console.log(data);
        if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
          this.openVerificationModal(data.otp_id, this.mobileLogin.country_code + this.mobileLogin.mobile);
        } else if (data && data.status && data.status == 500 && data.data == false) {
          this.util.errorToast(this.util.translate('Something went wrong'));
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

  async openFirebaseAuthModal() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      mobile: this.mobileLogin.country_code + this.mobileLogin.mobile
    }
    const browser = this.iab.create(this.api.baseUrl + 'v1/auth/firebaseauth?' + this.api.JSON_to_URLEncoded(param), '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_verified')) {
        const urlItems = new URL(event.url);
        console.log(urlItems);
        console.log('ok login now');
        this.deliverOrder('delivered');
        browser.close();
      }
    });
    console.log('browser=> end');
  }

  async openVerificationModal(id: any, to: any) {
    const modal = await this.modalController.create({
      component: VerifyPage,
      backdropDismiss: false,
      cssClass: 'custom-modal',
      componentProps: {
        'id': id,
        'to': to
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      if (data && data.data && data.role && data.role == 'ok') {
        this.deliverOrder('delivered');
      }
    })
    return await modal.present();
  }

  changeStatus(value: any) {
    console.log(value);
    if (value == 'ongoing') {
      this.updateOrder(value);
    } else if (value == 'delivered' && this.util.appSettings.delivery == 1) {
      console.log('open modal');
      this.sendSMSNotification();
    } else {
      this.deliverOrder(value);
    }
  }

  updateOrder(value: any) {
    console.log('update order');
    this.util.show('Please wait');
    this.api.post_private('v1/orders/updateMyOrder', { id: this.id, status: value }).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        const msg = this.util.translate('Your Order is') + ' ' + value + ' ' + this.util.translate('By') + ' ' + this.util.driverInfo.first_name + ' ' + this.util.driverInfo.last_name;
        this.sendNotification(msg, msg, this.token);
        this.sendNotification(msg, msg, this.storeFCM);
        Swal.fire({
          title: this.util.translate('success'),
          text: this.util.translate('Order status changed to') + ' ' + value,
          icon: 'success',
          timer: 2000,
          backdrop: false,
          background: 'white'
        });
        this.util.onOrderChanges();
        this.util.onBack();
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

  deliverOrder(value: any) {
    console.log('deliver order');
    this.util.show('Please wait');
    this.api.post_private('v1/orders/completeOrder', { id: this.id, status: value, did: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.sendNotification(this.util.translate('Order status changed'), this.util.translate('Order status changed'), this.storeFCM);
        const msg = this.util.translate('Your Order is') + ' ' + value + ' ' + this.util.translate('By') + ' ' + this.util.driverInfo.first_name + ' ' + this.util.driverInfo.last_name;
        this.sendNotification(msg, msg, this.token);
        Swal.fire({
          title: this.util.translate('success'),
          text: this.util.translate('Order status changed to ') + value,
          icon: 'success',
          timer: 2000,
          backdrop: false,
          background: 'white'
        });
        this.util.onOrderChanges();
        this.util.onBack();
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

  sendNotification(title: any, message: any, id: any) {
    const param = {
      title: title,
      message: message,
      id: id
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
