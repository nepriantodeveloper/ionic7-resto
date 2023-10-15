/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Injectable, NgZone } from '@angular/core';
import { LoadingController, AlertController, ToastController, NavController, MenuController } from '@ionic/angular';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { NavigationExtras, Router } from '@angular/router';
import { General } from '../interfaces/general';
import { Manage } from '../interfaces/manage';
import { Popup } from '../interfaces/popup';
import { Settings } from '../interfaces/settings';
import { UserInfo } from '../interfaces/userinfo';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  isLoading = false;
  public generalSettings: General;
  public manageAppSettings: Manage;
  public popupMessage: Popup;
  public appSettings: Settings;
  public userInfo: UserInfo;
  public countries: any[] = [];
  private coupon = new Subject<any>();
  private address = new Subject<any>();
  private newOrder = new Subject<any>();

  public translations: any[] = [];
  public languages: any[] = [];

  public appPage: any[] = [
    {
      title: 'Home',
      url: 'tabs/home',
      icn: 'home-outline'
    },
    {
      title: 'Profile',
      url: 'tabs/account',
      icn: 'person-outline'
    },
    {
      title: 'Language',
      url: 'tabs/account/languages',
      icn: 'language-outline'
    },
    {
      title: 'Contact Us',
      url: 'tabs/account/contacts',
      icn: 'mail-outline'
    },
    {
      title: 'About',
      url: 'tabs/account/about',
      icn: 'alert-circle-outline'
    },
    {
      title: 'FAQs',
      url: 'tabs/account/faqs',
      icn: 'flag-outline'
    },
    {
      title: 'Help',
      url: 'tabs/account/help',
      icn: 'help-circle-outline'
    },
  ];
  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private menuCtrl: MenuController,
    private router: Router,
    private zone: NgZone,
  ) {

  }

  navigateToPage(routes: any, param?: NavigationExtras | undefined) {
    this.zone.run(() => {
      console.log(routes, param);
      this.router.navigate([routes], param);
    });
  }

  navigateRoot(routes: any) {
    this.zone.run(() => {
      this.navCtrl.navigateRoot([routes], { replaceUrl: true });
    });
  }

  getKeys(key: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(localStorage.getItem(key))
    });
  }

  clearKeys(key: any) {
    // this.storage.remove(key);
    localStorage.removeItem(key);
  }

  setKeys(key: any, value: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      resolve(localStorage.setItem(key, value));
    });
  }


  translate(str: any) {
    if (this.translations[str]) {
      return this.translations[str];
    }
    return str;
  }

  openMenu() {
    this.menuCtrl.open();
  }

  async show(msg?: any) {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: msg && msg != '' && msg != null ? this.translate(msg) : '',
      spinner: 'bubbles',
    }).then(a => {
      a.present().then(() => {
        //console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async hide() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }

  /*
    Show Warning Alert Message
    param : msg = message to display
    Call this method to show Warning Alert,
    */
  async showWarningAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: this.translate('Warning'),
      message: this.translate(msg),
      buttons: [this.translate('OK')]
    });

    await alert.present();
  }

  async showSimpleAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: '',
      message: this.translate(msg),
      buttons: [this.translate('OK')]
    });

    await alert.present();
  }

  /*
   Show Error Alert Message
   param : msg = message to display
   Call this method to show Error Alert,
   */
  async showErrorAlert(msg: any) {
    const alert = await this.alertCtrl.create({
      header: this.translate('Error'),
      message: this.translate(msg),
      buttons: [this.translate('OK')]
    });

    await alert.present();
  }

  /*
     param : email = email to verify
     Call this method to get verify email
     */
  async getEmailFilter(email: any) {
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!(emailfilter.test(email))) {
      const alert = await this.alertCtrl.create({
        header: this.translate('Warning'),
        message: this.translate('Please enter valid email'),
        buttons: [this.translate('OK')]
      });
      await alert.present();
      return false;
    } else {
      return true;
    }
  }


  /*
    Show Toast Message on Screen
     param : msg = message to display, color= background
     color of toast example dark,danger,light. position  = position of message example top,bottom
     Call this method to show toast message
     */

  async showToast(msg: any, colors: any, positon: any) {
    const toast = await this.toastCtrl.create({
      message: this.translate(msg),
      duration: 2000,
      color: colors,
      position: positon
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });
  }
  async shoNotification(msg: any, colors: any, positon: any) {

    const toast = await this.toastCtrl.create({
      message: this.translate(msg),
      duration: 4000,
      color: colors,
      position: positon,
      buttons: [
        {
          text: this.translate('Ok'),
          role: 'cancel',
          handler: () => {
            // console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });

  }

  async errorToast(msg: any, color?: any) {

    const toast = await this.toastCtrl.create({
      message: this.translate(msg),
      duration: 2000,
      color: color ? color : 'dark'
    });
    toast.present();
    await Haptics.impact({ style: ImpactStyle.Medium });

  }

  onBack() {
    this.navCtrl.back();
  }

  apiErrorHandler(err: any) {
    // console.log('Error got in service =>', err)
    if (err && err.status == 401 && err.error.error) {
      this.errorToast(err.error.error);
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      localStorage.removeItem('sid');
      this.navCtrl.navigateRoot('/login');
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
      this.navCtrl.navigateRoot('/login');
    } else if (err.status == 500) {
      this.errorToast('Something went wrong');
    } else if (err.status == 422 && err.error.error) {
      this.errorToast(err.error.error);
    } else {
      this.errorToast('Something went wrong');
    }
  }

  makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
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

  publishCoupon(data: any) {
    this.coupon.next(data);
  }

  getCouponObservable(): Subject<any> {
    return this.coupon;
  }

  publishAddress(data: any) {
    this.address.next(data);
  }

  getAddressObservable(): Subject<any> {
    return this.address;
  }

  publishNewOrder(data: any) {
    this.newOrder.next(data);
  }

  getOrderObservable(): Subject<any> {
    return this.newOrder;
  }
}
