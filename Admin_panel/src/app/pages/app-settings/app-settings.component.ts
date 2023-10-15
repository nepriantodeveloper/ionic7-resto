/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent implements OnInit {
  @ViewChild('largeModal') public largeModal: ModalDirective;
  id: any = '';
  currencySymbol: any = '';
  currencySide: any = 'left';
  appDirection: any = 'ltr';
  logo: any = '';
  sms_creds: any = '';
  sms_name: any = '2';

  twilloCreds = {
    sid: '',
    token: '',
    from: ''
  };

  msgCreds = {
    key: '',
    sender: ''
  }

  delivery: any = 0;
  home_ui: any = 0;
  reset_pwd: any = 0;
  user_login: any = 0;
  store_login: any = 0;
  driver_login: any = 0;
  web_login: any = 0;
  fcm_token: any = '';

  searchResultKind: any = 0;
  allowDistance: any = 0;
  search_radius: any = 50;
  user_verify_with: any = 0;
  /// countries
  default_country_code: any = '';
  country_modal: any[] = [];
  countries: any[] = [];
  dummy: any[] = [];
  dummyLoad: any[] = [];
  selected: any[] = [];
  /// countries
  driver_assignments: any = 0;
  haveData: boolean = false;
  submited: boolean = false;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.getDefault();
  }

  ngOnInit(): void {
  }


  getDefault() {
    this.util.show();
    this.api.get_private('v1/settings/getDefault').then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.haveData = true
        this.id = data.data.id;
        const info = data.data;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.sms_creds)) {
          const creds = JSON.parse(info.sms_creds);
          this.twilloCreds = creds.twilloCreds;
          this.msgCreds = creds.msg;
        }
        this.sms_name = info.sms_name;
        this.searchResultKind = info.searchResultKind;
        this.allowDistance = info.allowDistance;
        this.search_radius = info.search_radius;
        this.user_verify_with = info.user_verify_with;
        this.appDirection = info.appDirection;
        this.currencySide = info.currencySide;
        this.currencySymbol = info.currencySymbol;
        this.delivery = info.delivery;
        this.driver_assignments = info.driver_assignments;
        this.driver_login = info.driver_login;
        this.fcm_token = info.fcm_token;
        this.home_ui = info.home_ui;
        this.logo = info.logo;
        this.reset_pwd = info.reset_pwd;
        this.store_login = info.store_login;
        this.user_login = info.user_login;
        this.web_login = info.web_login;
        this.default_country_code = info.default_country_code;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.country_modal)) {
          this.country_modal = JSON.parse(info.country_modal);
        }
      } else {
        this.haveData = false;
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

  saveSettings() {
    this.submited = true;
    console.log('----------');
    console.log(this.currencySymbol);
    console.log(this.currencySide);
    console.log(this.appDirection);
    console.log(this.logo);
    console.log(this.sms_name);
    console.log(this.delivery);
    console.log(this.home_ui);
    console.log(this.reset_pwd);
    console.log(this.user_login);
    console.log(this.store_login);
    console.log(this.driver_login);
    console.log(this.web_login);
    console.log(this.driver_assignments);
    console.log(this.fcm_token);
    console.log('----------');
    console.log(this.haveData);
    if (this.currencySymbol == null || this.currencySymbol == '' || this.logo == null || this.logo == '' || this.allowDistance == '' || this.allowDistance == null || this.allowDistance == 0 ||
      this.fcm_token == null || this.fcm_token == '' || this.default_country_code == '' || this.default_country_code == null || this.search_radius == null || this.search_radius == '') {
      this.util.error('All Fields are required');
      return false;
    }

    if (this.sms_name == '0') {
      if (this.twilloCreds.sid == '' || !this.twilloCreds.sid || this.twilloCreds.token == '' || !this.twilloCreds.token || this.twilloCreds.from == '' || !this.twilloCreds.from) {
        this.util.error(this.util.translate('Twilio credentials missings'));
        return false;
      }
    }

    if (this.sms_name == '1') {
      if (this.msgCreds.key == '' || !this.msgCreds.key || this.msgCreds.sender == '' || !this.msgCreds.sender) {
        this.util.error(this.util.translate('Msg91 credentials missings'));
        return false;
      }
    }
    console.log(typeof this.default_country_code)
    const cc: string = (this.default_country_code).toString();
    if (!cc.includes('+')) {
      this.default_country_code = this.default_country_code
    };
    if (this.haveData == false) {
      console.log('create');
      const creds = {
        twilloCreds: this.twilloCreds,
        msg: this.msgCreds,
      };
      const param = {
        sms_creds: JSON.stringify(creds),
        sms_name: this.sms_name,
        currencySymbol: this.currencySymbol,
        currencySide: this.currencySide,
        appDirection: this.appDirection,
        logo: this.logo,
        delivery: this.delivery,
        home_ui: this.home_ui,
        reset_pwd: this.reset_pwd,
        user_login: this.user_login,
        store_login: this.store_login,
        driver_login: this.driver_login,
        web_login: this.web_login,
        driver_assignments: this.driver_assignments,
        fcm_token: this.fcm_token,
        country_modal: JSON.stringify(this.country_modal),
        default_country_code: this.default_country_code,
        user_verify_with: this.user_verify_with,
        search_radius: this.search_radius,
        allowDistance: this.allowDistance,
        searchResultKind: this.searchResultKind,
      };
      this.util.show();
      this.api.post_private('v1/settings/save', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        this.getDefault();
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
      console.log('update');
      const creds = {
        twilloCreds: this.twilloCreds,
        msg: this.msgCreds,
      };
      const param = {
        "id": this.id,
        sms_creds: JSON.stringify(creds),
        sms_name: this.sms_name,
        currencySymbol: this.currencySymbol,
        currencySide: this.currencySide,
        appDirection: this.appDirection,
        logo: this.logo,
        delivery: this.delivery,
        home_ui: this.home_ui,
        reset_pwd: this.reset_pwd,
        user_login: this.user_login,
        store_login: this.store_login,
        driver_login: this.driver_login,
        web_login: this.web_login,
        driver_assignments: this.driver_assignments,
        fcm_token: this.fcm_token,
        country_modal: JSON.stringify(this.country_modal),
        default_country_code: this.default_country_code,
        user_verify_with: this.user_verify_with,
        search_radius: this.search_radius,
        allowDistance: this.allowDistance,
        searchResultKind: this.searchResultKind,
      };
      this.util.show();
      this.api.post_private('v1/settings/update', param).then((data: any) => {
        console.log(data);
        this.util.hide();
        this.getDefault();
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

  preview_banner(files: any) {
    console.log('fle', files);
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        if (data && data.data.image_name) {
          this.logo = data.data.image_name;
        }
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.apiErrorHandler(error);
      });
    } else {
      console.log('no');
    }
  }

  openCountryModel() {
    console.log('open moda');
    this.dummyLoad = Array(10);
    setTimeout(() => {
      this.dummyLoad = [];
      this.dummy = this.util.countrys;
      this.countries = this.dummy;
      this.util.countrys.forEach(element => {
        const exist = this.country_modal.filter(x => x.country_code == element.country_code);
        element.isChecked = exist && exist.length ? true : false;
      })
      console.log(this.dummy);
    }, 500);
    this.largeModal.show();
  }

  onSearchChange(events: any) {
    console.log(events);
    if (events !== '') {
      this.countries = this.dummy.filter((item) => {
        return item.country_name.toLowerCase().indexOf(events.toLowerCase()) > -1;
      });
    } else {
      this.countries = [];
    }
  }

  changed() {
    this.selected = this.util.countrys.filter(x => x.isChecked == true);
    console.log(this.selected);
  }

  saveCountries() {
    this.country_modal = this.selected;
    this.largeModal.hide();
  }
}
