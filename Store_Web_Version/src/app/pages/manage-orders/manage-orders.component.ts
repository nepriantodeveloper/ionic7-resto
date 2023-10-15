/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';
import { brandSet, flagSet, freeSet } from '@coreui/icons';
import { IconSetService } from '@coreui/icons-angular';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  @ViewChild('myModal') public myModal: ModalDirective;
  id: any = '';
  isLoaded: boolean = false;
  grandTotal: any = '';
  orders: any[] = [];
  serviceTax: any = '';
  status: any = '';
  time: any = '';
  total: any = '';
  uid: any = '';
  address: any = '';
  restName: any = '';
  userName: any = '';
  userEmail: any = '';
  userPic: any = '';
  phone: any = '';
  token: any = '';
  did: any = '';
  deliveryAddress: any = '';
  changeStatusOrder: any = '';
  drivers: any[] = [];
  dummyDriver: any[] = [];
  userLat: any = '';
  userLng: any = '';
  paid: any = '';
  orderString: any[] = [];
  deliveryCharge: any = '';

  driverId: any = '';
  driverName: any = '';
  driverMobile: any = '';
  driverCover: any = '';
  driverFCM: any = '';

  orderNotes: any = '';
  distanceType: any = '';
  walletUsed: boolean = false;
  walletPrice: any = '';

  haveCoupon: boolean = false;
  discount: any = '';

  selectedDriver: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private iconSetService: IconSetService,
  ) {
    iconSetService.icons = { ...brandSet, ...flagSet, ...freeSet };
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getOrder();
      }
    });
  }

  ngOnInit(): void {
  }

  getDrivers() {
    this.api.post_private('v1/drivers/getNearMe', { "lat": this.userLat, "lng": this.userLng }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.drivers = data.data;
        this.dummyDriver = data.data;
        this.distanceType = data.distanceType;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getOrder() {
    this.isLoaded = false;
    this.api.post_private('v1/orders/getUserOrderById', { id: this.id }).then((data: any) => {
      console.log(data);
      this.isLoaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        if (info && info.address) {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.address)) {
            const add = JSON.parse(info.address);
            this.deliveryAddress = add.house + ' ' + add.landmark + ' ' + add.address + add.pincode;
            this.userLat = add.lat;
            this.userLng = add.lng;
            this.getDrivers();
          }
        }
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.orders)) {
          this.orders = JSON.parse(info.orders);
          console.log(this.orders);
        }
        this.grandTotal = info.grand_total;
        this.serviceTax = info.serviceTax;
        this.status = info.status;
        this.time = moment(data.time).format('llll');
        this.total = info.total;
        this.uid = info.uid;
        this.restName = this.util.storeInfo.name;
        this.userName = info.first_name + ' ' + info.last_name;
        this.userEmail = info.user_email;
        this.userPic = info.user_cover;
        this.phone = info.user_mobile;
        this.token = info.user_fcm_token;
        this.paid = info.pay_method;
        this.orderNotes = info.notes;
        this.deliveryCharge = info.delivery_charge;
        this.walletUsed = info.wallet_used == 0 ? false : true;
        this.walletPrice = info.wallet_price;
        this.haveCoupon = info.discount == 0 ? false : true;
        this.discount = info.discount;
        if (info && info.did && info.did != 0) {
          this.did = info.did;
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

  getDriverInfo() {
    this.api.post_private('v1/driver/getDriverInfo', { id: this.did }).then((data: any) => {
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

  printOrder() {
    const param = {
      id: this.id,
      token: localStorage.getItem('token')
    };
    const url = this.api.baseUrl + 'v1/orders/printInvoice?' + this.api.JSON_to_URLEncoded(param);
    window.open(url, '_system');
  }

  driverCall() {
    if (this.driverMobile) {
      window.open('tel:' + this.driverMobile, '_system');
    } else {
      this.util.error(this.util.translate('Number not found'));
    }
  }

  call() {
    if (this.phone) {
      window.open('tel:' + this.phone, '_system');
    } else {
      this.util.error(this.util.translate('Number not found'));
    }
  }

  email() {
    if (this.userEmail) {
      window.open('mailto:' + this.userEmail, '_system');
    } else {
      this.util.error(this.util.translate('Email not found'));
    }
  }


  autoAssignment() {
    console.log('auto assignents', this.drivers);
    if (this.drivers && this.drivers.length) {
      const max = this.drivers.reduce((prev, current) => (prev.distance < current.distance) ? prev : current)
      console.log('max', max);
      if (max && max.id) {
        console.log('assigne to this driver', max.first_name);
        this.util.show();
        this.api.post_private('v1/orders/acceptOrder', { id: this.id, status: 'accepted', did: max.id }).then((data: any) => {
          console.log(data);
          this.util.hide();
          if (data && data.status && data.status == 200 && data.data) {
            this.sendNotification(this.util.translate('New Order'), this.util.translate('New Order Received'), max.fcm_token);
            const msg = this.util.translate('Your Order is') + ' ' + this.util.translate('accepted') + ' ' + this.util.translate('By') + ' ' + this.restName;
            this.sendNotification(msg, msg, this.token);
            Swal.fire({
              title: this.util.translate('success'),
              text: this.util.translate('Order status changed to ') + this.util.translate('accepted'),
              icon: 'success',
              timer: 2000,
              backdrop: false,
              background: 'white'
            });
            this.navCtrl.back();
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

      } else {
        console.log('no driver found');
        this.util.error('No Active Driver Found');
      }
    } else {
      console.log('no driver found');
      this.util.error('No Active Driver Found');
    }
  }

  changeStatus(value: any) {
    if (value == 'accepted') {
      console.log('accepted', this.drivers);
      if (this.util.appSettings.driver_assignments == 0) {
        console.log('manually select driver');
        this.presentModal();
      } else {
        console.log('auto select driver');
        this.autoAssignment();
      }
    } else if (value == 'ongoing') {
      console.log('ongoing....');
      this.util.show();
      this.api.post_private('v1/orders/updateStoreOrderStatus', { id: this.id, status: value }).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data) {
          const msg = this.util.translate('Your Order is') + ' ' + this.util.translate(value) + ' ' + this.util.translate('By') + ' ' + this.restName;
          this.sendNotification(msg, msg, this.token);
          Swal.fire({
            title: this.util.translate('success'),
            text: this.util.translate('Order status changed to') + ' ' + this.util.translate(value),
            icon: 'success',
            timer: 2000,
            backdrop: false,
            background: 'white'
          });
          this.navCtrl.back();
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

    } else {
      console.log('cancle,delivered');
      this.util.show();
      this.api.post_private('v1/orders/completeOrder', { id: this.id, status: value, did: this.did }).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data) {
          this.sendNotification(this.util.translate('Order statuts changed'), this.util.translate('Order statuts changed'), this.driverFCM);
          const msg = this.util.translate('Your Order is') + ' ' + this.util.translate(value) + ' ' + this.util.translate('By') + ' ' + this.restName;
          this.sendNotification(msg, msg, this.token);
          Swal.fire({
            title: this.util.translate('success'),
            text: this.util.translate('Order status changed to ') + this.util.translate(value),
            icon: 'success',
            timer: 2000,
            backdrop: false,
            background: 'white'
          });
          this.navCtrl.back();
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

  changeOrderStatus() {
    console.log('order status', this.changeStatusOrder);
    if (this.changeStatusOrder) {
      this.changeStatus(this.changeStatusOrder);
    }
  }

  async presentModal() {
    this.myModal.show();
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

  saveDriver() {
    console.log(this.selectedDriver);
    if (this.selectedDriver == '' || this.selectedDriver == null) {
      this.util.error('Please select driver');
      return false;
    }
    const selected = this.dummyDriver.filter(x => x.id == this.selectedDriver);
    console.log(selected);
    if (selected && selected.length) {
      this.myModal.hide();
      this.util.show();
      this.api.post_private('v1/orders/acceptOrder', { id: this.id, status: 'accepted', did: selected[0].id }).then((order: any) => {
        console.log(order);
        this.util.hide();
        if (order && order.status && order.status == 200 && order.data) {
          this.sendNotification(this.util.translate('New Order'), this.util.translate('New Order Received'), selected[0].fcm_token);
          const msg = this.util.translate('Your Order is') + ' ' + this.util.translate('accepted') + ' ' + this.util.translate('By') + ' ' + this.restName;
          this.sendNotification(msg, msg, this.token);
          Swal.fire({
            title: this.util.translate('success'),
            text: this.util.translate('Order status changed to') + ' ' + this.util.translate('accepted'),
            icon: 'success',
            timer: 2000,
            backdrop: false,
            background: 'white'
          });
          this.navCtrl.back();
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

  selectDriver(id: any) {
    this.selectedDriver = id;
  }
}
