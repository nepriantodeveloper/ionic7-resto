/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Injectable, NgZone } from '@angular/core';
import { General } from '../interfaces/general';
import { Manage } from '../interfaces/manage';
import { Popup } from '../interfaces/popup';
import { Settings } from '../interfaces/settings';
import { UserInfo } from '../interfaces/userinfo';
import Swal from 'sweetalert2'
import { Subject } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class UtilService {
  public generalSettings: General;
  public manageAppSettings: Manage;
  public popupMessage: Popup;
  public appSettings: Settings;
  public userInfo: UserInfo;
  public countries: any[] = [];
  public deviceType: any = 'desktop';
  public orderDetails: any;

  public languages: any[] = [];
  public translations: any[] = [];
  // Subscriber
  private loginModalPopup = new Subject<any>();
  private appHeader = new Subject<any>();
  private filterCode = new Subject<any>();
  private modalPopup = new Subject<any>();
  private newAddress = new Subject<any>();
  private addressPopup = new Subject<any>();
  private coupon = new Subject<any>();
  public paymentLeavve = new Subject<any>();
  constructor(
    public router: Router,
    private zone: NgZone,
    private spinner: NgxSpinnerService,
  ) { }

  navigateToPage(routes: any, param?: NavigationExtras | undefined) {
    this.zone.run(() => {
      console.log(routes, param);
      this.router.navigate([routes], param);
    });
  }

  errorToast(msg: any, color?: any) {
    Swal.fire({
      icon: 'error',
      title: msg,
      toast: true,
      showConfirmButton: false,
      timer: 2000,
      position: 'bottom-right'
    });
  }

  successToast(msg: any, color?: any) {
    Swal.fire({
      icon: 'success',
      title: msg,
      toast: true,
      showConfirmButton: false,
      timer: 2000,
      position: 'bottom-right'
    });
  }

  translate(str: any) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

  start() {
    this.spinner.show();
  }

  stop() {
    this.spinner.hide();
  }

  apiErrorHandler(err: any) {
    // console.log('Error got in service =>', err)
    if (err && err.status == 401 && err.error.error) {
      this.errorToast(err.error.error);
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      localStorage.removeItem('sid');
      this.onLoginPop();
      return false;
    }
    if (err && err.status == 500 && err.error.error) {
      this.errorToast(err.error.error);
      return false;
    }
    if (err.status == -1) {
      this.errorToast('Failed To Connect With Server');
    } else if (err.status == 401) {
      this.errorToast('Unauthorized Request!');
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      this.onLoginPop();
    } else if (err.status == 500) {
      this.errorToast('Something went wrong');
    } else if (err.status == 422 && err.error.error) {
      this.errorToast(err.error.error);
    } else {
      this.errorToast('Something went wrong');
    }
  }

  public loadScript(url: string) {
    const body = <HTMLDivElement>document.body;
    const script = document.createElement('script');
    script.innerHTML = '';
    script.src = url;
    script.async = false;
    script.defer = true;
    body.appendChild(script);
  }

  getKeys(key: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(localStorage.getItem(key));
    });
  }

  clearKeys(key: any) {
    localStorage.removeItem(key);
  }

  setKeys(key: any, value: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(localStorage.setItem(key, value));
    });
  }

  onLoginPop() {
    this.loginModalPopup.next(0);
  }

  onSubscribe(): Subject<any> {
    return this.loginModalPopup;
  }

  publishHeader(data: any) {
    this.appHeader.next(data);
  }

  subscribeHeader(): Subject<any> {
    return this.appHeader;
  }

  publishFilterCode(data: any) {
    this.filterCode.next(data);
  }

  subscribeFitlerCode(): Subject<any> {
    return this.filterCode;
  }

  publishModalPopup(data: any) {
    this.modalPopup.next(data);
  }

  subscribeModalPopup(): Subject<any> {
    return this.modalPopup;
  }

  subscribeNewAddress(): Subject<any> {
    return this.newAddress;
  }

  publishNewAddress() {
    this.newAddress.next(0);
  }

  publishAddressPopup() {
    this.addressPopup.next(0);
  }

  subscribeAddressPopup(): Subject<any> {
    return this.addressPopup;
  }

  publishCoupon(data: any) {
    this.coupon.next(data);
  }

  getCouponObservable(): Subject<any> {
    return this.coupon;
  }

  updatePaymentIssue() {
    this.paymentLeavve.next(0);
  }

  changeIntevert(): Subject<any> {
    return this.paymentLeavve;
  }
}
