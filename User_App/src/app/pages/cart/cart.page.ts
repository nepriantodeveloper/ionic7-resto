/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { CouponsPage } from '../coupons/coupons.page';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  coupon: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private modalController: ModalController
  ) {
    this.cart.orderNotes = '';
    setTimeout(() => {
      if (!this.cart || !this.cart.cartStoreInfo || !this.cart.cartStoreInfo.name) {
        this.cart.getVenueDetails();
      }
    }, 1000);
  }

  ngOnInit() {

  }

  getCart() {
    this.util.navigateRoot('/tabs/home');
  }

  addQ(index: any) {
    console.log(this.cart.cart[index]);
    this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    this.cart.calcuate();
  }

  removeQ(index: any) {
    if (this.cart.cart[index].quantiy != 0) {
      this.cart.cart[index].quantiy = this.cart.cart[index].quantiy - 1;
      if (this.cart.cart[index].quantiy == 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    } else {
      this.cart.cart[index].quantiy = 0;
      if (this.cart.cart[index].quantiy == 0) {
        this.cart.removeItem(this.cart.cart[index].id);
      }
    }
    this.cart.calcuate();
  }

  checkout() {
    if (this.cart.totalPrice < this.util.generalSettings.min) {
      // let text = this.util.generalSettings.min;
      let text = '';
      if (this.util.appSettings.currencySide == 'left') {
        text = this.util.appSettings.currencySymbol + ' ' + this.util.generalSettings.min;
      } else {
        text = this.util.generalSettings.min + ' ' + this.util.appSettings.currencySymbol;
      }
      this.util.errorToast(this.util.translate('Minimum order amount must be') + ' ' + text + ' ' + this.util.translate('or more'));
      return false;
    }

    const param: NavigationExtras = {
      queryParams: {
        from: 'cart'
      }
    };
    this.util.navigateToPage('choose-address', param);
  }

  async openCoupon() {
    const modal = await this.modalController.create({
      component: CouponsPage,
      componentProps: { restId: this.cart.cartStoreInfo.uid, name: this.cart.cartStoreInfo.name, totalPrice: this.cart.totalPrice }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    await modal.present();
  }

  removeQAddos(i: any, j: any) {
    console.log(this.cart.cart[i].selectedItem[j]);
    if (this.cart.cart[i].selectedItem[j].total != 0) {
      this.cart.cart[i].selectedItem[j].total = this.cart.cart[i].selectedItem[j].total - 1;
      if (this.cart.cart[i].selectedItem[j].total == 0) {
        const newCart: any[] = [];
        this.cart.cart[i].selectedItem.forEach((element: any) => {
          if (element.total > 0) {
            newCart.push(element);
          }
        });
        console.log('newCart', newCart);
        this.cart.cart[i].selectedItem = newCart;
        this.cart.cart[i].quantiy = newCart.length;
        if (this.cart.cart[i].quantiy == 0) {
          this.cart.removeItem(this.cart.cart[i].id);
        }
      }
    }
    this.cart.calcuate();
  }

  addQAddos(i: any, j: any) {
    console.log(this.cart.cart[i].selectedItem[j]);
    this.cart.cart[i].selectedItem[j].total = this.cart.cart[i].selectedItem[j].total + 1;
    this.cart.calcuate();
  }
}
