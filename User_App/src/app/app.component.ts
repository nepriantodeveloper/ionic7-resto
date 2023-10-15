/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component } from '@angular/core';
import { UtilService } from './services/util.service';
import { ApiService } from './services/api.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  selectedIndex: any;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private alertController: AlertController
  ) {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (isPushNotificationsAvailable) {
      const addListeners = async () => {
        await PushNotifications.addListener('registration', token => {
          console.info('Registration token: ', token.value);
          localStorage.setItem('pushToken', token.value);
          const uid = localStorage.getItem('uid');
          if (uid != null && uid && uid != '' && uid != 'null') {
            this.updateFCMToken();
          }
        });

        await PushNotifications.addListener('registrationError', err => {
          console.error('Registration error: ', err.error);
        });

        await PushNotifications.addListener('pushNotificationReceived', notification => {
          console.log('Push notification received: ', notification);
          this.presentAlertConfirm(notification.title, notification.body);
        });

        await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
          console.log('Push notification action performed', notification.actionId, notification.inputValue);
        });
      }

      const registerNotifications = async () => {
        let permStatus = await PushNotifications.checkPermissions();

        if (permStatus.receive == 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }

        if (permStatus.receive != 'granted') {
          throw new Error('User denied permissions!');
        }

        await PushNotifications.register();
      }

      addListeners();
      registerNotifications().then(data => {
        console.log('registering data', data);
      }).catch((error: any) => {
        console.log('registering error', error);
      });
    }

    StatusBar.setBackgroundColor({ "color": '#ff384c' }).then((data: any) => {
      console.log('statusbar data', data);
    }, error => {
      console.log('statusbar color', error);
    }).catch((error: any) => {
      console.log('statusbar color', error);
    });

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
        }

        if (languages) {
          this.util.languages = languages;
          console.log('languages', this.util.languages);
        }

        if (translation) {
          console.log('translation', translation);
          const lang = translation && translation.file && translation.file != null && translation.file != 'null' && translation.file != '' ? translation.file : null;
          if (lang && lang != null) {
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

  isActive() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    return false;
  }

  logout() {
    this.util.show();
    this.api.post_private('v1/auth/user_logout', {}).then((data: any) => {
      console.log(data);
      this.util.hide();
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
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

  async presentAlertConfirm(title: any, body: any) {
    const alert = await this.alertController.create({
      header: this.util.translate('Notification'),
      subHeader: title,
      message: body,
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Okay'),
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  updateFCMToken() {
    const param = {
      id: localStorage.getItem('uid'),
      fcm_token: localStorage.getItem('pushToken') && localStorage.getItem('pushToken') != null ? localStorage.getItem('pushToken') : 'NA'
    }
    this.api.post_private('v1/profile/update', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }
}
