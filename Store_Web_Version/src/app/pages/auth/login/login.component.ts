/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import * as firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: any = '';
  password: any = '';
  submited: any = false;
  langId: any = 'en';

  country_code: any = '';
  mobile: any = '';

  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;
  otpId: any = '';
  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.country_code = this.util.appSettings.default_country_code;
    this.langId = localStorage.getItem('selectedLanguage');
  }

  ngOnInit() {
    setTimeout(() => {
      if (!firebase.default.app.length) {
        firebase.default.initializeApp(environment.firebase);
      } else {
        firebase.default.app();
      }

      this.recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier('sign-in-button', {
        size: 'invisible',
        callback: (response: any) => {

        },
        'expired-callback': () => {
        }
      });
    }, 5000);
  }

  onLogin() {
    this.submited = true;
    if (this.email == null || this.password == null || this.email == '' || this.password == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.email)) {
      this.util.error(this.util.translate('Please enter valid email'));
      return false;
    }

    this.util.show();
    const param = {
      email: this.email,
      password: this.password
    }
    this.api.post('v1/auth/login', param).then((data: any) => {
      console.log("+++++++++++++++", data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.user && data.user.type == 'store') {
        if (data && data.user && data.user.status && data.user.status == 1 && data.store && data.store.status == 1) {
          console.log('all ok');
          localStorage.setItem('uid', data.user.id);
          localStorage.setItem('sid', data.store.id);
          localStorage.setItem('token', data.token);
          this.util.storeInfo = data.store;
          this.router.navigate(['']);
        } else {
          this.util.error('Your account is suspended');
        }
      } else if (data && data.status == 401 && data.error.error) {
        this.util.error(data.error.error);
      } else if (data && data.user && data.user.type != 0) {
        this.util.error(this.util.translate('Access denied'));
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
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

  forgot() {
    console.log('item');
    this.router.navigate(['forgot']);
  }

  changeLanguages() {
    console.log(this.langId);
    const item = this.util.languages.filter((x: any) => x.id == this.langId);
    console.log(item);
    if (item && item.length > 0) {
      const direction = item[0].positions == 0 ? 'ltr' : 'rtl';
      localStorage.setItem('selectedLanguage', item[0].id);
      localStorage.setItem('direction', direction);
      window.location.reload();
    }
  }

  phonePasswordLogin() {
    console.log(this.country_code, this.mobile, this.password);
    this.submited = true;
    if (this.mobile == null || this.password == null || this.mobile == '' || this.password == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    console.log(typeof this.country_code)
    const cc: string = (this.country_code).toString();
    if (!cc.includes('+')) {
      this.country_code = '+' + this.country_code
    };
    this.util.show();
    const param = {
      country_code: this.country_code,
      mobile: this.mobile,
      password: this.password
    }
    this.api.post('v1/auth/loginWithPhonePassword', param).then((data: any) => {
      console.log("+++++++++++++++", data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.user && data.user.type == 'store') {
        if (data && data.user && data.user.status && data.user.status == 1 && data.store && data.store.status == 1) {
          console.log('all ok');
          localStorage.setItem('uid', data.user.id);
          localStorage.setItem('sid', data.store.id);
          localStorage.setItem('token', data.token);
          this.util.storeInfo = data.store;
          this.router.navigate(['']);
        } else {
          this.util.error('Your account is suspended');
        }
      } else if (data && data.status == 401 && data.error.error) {
        this.util.error(data.error.error);
      } else if (data && data.user && data.user.type != 0) {
        this.util.error(this.util.translate('Access denied'));
      } else {
        this.util.error(this.util.translate('Something went wrong'));
      }
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

  phoneOTPLogin() {
    console.log(this.country_code, this.mobile);
    this.submited = true;
    if (this.mobile == null || this.mobile == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    console.log(typeof this.country_code)
    const cc: string = (this.country_code).toString();
    if (!cc.includes('+')) {
      this.country_code = '+' + this.country_code
    };
    const param = {
      country_code: this.country_code,
      mobile: this.mobile,
    }

    if (this.util.appSettings.sms_name == '2') {
      console.log('send OTP with firebase');

      this.util.show();
      this.api.post('v1/auth/verifyPhoneForFirebase', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        if (data && data.status && data.status == 200 && data.data) {
          console.log('open firebase web version');
          this.util.show();
          this.api.signInWithPhoneNumber(this.recaptchaVerifier, this.country_code + this.mobile).then(
            success => {
              this.util.hide();
              Swal.fire({
                title: this.util.translate('Enter OTP'),
                input: 'number',
                inputAttributes: {
                  autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: this.util.translate('Verify OTP'),
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Swal.isLoading()
              }).then((result) => {
                console.log(result);
                if (result.isConfirmed) {
                  console.log(result.value);
                  this.util.show();
                  this.api.enterVerificationCode(result.value).then(
                    userData => {
                      this.util.hide();

                      this.loginWithPhoneOTPVerified();
                      console.log(userData);
                    }
                  ).catch(error => {
                    console.log(error);
                    this.util.hide();
                    this.util.apiErrorHandler(error);
                  });
                }
              });
            }
          ).catch(error => {
            this.util.hide();
            console.log(error);
            this.util.error(error);
          });
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
      this.api.post('v1/otp/verifyPhone', param).then((data: any) => {
        this.util.hide();
        console.log(data);
        if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
          this.otpId = data.otp_id;
          Swal.fire({
            title: this.util.translate('Enter OTP'),
            input: 'number',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: this.util.translate('Verify OTP'),
            showLoaderOnConfirm: true,
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            console.log(result);
            if (result.isConfirmed) {
              console.log(result.value);
              const param = {
                id: this.otpId,
                otp: result.value
              };
              this.util.show();
              this.api.post('v1/otp/verifyOTP', param).then((data: any) => {
                console.log(data);
                this.util.hide();
                if (data && data.status && data.status === 200 && data.data) {
                  this.loginWithPhoneOTPVerified();
                }
              }, error => {
                this.util.hide();
                console.log(error);
                if (error && error.status === 401 && error.error.error) {
                  this.util.error(error.error.error);
                  return false;
                }
                if (error && error.status === 500 && error.error.error) {
                  this.util.error(error.error.error);
                  return false;
                }
                this.util.hide();
                this.util.error(this.util.translate('Wrong OTP'));
              }).catch((error) => {
                this.util.hide();
                console.log(error);
                if (error && error.status === 401 && error.error.error) {
                  this.util.error(error.error.error);
                  return false;
                }
                if (error && error.status === 500 && error.error.error) {
                  this.util.error(error.error.error);
                  return false;
                }
                this.util.hide();
                this.util.error(this.util.translate('Wrong OTP'));
              });
            }
          });
        } else if (data && data.status && data.status == 500 && data.data == false) {
          this.util.error(this.util.translate('Something went wrong'));
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

  loginWithPhoneOTPVerified() {
    console.log('all ok');
    this.util.show();
    const param = {
      country_code: this.country_code,
      mobile: this.mobile,
    }
    this.api.post('v1/auth/loginWithMobileOtp', param).then((data: any) => {
      this.util.hide();
      console.log(data);
      if (data && data.status && data.status == 200 && data.user && data.user.type == 'store') {
        if (data && data.user && data.user.status && data.user.status == 1 && data.store && data.store.status == 1) {
          console.log('all ok');
          localStorage.setItem('uid', data.user.id);
          localStorage.setItem('sid', data.store.id);
          localStorage.setItem('token', data.token);
          this.util.storeInfo = data.store;
          this.router.navigate(['']);
        } else {
          this.util.error('Your account is suspended');
        }
      } else {
        this.util.error('Not valid user');
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
}
