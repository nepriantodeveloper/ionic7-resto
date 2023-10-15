/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.scss']
})
export class HeadersComponent {
  activeTab = 'home';
  headerMode: boolean;
  activeFilter: any;
  totalRest: any;

  selectedLanguage: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private chmod: ChangeDetectorRef,
    private cart: CartService,
    private router: Router
  ) {
    this.headerMode = false;
    this.selectedLanguage = 'English';
    setTimeout(() => {
      if (this.util && this.util.languages && this.util.languages.length) {
        const item = this.util.languages.filter(x => x.id == localStorage.getItem('selectedLanguage'));
        console.log('saved language', item);
        if (item && item.length && item.length > 0) {
          this.selectedLanguage = item[0].name;
        }
      }
    }, 6000);
    this.util.subscribeHeader().subscribe(data => {
      if (data) {
        this.headerMode = data.header;
        this.totalRest = data.total;
        if (data && data.active != undefined) {
          this.activeFilter = data.active;
        }
      }

      this.chmod.detectChanges();
    });
  }

  addFilter(item: any) {
    this.activeFilter = item;
    this.util.publishFilterCode(item);
  }

  changeLanguage(value: any) {
    console.log(value);
    const direction = value.positions == 0 ? 'ltr' : 'rtl';
    localStorage.setItem('selectedLanguage', value.id);
    localStorage.setItem('direction', direction);
    window.location.reload();
  }

  haveLocation() {
    const location = localStorage.getItem('location');
    if (location && location != null && location != 'null') {
      return true;
    }
    return false;
  }

  haveSigned() {
    const uid = localStorage.getItem('uid');
    if (uid && uid != null && uid != 'null') {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
  }

  goToHome() {
    this.activeTab = 'home';
    this.util.navigateToPage('/restaurants');
  }

  goToSearch() {
    this.activeTab = 'search';
    this.util.navigateToPage('/search');
  }

  goToOffers() {
    this.activeTab = 'offers';
    this.util.navigateToPage('/offers');
  }

  goToSettings(item: any) {
    this.activeTab = 'settings';
    const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
    this.router.navigate(['user', name, item]);
    // this.util.navigateToPage('user', name, item);
  }

  goToAccount() {
    this.activeTab = 'account';
    this.util.navigateToPage('/account');
  }

  goToCart() {
    this.activeTab = 'cart';
    this.util.navigateToPage('/cart');
  }

  getAddress() {
    const location = localStorage.getItem('address');
    if (location && location != null && location != 'null') {
      return location.length > 30 ? location.slice(0, 30) + '....' : location;;
    }
    return this.util.translate('Choose your Location');
  }

  logout() {
    this.util.start();
    this.api.post_private('v1/auth/user_logout', {}).then((data: any) => {
      console.log(data);
      this.util.stop();
      localStorage.removeItem('uid');
      localStorage.removeItem('token');
      this.cart.cart = [];
      this.cart.itemId = [];
      this.cart.totalPrice = 0;
      this.cart.grandTotal = 0;
      this.cart.coupon = null;
      this.cart.discount = null;
      this.util.clearKeys('cart');
      this.util.navigateToPage('');
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

  goToHelp() {
    this.activeTab = 'help';
    this.util.navigateToPage('help');
  }

  goToFaqs() {
    this.activeTab = 'faq';
    this.util.navigateToPage('faq');
  }
}
