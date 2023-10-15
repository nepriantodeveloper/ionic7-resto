/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { forgot } from 'src/app/interfaces/forgot';
import { password } from 'src/app/interfaces/password';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { VerifyResetPage } from '../verify-reset/verify-reset.page';
import { SelectCountryPage } from '../select-country/select-country.page';
import { resetPasswordMobile } from 'src/app/interfaces/reset_password_mobile';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage implements OnInit {
  login: forgot = { email: '' };
  mobile: resetPasswordMobile = { country_code: '', mobile: '' };
  submitted = false;
  isLogin: boolean = false;
  newPassword: password = {
    password: '',
    confirm: ''
  }
  step: any = 1;
  temp: any = '';
  otpId: any = '';
  viewPassword: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private chMod: ChangeDetectorRef,
    private modalController: ModalController,
    private iab: InAppBrowser,
  ) {
    this.mobile.country_code = '+' + this.util.appSettings.default_country_code;
  }

  ngOnInit() {
  }

  changeType() {
    this.viewPassword = !this.viewPassword;
  }

  onLogin(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    this.chMod.detectChanges();
    if (form.valid) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.showToast(this.util.translate('Please enter valid email'), 'danger', 'bottom');
        return false;
      }
      console.log('login');
      this.isLogin = true;

      this.api.post_public('v1/auth/verifyEmailForReset', this.login).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          this.otpId = data.otp_id;
          this.openVerificationModal(data.otp_id, this.login.email, this.login, 'email');
        } else if (data && data.status == 401 && data.error.error) {
          this.util.errorToast(data.error.error, 'danger');
        } else if (data && data.user && data.user.type != 'user') {
          this.util.errorToast(this.util.translate('Access denied'), 'danger');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
        }
      }, error => {
        this.isLogin = false;
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });

    }
  }

  async openVerificationModal(id: any, to: any, obj: any, type: any) {
    this.otpId = id;
    const modal = await this.modalController.create({
      component: VerifyResetPage,
      backdropDismiss: false,
      cssClass: 'custom-modal',
      componentProps: {
        'id': id,
        'to': to,
        'obj': obj,
        'from': type
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      if (data && data.data && data.role && data.role == 'ok') {
        this.submitted = false;
        this.temp = data.data.temp;
        console.log('temp token', this.temp);
        this.step = 2;
      }
    })
    return await modal.present();
  }

  resetPassword(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    this.chMod.detectChanges();
    if (form.valid) {
      if (this.newPassword.password != this.newPassword.confirm) {
        this.util.errorToast(this.util.translate('Password does not match'), 'danger');
        return false;
      }

      this.isLogin = true;

      const param = {
        id: this.otpId,
        email: this.login.email,
        password: this.newPassword.password
      };
      this.api.post_temp('v1/password/updateUserPasswordWithEmail', param, this.temp).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          this.util.showToast('Password Updated', 'success', 'bottom');
          this.util.onBack();
        } else if (data && data.status == 401 && data.error.error) {
          this.util.errorToast(data.error.error, 'danger');
        } else if (data && data.user && data.user.type != 'user') {
          this.util.errorToast(this.util.translate('Access denied'), 'danger');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
        }
      }, error => {
        this.isLogin = false;
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  resetPasswordPhone(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    this.chMod.detectChanges();
    if (form.valid) {
      if (this.newPassword.password != this.newPassword.confirm) {
        this.util.errorToast(this.util.translate('Password does not match'), 'danger');
        return false;
      }

      this.isLogin = true;

      const param = {
        id: this.otpId,
        country_code: this.mobile.country_code,
        mobile: this.mobile.mobile,
        otp_content: this.mobile.country_code + this.mobile.mobile,
        password: this.newPassword.password
      };
      this.api.post_temp('v1/password/updateUserPasswordWithPhone', param, this.temp).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          this.util.showToast('Password Updated', 'success', 'bottom');
          this.util.onBack();
        } else if (data && data.status == 401 && data.error.error) {
          this.util.errorToast(data.error.error, 'danger');
        } else if (data && data.user && data.user.type != 'user') {
          this.util.errorToast(this.util.translate('Access denied'), 'danger');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
        }
      }, error => {
        this.isLogin = false;
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  resetPasswordPhoneFirebase(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    this.chMod.detectChanges();
    if (form.valid) {
      if (this.newPassword.password != this.newPassword.confirm) {
        this.util.errorToast(this.util.translate('Password does not match'), 'danger');
        return false;
      }

      this.isLogin = true;

      const param = {
        country_code: this.mobile.country_code,
        mobile: this.mobile.mobile,
        otp_content: this.mobile.country_code + this.mobile.mobile,
        password: this.newPassword.password
      };
      this.api.post_temp('v1/password/updateUserPasswordWithPhoneFirebase', param, this.temp).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          this.util.showToast('Password Updated', 'success', 'bottom');
          this.util.onBack();
        } else if (data && data.status == 401 && data.error.error) {
          this.util.errorToast(data.error.error, 'danger');
        } else if (data && data.user && data.user.type != 'user') {
          this.util.errorToast(this.util.translate('Access denied'), 'danger');
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'), 'danger');
        }
      }, error => {
        this.isLogin = false;
        console.log('Error', error);
        this.util.apiErrorHandler(error);
      }).catch(error => {
        this.isLogin = false;
        console.log('Err', error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  onBack() {
    this.util.onBack();
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
        }
      });
      await modal.present();
    }
  }

  onOTPLogin(form: NgForm) {
    console.log(this.mobile);
    this.submitted = true;
    // sms_name = 0 = twillio
    // sms_name = 1 = msg91
    // sms_name = 2 = firebase
    console.log(this.util.appSettings.sms_name == '0' ? 'twillio' : this.util.appSettings.sms_name == '1' ? 'msg91' : 'firebase');
    if (form.valid) {
      if (this.util.appSettings.sms_name == '2') {
        console.log('send OTP with firebase');
        this.isLogin = true;
        this.api.post_public('v1/auth/verifyPhoneForFirebase', this.mobile).then((data: any) => {
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
        this.api.post_public('v1/otp/verifyPhone', this.mobile).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
            console.log('open modal');
            this.openVerificationModal(data.otp_id, this.mobile.country_code + this.mobile.mobile, this.mobile, 'phone');
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
      mobile: this.mobile.country_code + this.mobile.mobile
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
        this.generateFirebaseToken();
        browser.close();
      }
    });
    console.log('browser=> end');
  }

  generateFirebaseToken() {
    this.isLogin = true;
    const param = {
      country_code: this.mobile.country_code,
      mobile: this.mobile.mobile
    };
    this.api.post_temp('v1/otp/getFirebaseToken', param, this.temp).then((data: any) => {
      this.isLogin = false;
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.submitted = false;
        this.temp = data.temp;
        console.log('temp token', this.temp);
        this.step = 2;
      }
    }, error => {
      this.isLogin = false;
      console.log('Error', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      this.isLogin = false;
      console.log('Err', error);
      this.util.apiErrorHandler(error);
    });
  }
}
