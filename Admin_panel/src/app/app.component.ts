/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { brandSet, flagSet, freeSet } from '@coreui/icons';
import { Title } from '@angular/platform-browser';
import { ApiService } from './services/api.service';
import { UtilService } from './services/util.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  title = 'Foodies.IO Administrator';

  constructor(
    private router: Router,
    private titleService: Title,
    private iconSetService: IconSetService,
    private api: ApiService,
    public util: UtilService,
  ) {
    titleService.setTitle(this.title);
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
    // iconSet singleton
    iconSetService.icons = { ...brandSet, ...flagSet, ...freeSet };
    this.api.get_public('v1/settings/appSettingsDefault?id=' + localStorage.getItem('selectedLanguage')).then((data: any) => {
      console.log('by default', data);
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
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
    this.api.getLocalAssets('cuisines.json').then((data: any) => {
      this.util.cuisine = data;
    }).catch(error => {
      console.log(error);
    });

    this.api.getLocalAssets('country.json').then((data: any) => {
      this.util.countrys = data;
    }).catch(error => {
      console.log(error);
    });

  }

  ngOnInit(): void {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
