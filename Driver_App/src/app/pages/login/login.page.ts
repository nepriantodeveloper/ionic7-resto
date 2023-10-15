/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { login } from 'src/app/interfaces/login';
import { mobile } from 'src/app/interfaces/mobile';
import { mobileLogin } from 'src/app/interfaces/mobileLogin';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { SelectCountryPage } from '../select-country/select-country.page';
import { VerifyPage } from '../verify/verify.page';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login: login = { email: '', password: '' };
  mobile: mobile = { country_code: '', mobile: '', password: '' };
  mobileLogin: mobileLogin = { country_code: '', mobile: '' };
  submitted = false;
  isLogin: boolean = false;
  passwordView: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private modalController: ModalController,
    private iab: InAppBrowser,
  ) {
    this.mobile.country_code = '+' + this.util.appSettings.default_country_code;
    this.mobileLogin.country_code = '+' + this.util.appSettings.default_country_code;
  }

  ngOnInit() {
  }

  changePasswordViews() {
    this.passwordView = !this.passwordView;
  }

  resetPass() {
    this.util.navigateToPage('/forgot-password');
  }

  onLogin(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    if (form.valid) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
        return false;
      }
      console.log('login');
      console.log(this.login);
      this.isLogin = true;
      this.api.post_public('v1/driver/login', this.login).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status && data.status == 200 && data.user) {
          if (data && data.user && data.user.status && data.user.status == 1) {
            console.log('all ok');
            localStorage.setItem('uid', data.user.id);
            localStorage.setItem('token', data.token);
            this.updateFCMToken();
            this.getDriverInfo();
            this.util.navigateRoot('');
          } else {
            this.util.errorToast('Your account is suspended');
          }
        } else {
          this.util.errorToast('Not valid user');
        }
      }, error => {
        console.log(error);
        this.isLogin = false;
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.isLogin = false;
        this.util.apiErrorHandler(error);
      });
    }
  }

  onPhoneLogin(form: NgForm) {
    console.log('form', form, this.mobile);
    console.log(this.mobile.country_code + this.mobile.mobile);
    this.submitted = true;
    if (form.valid) {
      this.isLogin = true;
      this.api.post_public('v1/driver/loginWithPhonePassword', this.mobile).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status && data.status == 200 && data.user) {
          if (data && data.user && data.user.status && data.user.status == 1) {
            console.log('all ok');
            localStorage.setItem('uid', data.user.id);
            localStorage.setItem('token', data.token);
            this.updateFCMToken();
            this.getDriverInfo();
            this.util.navigateRoot('');
          } else {
            this.util.errorToast('Your account is suspended');
          }
        } else {
          this.util.errorToast('Not valid user');
        }
      }, error => {
        console.log(error);
        this.isLogin = false;
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.isLogin = false;
        this.util.apiErrorHandler(error);
      });
    }
  }

  async openCountry() {
    console.log('open ccode');
    if (this.util.countries.length != 0) {
      const modal = await this.modalController.create({
        component: SelectCountryPage,
        backdropDismiss: false,
        showBackdrop: true,
      });
      modal.onDidDismiss().then((data) => {
        console.log(data);
        if (data && data.role == 'selected') {
          console.log('ok');
          this.mobile.country_code = '+' + data.data;
          this.mobileLogin.country_code = '+' + data.data;
        }
      });
      await modal.present();
    }
  }

  onOTPLogin(form: NgForm) {
    console.log(this.mobileLogin);
    this.submitted = true;
    // sms_name = 0 = twillio
    // sms_name = 1 = msg91
    // sms_name = 2 = firebase
    console.log(this.util.appSettings.sms_name == '0' ? 'twillio' : this.util.appSettings.sms_name == '1' ? 'msg91' : 'firebase');
    if (form.valid) {
      if (this.util.appSettings.sms_name == '2') {
        console.log('send OTP with firebase');
        this.isLogin = true;
        this.api.post_public('v1/driver/verifyPhoneForFirebase', this.mobileLogin).then((data: any) => {
          console.log(data);
          this.isLogin = false;
          if (data && data.status && data.status == 200 && data.data) {
            console.log('open firebase web version');
            this.openFirebaseAuthModal();
          }
        }, error => {
          this.isLogin = false;
          this.util.apiErrorHandler(error);
        }).catch((error) => {
          this.isLogin = false;
          console.log(error);
          this.util.apiErrorHandler(error);
        });
      } else {
        console.log('send OTP with other SMS');
        this.isLogin = true;
        this.api.post_public('v1/driver/verifyPhone', this.mobileLogin).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
            this.openVerificationModal(data.otp_id, this.mobileLogin.country_code + this.mobileLogin.mobile);
          } else if (data && data.status && data.status == 500 && data.data == false) {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.isLogin = false;
          this.util.apiErrorHandler(error);
        }).catch((error: any) => {
          console.log(error);
          this.isLogin = false;
          this.util.apiErrorHandler(error);
        });
      }
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
        this.loginWithPhoneOTPVerified();
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
        this.loginWithPhoneOTPVerified();
      }
    })
    return await modal.present();
  }

  loginWithPhoneOTPVerified() {
    console.log('all ok');
    this.util.show();
    this.api.post_public('v1/driver/loginWithMobileOtp', this.mobileLogin).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data && data.status && data.status == 200 && data.user) {
        if (data && data.user && data.user.status && data.user.status == 1) {
          console.log('all ok');
          localStorage.setItem('uid', data.user.id);
          localStorage.setItem('token', data.token);
          this.updateFCMToken();
          this.getDriverInfo();
          this.util.navigateRoot('');
        } else {
          this.util.errorToast('Your account is suspended');
        }
      } else {
        this.util.errorToast('Not valid user');
      }
    }, error => {
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.util.hide();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  getDriverInfo() {
    this.api.post_private('v1/drivers/getById', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log('driver info', data);
      if (data && data.status && data.status == 200 && data.data) {
        this.util.driverInfo = data.data;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  updateFCMToken() {
    const param = {
      id: localStorage.getItem('uid'),
      fcm_token: localStorage.getItem('pushToken') && localStorage.getItem('pushToken') != null ? localStorage.getItem('pushToken') : 'NA'
    }
    this.api.post_private('v1/driver/updateMyLocation', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }
}
