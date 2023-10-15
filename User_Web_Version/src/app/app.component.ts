/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { UtilService } from './services/util.service';
import { ApiService } from './services/api.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterEvent, Event } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { ModalDirective } from 'angular-bootstrap-md';
import { login } from './interfaces/login';
import { mobile } from './interfaces/mobile';
import { mobileLogin } from './interfaces/mobileLogin';
import { NgForm } from '@angular/forms';
import * as firebase from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { register } from './interfaces/register';
import Swal from 'sweetalert2';
import { forgot } from './interfaces/forgot';
import { resetPasswordMobile } from './interfaces/reset_password_mobile';
import { password } from './interfaces/password';
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('topScrollAnchor') topScroll: ElementRef;
  @ViewChild('locationModal') public locationModal: ModalDirective;
  @ViewChild('loginModal') public loginModal: ModalDirective;
  @ViewChild('registerModal') public registerModal: ModalDirective;
  @ViewChild('sideMenu') public sideMenu: ModalDirective;
  @ViewChild('forgotPwd') public forgotPwd: ModalDirective;
  @ViewChild('firebaseOTP') public firebaseOTP: ModalDirective;
  @ViewChild('loginOTPModal') public loginOTPModal: ModalDirective;
  @ViewChild('registerOTPModal') public registerOTPModal: ModalDirective;
  @ViewChild('firebaseRegisterOTP') public firebaseRegisterOTP: ModalDirective;
  @ViewChild('resetPasswordOTPModal') public resetPasswordOTPModal: ModalDirective;
  @ViewChild('passwordResetModal') public passwordResetModal: ModalDirective;
  @ViewChild('firebaseResetOTP') public firebaseResetOTP: ModalDirective;

  deviceType = 'desktop';
  innerHeight: string;
  windowWidth: number;

  verticalNavType = 'expanded';
  verticalEffect = 'shrink';

  router$: Subscription;
  loaded: boolean;
  loading = true;

  autocomplete1: string;
  autocompleteItems1: any = [];
  GoogleAutocomplete: any;
  geocoder: any;

  languageClicked: boolean = false;

  // Login
  login: login = { email: '', password: '' };
  mobile: mobile = { country_code: '', mobile: '', password: '' };
  mobileLogin: mobileLogin = { country_code: '', mobile: '' };
  submitted: boolean = false;
  isLogin: boolean = false;
  loginOTPText: any = '';
  otpId: any = '';

  recaptchaVerifier: firebase.default.auth.RecaptchaVerifier;
  firebaseOTPText: any = '';

  // Register
  register: register = { email: '', password: '', mobile: '', first_name: '', last_name: '', country_code: '', fcm_token: 'NA', check: false, referral: '' };
  registerOTPText: any = '';

  // Forgot
  forgotEmail: forgot = { email: '' };
  forgotMobile: resetPasswordMobile = { country_code: '', mobile: '' };
  newPassword: password = {
    password: '',
    confirm: ''
  };
  forgotOTPText: any = '';
  tempToken: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private router: Router,
    private titleService: Title,
    private chmod: ChangeDetectorRef
  ) {
    const scrollHeight = window.screen.height - 150;
    this.innerHeight = scrollHeight + 'px';
    this.windowWidth = window.innerWidth;
    this.setMenuAttributs(this.windowWidth);

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      console.log('end--->');
      window.scrollTo(10, 10);
    });
    this.router.events.pipe(filter(event => event instanceof RouterEvent)).subscribe((event: any) => {
      this.navigationInterceptor(event);
    });

    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete1 = '';
    this.autocompleteItems1 = [];

    this.util.subscribeAddressPopup().subscribe(() => {
      this.locationModal.show();
    });

    this.util.subscribeModalPopup().subscribe((data) => {
      console.log('data', data);
      if (data && data == 'location') {
        this.locationModal.show();
      } else if (data && data == 'login') {
        this.loginModal.show();
      } else if (data && data == 'register') {
        this.registerModal.show();
      } else if (data && data == 'sideMenu') {
        this.sideMenu.show();
      }
    });

    this.util.onSubscribe().subscribe(() => {
      this.loginModal.show();
    })
    const defaultGeneralSettings = {
      "id": 1,
      "name": "Foodies",
      "mobile": "9898989898",
      "email": "support@initappz.com",
      "address": "Palitana",
      "city": "Palitana",
      "state": "Gujarat",
      "zip": "364270",
      "country": "India",
      "min": 1200,
      "free": 1000,
      "tax": 10,
      "shipping": "fixed",
      "shippingPrice": 10,
      "allowDistance": 50,
      "facebook": "#",
      "instagram": "#",
      "twitter": "#",
      "google_playstore": "#",
      "apple_appstore": "#",
      "web_footer": "Initappz",
      "status": 1,
      "extra_field": "",
      "updated_at": "2023-05-02T09:15:02.000000Z"
    };

    const defaultManageSettings = {
      "id": 1,
      "app_close": 1,
      "message": "Ruining",
      "date_time": "2023-05-02 14:12:18",
      "status": 1,
      "extra_field": "",
      "updated_at": "2023-05-02T08:42:07.000000Z"
    };

    const defaultPopupSettings = {
      "id": 1,
      "shown": 1,
      "message": "Best Offers",
      "date_time": "2023-05-02 14:17:07",
      "status": 1,
      "extra_field": "",
      "updated_at": "2023-05-02T08:47:23.000000Z"
    };

    const defaultAppSettings = {
      "id": 1,
      "currencySymbol": "$",
      "currencySide": "left",
      "appDirection": "ltr",
      "logo": "IPL14ISHSCOMPTgkP1C4bDY8sJ5v3aGkTeBm36lo.png",
      "sms_name": "0",
      "delivery": 0,
      "home_ui": 0,
      "reset_pwd": 0,
      "user_login": 0,
      "store_login": 0,
      "driver_login": 0,
      "web_login": 0,
      "driver_assignments": 0,
      "status": 1,
      "extra_field": "",
      "updated_at": "2023-05-02T10:06:43.000000Z",
      "country_modal": "",
      "default_country_code": "91",
      "allowDistance": 120,
      "user_verify_with": 0,
      "search_radius": 0,
      "searchResultKind": 0
    }

    this.util.generalSettings = defaultGeneralSettings;
    this.util.manageAppSettings = defaultManageSettings;
    this.util.popupMessage = defaultPopupSettings;
    this.util.appSettings = defaultAppSettings;

    this.api.get_public('v1/settings/appSettingsDefault?id=' + localStorage.getItem('selectedLanguage')).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200) {
        const general = data && data.general ? data.general : null;
        const manage = data && data.manage ? data.manage : null;
        const popup = data && data.popup ? data.popup : null;
        const settings = data && data.settings ? data.settings : null;
        const languages = data && data.languages ? data.languages : null;
        const translation = data && data.translation ? data.translation : null;
        if (general) {
          this.util.generalSettings = general;
          console.log('general', this.util.generalSettings);
        }

        if (manage) {
          this.util.manageAppSettings = manage;
          console.log('manage', this.util.manageAppSettings);
        }

        if (popup) {
          this.util.popupMessage = popup;
          console.log('popup', this.util.popupMessage);
        }

        if (settings) {
          this.util.appSettings = settings;
          console.log('settings', this.util.appSettings);
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(settings.country_modal)) {
            this.util.countries = JSON.parse(settings.country_modal);
          }

          this.mobile.country_code = this.util.appSettings.default_country_code;
          this.mobileLogin.country_code = this.util.appSettings.default_country_code;
          this.register.country_code = this.util.appSettings.default_country_code;
          this.forgotMobile.country_code = this.util.appSettings.default_country_code;
        }

        if (languages) {
          this.util.languages = languages;
          console.log('languages', this.util.languages);
        }

        if (translation) {
          console.log('translation', translation);
          const lang = translation && translation.file && translation.file != null && translation.file != 'null' && translation.file != '' ? translation.file : null;
          if (lang && lang !== null) {
            if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(translation.file)) {
              this.util.translations = JSON.parse(translation.file);
              localStorage.setItem('selectedLanguage', translation.id);
              const direction = translation.positions == 0 ? 'ltr' : 'rtl';
              localStorage.setItem('direction', direction);
              document.documentElement.dir = direction;
            }
          }
        }
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });

    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      this.api.post_private('v1/users/getMyInfo', { id: uid }).then((data: any) => {
        console.log('user info', data);
        if (data && data.status && data.status == 200 && data.data && data.data.id) {
          this.util.userInfo = data.data;
        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  setMenuAttributs(windowWidth: any) {
    console.log(windowWidth);
    if (windowWidth >= 768 && windowWidth <= 1024) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'push';
    } else if (windowWidth < 768) {
      this.deviceType = 'mobile';
      this.verticalNavType = 'offcanvas';
      this.verticalEffect = 'overlay';
    } else {
      this.deviceType = 'desktop';
      this.verticalNavType = 'expanded';
      this.verticalEffect = 'shrink';
    }
    this.util.deviceType = this.deviceType;
    console.log('type', this.util.deviceType);
  }

  onResize(event: any) {
    this.innerHeight = event.target.innerHeight + 'px';
    this.windowWidth = window.innerWidth;
    let reSizeFlag = true;
    if (this.deviceType == 'tablet' && this.windowWidth >= 768 && this.windowWidth <= 1024) {
      reSizeFlag = false;
    } else if (this.deviceType == 'mobile' && this.windowWidth < 768) {
      reSizeFlag = false;
    }
    this.util.deviceType = this.deviceType;
    if (reSizeFlag) {
      this.setMenuAttributs(this.windowWidth);
    }
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      console.log('start-----><>');
      this.loading = true;
      this.util.start();
      this.loaded = false;
    }
    if (event instanceof NavigationEnd) {
      console.log('endedd--->>>>')
      this.loading = false;
      this.util.stop();
      this.loaded = true;
      window.scrollTo(0, 0);
      const data = this.getTitle(this.router.routerState, this.router.routerState.root);
      this.titleService.setTitle(data && data[0] ? this.util.translate(data[0]) + ' | ' + this.util.generalSettings.name :
        this.util.translate('Home') + ' | ' + this.util.generalSettings.name);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading = false;
      this.util.stop();
      this.loaded = true;
    }
    if (event instanceof NavigationError) {
      this.loading = false;
      this.util.stop();
      this.loaded = true;
    }
  }

  ngOnInit() {
    this.router$ = this.router.events.subscribe(next => this.onRouteUpdated(next));
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

  private smoothScrollTop(): void {
    this.topScroll.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  private onRouteUpdated(event: any): void {
    if (event instanceof NavigationEnd) {
      this.smoothScrollTop();
    }
  }

  getTitle(state: any, parent: any): any {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(... this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  onSearchChange(event: any) {
    console.log(event);
    if (this.autocomplete1 == '') {
      this.autocompleteItems1 = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete1 }, (predictions: any, status: any) => {
      console.log(predictions);
      if (predictions && predictions.length > 0) {
        this.autocompleteItems1 = predictions;
        console.log(this.autocompleteItems1);
      }
    });
  }

  selectSearchResult1(item: any) {
    console.log('select', item);
    localStorage.setItem('addsSelected', 'true');
    this.autocompleteItems1 = [];
    this.autocomplete1 = item.description;
    this.geocoder.geocode({ placeId: item.place_id }, (results: any, status: any) => {
      if (status == 'OK' && results[0]) {
        console.log(status);
        localStorage.setItem('location', 'true');
        localStorage.setItem('lat', results[0].geometry.location.lat());
        localStorage.setItem('lng', results[0].geometry.location.lng());
        localStorage.setItem('address', this.autocomplete1);
        this.locationModal.hide();
        this.chmod.detectChanges();
        this.util.publishNewAddress();
        this.router.navigate(['']);
      }
    });
  }

  locate(modal: any) {
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position);
          // modal.hide();
          this.locationModal.hide();
          this.getAddressOf(position.coords.latitude, position.coords.longitude);
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              this.util.errorToast(this.util.translate('Location Permission Denied'));
              break;
            case 2:
              console.log('Position Unavailable');
              this.util.errorToast(this.util.translate('Position Unavailable'));
              break;
            case 3:
              console.log('Timeout');
              this.util.errorToast(this.util.translate('Failed to fetch location'));
              break;
          }
        }
      );
    };
  }

  getAddressOf(lat: any, lng: any) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results: any, status: any) => {
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        localStorage.setItem('location', 'true');
        localStorage.setItem('lat', lat);
        localStorage.setItem('address', results[0].formatted_address);
        localStorage.setItem('lng', lng);
        this.util.publishNewAddress();
        this.router.navigate(['restaurants']);
      }
    });
  }

  onPage(item: any) {
    console.log(item);
    this.sideMenu.hide();
    this.router.navigate([item]);
  }

  onProfile(item: any) {
    this.sideMenu.hide();
    if (this.util && this.util.userInfo && this.util.userInfo.first_name) {
      const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
      this.router.navigate(['user', name, item]);
    } else {
      this.loginModal.show();
    }
  }

  haveSigned() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    return false;
  }

  logout() {
    this.util.start();
    this.api.post_private('v1/auth/user_logout', {}).then((data: any) => {
      console.log(data);
      this.util.stop();
      this.sideMenu.hide();
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.chmod.detectChanges();
      this.router.navigate(['']);
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  changeLanguage(value: any) {
    console.log(value);
    const direction = value.positions == 0 ? 'ltr' : 'rtl';
    localStorage.setItem('selectedLanguage', value.id);
    localStorage.setItem('direction', direction);
    window.location.reload();
    // const item = this.util.languages.filter(x => x.file == value.file);
    // if (item && item.length > 0) {
    //   localStorage.setItem('language', value.file);
    //   window.location.reload();
    // }
  }

  loginWithEmailPassword(form: NgForm, modal: any) {
    console.log('form', form, this.login);
    this.submitted = true;
    if (form.valid && this.login.email && this.login.password) {
      console.log('valid');
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.login.email)) {
        this.util.errorToast(this.util.translate('Please enter valid email'));
        return false;
      }
      console.log('login');

      this.isLogin = true;
      this.api.post_public('v1/auth/login', this.login).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status && data.status == 200 && data.user && data.user.type == 'user') {
          if (data && data.user && data.user.status && data.user.status == 1) {
            console.log('all ok');
            localStorage.setItem('uid', data.user.id);
            localStorage.setItem('token', data.token);
            this.getUserInfo();
            this.loginModal.hide();
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
    } else {
      console.log('not valid');
    }
  }

  getUserInfo() {
    const uid = localStorage.getItem('uid');
    if (uid && uid !== null && uid !== 'null') {
      this.api.post_private('v1/users/getMyInfo', { id: uid }).then((data: any) => {
        console.log('user info', data);
        if (data && data.status && data.status == 200 && data.data && data.data.id) {
          this.util.userInfo = data.data;
        }
      }, error => {
        console.log(error);
        this.util.apiErrorHandler(error);
      }).catch((error: any) => {
        console.log(error);
        this.util.apiErrorHandler(error);
      });
    }
  }

  loginWithMobileAndPassword(form: NgForm, modal: any) {
    console.log('form', form, this.mobile);
    this.submitted = true;
    if (form.valid && this.mobile.country_code && this.mobile.mobile && this.mobile.password) {
      console.log('valid');
      console.log(typeof this.mobile.country_code)
      const cc: string = (this.mobile.country_code).toString();
      if (!cc.includes('+')) {
        this.mobile.country_code = '+' + this.mobile.country_code
      };
      this.isLogin = true;
      this.api.post_public('v1/auth/loginWithPhonePassword', this.mobile).then((data: any) => {
        console.log(data);
        this.isLogin = false;
        if (data && data.status && data.status == 200 && data.user && data.user.type == 'user') {
          if (data && data.user && data.user.status && data.user.status == 1) {
            console.log('all ok');
            localStorage.setItem('uid', data.user.id);
            localStorage.setItem('token', data.token);
            this.getUserInfo();
            this.loginModal.hide();
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
    } else {
      console.log('not valid');
    }
  }

  loginWithMobileAndOTP(form: NgForm, modal: any) {
    console.log('form', form, this.mobileLogin);
    this.submitted = true;
    if (form.valid && this.mobileLogin.country_code && this.mobileLogin.mobile) {
      console.log('valid');
      const cc: string = (this.mobileLogin.country_code).toString();
      if (!cc.includes('+')) {
        this.mobileLogin.country_code = '+' + this.mobileLogin.country_code
      };

      if (this.util.appSettings.sms_name == '2') {
        console.log('send OTP with firebase');
        this.isLogin = true;
        this.api.post_public('v1/auth/verifyPhoneForFirebase', this.mobileLogin).then((data: any) => {
          console.log(data);
          this.isLogin = false;
          if (data && data.status && data.status == 200 && data.data) {
            console.log('open firebase web version');
            this.api.signInWithPhoneNumber(this.recaptchaVerifier, this.mobileLogin.country_code + this.mobileLogin.mobile).then(
              success => {
                this.isLogin = false;
                this.firebaseOTP.show();
              }
            ).catch(error => {
              this.isLogin = false;
              console.log(error);
              this.util.errorToast(error);
            });
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
        this.api.post_public('v1/otp/verifyPhone', this.mobileLogin).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
            this.otpId = data.otp_id;
            this.loginOTPModal.show();
            // this.openVerificationModal(data.otp_id, this.mobileLogin.country_code + this.mobileLogin.mobile);
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
    } else {
      console.log('not valid');
    }
  }

  onOtpChangeFirebase(event: any) {
    console.log(event);
    this.firebaseOTPText = event;
  }

  onLoginOTPChange(event: any) {
    console.log(event);
    this.loginOTPText = event;
  }

  onResetOTPText(event: any) {
    console.log(event);
    this.forgotOTPText = event;
  }

  onRegisterOTPChange(event: any) {
    console.log(event);
    this.registerOTPText = event;
  }

  onOTPSubmit() {
    if (this.loginOTPText == '' || !this.loginOTPText) {
      this.util.errorToast(this.util.translate('Please enter OTP'));
      return false;
    }
    this.submitted = false;
    this.isLogin = true;
    const param = {
      id: this.otpId,
      otp: this.loginOTPText
    };
    this.api.post_public('v1/otp/verifyOTP', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status == 200 && data.data) {
        this.loginOTPModal.hide();
        this.loginWithPhoneOTPVerified();
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    });
  }

  onRegisterOTPSubmit() {
    if (this.registerOTPText == '' || !this.registerOTPText) {
      this.util.errorToast(this.util.translate('Please enter OTP'));
      return false;
    }
    this.submitted = false;
    this.isLogin = true;
    const param = {
      id: this.otpId,
      otp: this.registerOTPText
    };
    this.api.post_public('v1/otp/verifyOTP', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status == 200 && data.data) {
        this.registerOTPModal.hide();
        this.createAccount();
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    });
  }

  onVerifyOTPFirebase() {
    if (this.firebaseOTPText == '' || !this.firebaseOTPText || this.firebaseOTPText == null) {
      this.util.errorToast('OTP Missing');
      return false;
    }
    this.util.start();
    this.api.enterVerificationCode(this.firebaseOTPText).then(
      userData => {
        this.util.stop();

        this.loginWithPhoneOTPVerified();
        console.log(userData);
      }
    ).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  onVerifyOTPFirebaseRegister() {
    if (this.firebaseOTPText == '' || !this.firebaseOTPText || this.firebaseOTPText == null) {
      this.util.errorToast('OTP Missing');
      return false;
    }
    this.util.start();
    this.api.enterVerificationCode(this.firebaseOTPText).then(
      userData => {
        this.util.stop();
        this.firebaseRegisterOTP.hide();
        this.createAccount();
        console.log(userData);
      }
    ).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  loginWithPhoneOTPVerified() {
    console.log('all ok');
    this.util.start();
    this.api.post_public('v1/auth/loginWithMobileOtp', this.mobileLogin).then((data: any) => {
      this.util.stop();
      console.log(data);
      if (data && data.status && data.status == 200 && data.user && data.user.type == 'user') {
        if (data && data.user && data.user.status && data.user.status == 1) {
          console.log('all ok');
          localStorage.setItem('uid', data.user.id);
          localStorage.setItem('token', data.token);
          this.getUserInfo();
          this.loginModal.hide();
          this.firebaseOTP.hide();
        } else {
          this.util.errorToast('Your account is suspended');
        }
      } else {
        this.util.errorToast('Not valid user');
      }
    }, error => {
      this.util.stop();
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      this.util.stop();
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  openLink(type: any) {
    if (type == 'eula') {
      window.open('https://initappz.com/foodiesaagya/eula.html');
    } else {
      window.open('https://initappz.com/foodiesaagya/privacy.html');
    }
  }

  onRegister(form: NgForm) {
    console.log(form);

    console.log('form', this.register);
    this.submitted = true;
    console.log(this.register.check);
    if (form.valid && this.register.check && this.register.email && this.register.password && this.register.first_name
      && this.register.last_name && this.register.mobile && this.register.country_code) {
      console.log('valid data');
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.register.email)) {
        this.util.errorToast(this.util.translate('Please enter valid email'));
        return false;
      }
      const cc: string = (this.register.country_code).toString();
      if (!cc.includes('+')) {
        this.register.country_code = '+' + this.register.country_code
      };
      if (this.util.appSettings.user_verify_with == 0) {
        console.log('email verification');
        const param = {
          'email': this.register.email,
          'subject': this.util.translate('Verification'),
          'header_text': this.util.translate('Use this code for verification'),
          'thank_you_text': this.util.translate("Don't share this otp to anybody else"),
          'mediaURL': this.api.mediaURL,
          'country_code': this.register.country_code,
          'mobile': this.register.mobile
        };
        this.isLogin = true;
        this.api.post_public('v1/sendVerificationOnMail', param).then((data: any) => {
          console.log(data);
          this.isLogin = false;
          if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
            this.registerModal.hide();
            this.otpId = data.otp_id;
            this.registerOTPModal.show();
          } else if (data && data.status && data.status == 500 && data.data == false) {
            this.util.errorToast(data.message, 'dark');
          }
        }, error => {
          console.log(error);
          this.isLogin = false;
          if (error && error.error && error.error.status == 500 && error.error.message) {
            this.util.errorToast(error.error.message, 'dark');
          } else if (error && error.error && error.error.error && error.error.status == 422) {
            for (let key in error.error.error) {
              console.log(error.error.error[key][0]);
              this.util.errorToast(error.error.error[key][0], 'dark');
            }
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'), 'dark');
          }
        }).catch(error => {
          console.log(error);
          this.isLogin = false;
          if (error && error.error && error.error.status == 500 && error.error.message) {
            this.util.errorToast(error.error.message, 'dark');
          } else if (error && error.error && error.error.error && error.error.status == 422) {
            for (let key in error.error.error) {
              console.log(error.error.error[key][0]);
              this.util.errorToast(error.error.error[key][0], 'dark');
            }
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'), 'dark');
          }
        });
      } else {
        console.log('phone verification');
        if (this.util.appSettings.sms_name == '2') {
          console.log('firebase verification');
          this.isLogin = true;
          this.api.post_public('v1/users/verifyPhoneForFirebaseRegistrations', { email: this.register.email, country_code: this.register.country_code, mobile: this.register.mobile }).then((data: any) => {
            console.log(data);
            this.isLogin = false;
            if (data && data.status && data.status == 200 && data.data == true) {
              console.log('open firebase web version');
              this.api.signInWithPhoneNumber(this.recaptchaVerifier, this.register.country_code + this.register.mobile).then(
                success => {
                  this.isLogin = false;
                  this.registerModal.hide();
                  this.firebaseRegisterOTP.show();
                }
              ).catch(error => {
                this.isLogin = false;
                console.log(error);
                this.util.errorToast(error);
              });
            } else if (data && data.status && data.status == 500 && data.data == false) {
              this.util.errorToast(data.message);
            }
          }, error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0]);
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'));
            }
          }).catch(error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message);
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0]);
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'));
            }
          });
        } else {
          console.log('other otp');
          const param = {
            'country_code': this.register.country_code,
            'mobile': this.register.mobile,
            'email': this.register.email
          };
          this.isLogin = true;
          this.api.post_public('v1/users/verifyPhoneSignup', param).then((data: any) => {
            console.log(data);
            this.isLogin = false;
            if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
              this.registerModal.hide();
              this.otpId = data.otp_id;
              this.registerOTPModal.show();
            } else if (data && data.status && data.status == 500 && data.data == false) {
              this.util.errorToast(data.message, 'dark');
            }
          }, error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message, 'dark');
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0], 'dark');
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'), 'dark');
            }
          }).catch(error => {
            console.log(error);
            this.isLogin = false;
            if (error && error.error && error.error.status == 500 && error.error.message) {
              this.util.errorToast(error.error.message, 'dark');
            } else if (error && error.error && error.error.error && error.error.status == 422) {
              for (let key in error.error.error) {
                console.log(error.error.error[key][0]);
                this.util.errorToast(error.error.error[key][0], 'dark');
              }
            } else {
              this.util.errorToast(this.util.translate('Something went wrong'), 'dark');
            }
          });
        }
      }
    } else {
      console.log('not valid data...');
    }
  }

  createAccount() {
    this.isLogin = true;
    // no account found create it
    this.api.post_public('v1/users/create_user_account', this.register).then((data: any) => {
      this.isLogin = false;
      console.log(data);

      if (data && data.status == 200) {
        localStorage.setItem('uid', data.user.id);
        localStorage.setItem('token', data.token);
        this.getUserInfo();
        if (this.register.referral != '' && this.register.referral) {
          this.redeemCode();
        }
        this.registerModal.hide();
        // this.util.navigateRoot('tabs');
      } else if (data && data.error && data.error.msg) {
        this.util.errorToast(data.error.msg);
      } else if (data && data.error && data.error.message == 'Validation Error.') {
        for (let key in data.error[0]) {
          console.log(data.error[0][key][0]);
          this.util.errorToast(data.error[0][key][0]);
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.isLogin = false;
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.errorToast(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.errorToast(error.error.error[key][0]);
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }).catch(error => {
      console.log(error);
      this.isLogin = false;
      if (error && error.error && error.error.status == 500 && error.error.message) {
        this.util.errorToast(error.error.message);
      } else if (error && error.error && error.error.error && error.error.status == 422) {
        for (let key in error.error.error) {
          console.log(error.error.error[key][0]);
          this.util.errorToast(error.error.error[key][0]);
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    });
  }

  redeemCode() {
    this.api.post_private('v1/referral/redeemReferral', { id: localStorage.getItem('uid'), code: this.register.referral }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        // 1 = inviter
        // 2 = redeemer
        // 3 = both
        let text = '';
        if (data && data.data && data.data.who_received == 1) {
          text = this.util.translate('Congratulations your friend have received the') + ' ' + this.util.appSettings.currencySymbol + ' ' + data.data.amount + ' ' + this.util.translate('on wallet');
        } else if (data && data.data && data.data.who_received == 2) {
          text = this.util.translate('Congratulations you have received the') + ' ' + this.util.appSettings.currencySymbol + ' ' + ' ' + this.util.translate('on wallet');
        } else if (data && data.data && data.data.who_received == 3) {
          text = this.util.translate('Congratulations you & your friend have received the') + ' ' + this.util.appSettings.currencySymbol + ' ' + this.util.translate('on wallet');
        }
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: text,
          showConfirmButton: false,
          timer: 1500
        })
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  onResetPasswordEmail(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    if (form.valid && this.forgotEmail && this.forgotEmail.email) {
      const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailfilter.test(this.forgotEmail.email)) {
        this.util.errorToast(this.util.translate('Please enter valid email'));
        return false;
      }
      console.log('login');
      this.isLogin = true;

      this.api.post_public('v1/auth/verifyEmailForReset', this.forgotEmail).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          this.otpId = data.otp_id;
          this.forgotPwd.hide();
          this.resetPasswordOTPModal.show();
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

  onResetWithMobile() {
    if (this.forgotOTPText == '' || !this.forgotOTPText) {
      this.util.errorToast(this.util.translate('Please enter OTP'));
      return false;
    }
    this.submitted = false;
    this.isLogin = true;
    const param = {
      id: this.otpId,
      otp: this.forgotOTPText,
      type: this.util.appSettings.reset_pwd == 0 ? 'email' : 'phone',
      email: this.forgotEmail.email,
      country_code: this.forgotMobile.country_code,
      mobile: this.forgotMobile.mobile
    };
    this.api.post_public('v1/otp/verifyOTPWithMobileReset', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status == 200 && data.data) {
        this.resetPasswordOTPModal.hide();
        this.tempToken = data.temp;
        this.passwordResetModal.show();
        console.log(this.tempToken);
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    });
  }

  onResetWithEmailOTP() {
    if (this.forgotOTPText == '' || !this.forgotOTPText) {
      this.util.errorToast(this.util.translate('Please enter OTP'));
      return false;
    }
    this.submitted = false;
    this.isLogin = true;
    const param = {
      id: this.otpId,
      otp: this.forgotOTPText,
      type: this.util.appSettings.reset_pwd == 0 ? 'email' : 'phone',
      email: this.forgotEmail.email,
    };
    this.api.post_public('v1/otp/verifyOTPReset', param).then((data: any) => {
      console.log(data);
      this.isLogin = false;
      if (data && data.status && data.status == 200 && data.data) {
        this.resetPasswordOTPModal.hide();
        this.tempToken = data.temp;
        this.passwordResetModal.show();
        console.log(this.tempToken);
      }
    }, error => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    }).catch((error) => {
      this.isLogin = false;
      console.log(error);
      if (error && error.status == 401 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      if (error && error.status == 500 && error.error.error) {
        this.util.errorToast(error.error.error);
        return false;
      }
      this.isLogin = false;
      this.util.errorToast(this.util.translate('Wrong OTP'));
    });
  }

  resetPasswordWithEmail(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    if (form.valid && this.newPassword.password && this.newPassword.confirm) {
      if (this.newPassword.password != this.newPassword.confirm) {
        this.util.errorToast(this.util.translate('Password does not match'), 'danger');
        return false;
      }

      this.isLogin = true;

      const param = {
        id: this.otpId,
        email: this.forgotEmail.email,
        password: this.newPassword.password
      };
      this.api.post_temp('v1/password/updateUserPasswordWithEmail', param, this.tempToken).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          // this.util.showToast('Password Updated', 'success', 'bottom');
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: this.util.translate('Password Updated'),
            showConfirmButton: false,
            timer: 1500
          })
          this.passwordResetModal.hide();
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

  resetPasswordWithPhone(form: NgForm) {
    console.log(form);
    this.submitted = true;
    if (form.valid && this.forgotMobile.country_code && this.forgotMobile.mobile) {
      console.log('valid');
      const cc: string = (this.forgotMobile.country_code).toString();
      if (!cc.includes('+')) {
        this.forgotMobile.country_code = '+' + this.forgotMobile.country_code
      };

      if (this.util.appSettings.sms_name == '2') {
        console.log('send OTP with firebase');
        this.isLogin = true;
        this.api.post_public('v1/auth/verifyPhoneForFirebase', this.forgotMobile).then((data: any) => {
          console.log(data);
          this.isLogin = false;
          if (data && data.status && data.status == 200 && data.data) {
            console.log('open firebase web version');
            this.api.signInWithPhoneNumber(this.recaptchaVerifier, this.forgotMobile.country_code + this.forgotMobile.mobile).then(
              success => {
                this.isLogin = false;
                this.forgotPwd.hide();
                this.firebaseResetOTP.show();
              }
            ).catch(error => {
              this.isLogin = false;
              console.log(error);
              this.util.errorToast(error);
            });
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
        this.api.post_public('v1/otp/verifyPhone', this.forgotMobile).then((data: any) => {
          this.isLogin = false;
          console.log(data);
          if (data && data.status && data.status == 200 && data.data == true && data.otp_id) {
            this.otpId = data.otp_id;
            this.forgotPwd.hide();
            this.resetPasswordOTPModal.show();
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
    } else {
      console.log('not valid');
    }
  }

  onVerifyOTPFirebaseReset() {
    if (this.firebaseOTPText == '' || !this.firebaseOTPText || this.firebaseOTPText == null) {
      this.util.errorToast('OTP Missing');
      return false;
    }
    this.util.start();
    this.api.enterVerificationCode(this.firebaseOTPText).then(
      userData => {
        this.util.stop();
        this.generateFirebaseToken();
        console.log(userData);
      }
    ).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  generateFirebaseToken() {
    this.isLogin = true;
    const param = {
      country_code: this.forgotMobile.country_code,
      mobile: this.forgotMobile.mobile
    };
    this.api.post_temp('v1/otp/getFirebaseToken', param, this.tempToken).then((data: any) => {
      this.isLogin = false;
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.submitted = false;
        this.tempToken = data.temp;
        console.log('temp token', this.tempToken);
        this.firebaseResetOTP.hide();
        this.passwordResetModal.show();
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

  resetPasswordPhoneFirebase(form: NgForm) {
    console.log('form', form);
    this.submitted = true;
    if (form.valid) {
      if (this.newPassword.password != this.newPassword.confirm) {
        this.util.errorToast(this.util.translate('Password does not match'), 'danger');
        return false;
      }

      this.isLogin = true;

      const param = {
        country_code: this.forgotMobile.country_code,
        mobile: this.forgotMobile.mobile,
        otp_content: this.forgotMobile.country_code + this.forgotMobile.mobile,
        password: this.newPassword.password
      };
      this.api.post_temp('v1/password/updateUserPasswordWithPhoneFirebase', param, this.tempToken).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: this.util.translate('Password Updated'),
            showConfirmButton: false,
            timer: 1500
          })
          this.passwordResetModal.hide();
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
    if (form.valid) {
      if (this.newPassword.password != this.newPassword.confirm) {
        this.util.errorToast(this.util.translate('Password does not match'), 'danger');
        return false;
      }

      this.isLogin = true;

      const param = {
        id: this.otpId,
        country_code: this.forgotMobile.country_code,
        mobile: this.forgotMobile.mobile,
        otp_content: this.forgotMobile.country_code + this.forgotMobile.mobile,
        password: this.newPassword.password
      };
      this.api.post_temp('v1/password/updateUserPasswordWithPhone', param, this.tempToken).then((data: any) => {
        this.isLogin = false;
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: this.util.translate('Password Updated'),
            showConfirmButton: false,
            timer: 1500
          })
          this.passwordResetModal.hide();
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
}
