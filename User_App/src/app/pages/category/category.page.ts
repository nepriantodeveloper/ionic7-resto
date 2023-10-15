/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import { VariationsPage } from '../variations/variations.page';
import { MenuComponent } from 'src/app/components/menu/menu.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  storeId: any = '';
  apiCalled: boolean = false;

  cateId: any = '';
  categories: any[] = [];
  name: any = '';
  descritions: any = '';
  cover: any = '';
  address: any = '';
  ratting: any = '';
  time: any = '';
  totalRatting: any = '';
  dishPrice: any = '';
  cusine: any[] = [];
  foods: any[] = [];
  dummyFoods: any[] = [];
  dummy: any[] = [];
  veg: boolean;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    public cart: CartService,
    private chMod: ChangeDetectorRef,
    private modalController: ModalController,
    private alertController: AlertController,
    private popoverController: PopoverController
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.storeId = data.id;
        this.getStoreInfo();
      }
    });
  }

  ngOnInit() {
  }

  getStoreInfo() {
    this.apiCalled = false;
    this.api.post_public('v1/stores/getStoreData', { "id": this.storeId }).then((data: any) => {
      console.log(data);
      this.apiCalled = true;
      if (data && data.status && data.status == 200 && data.data) {
        this.categories = data.categories;
        if (this.categories.length != 0) {
          this.cateId = this.categories[0].id;
          this.getFoods();
        }
        const info = data.data;
        console.log(info);
        this.cart.cartStoreInfo = info;
        this.name = info.name;
        this.descritions = info.descriptions;
        this.cover = info.cover;
        this.address = info.address;
        this.ratting = info.rating;
        this.totalRatting = info.total_rating;
        this.dishPrice = info.dish;
        if (info.cusine && info.cusine != '') {
          this.cusine = info.cusine.split(',');
        } else {
          this.cusine = [];
        }
      }
    }, error => {
      console.log(error);
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.apiCalled = true;
      this.util.apiErrorHandler(error);
    });
  }

  getFoods() {
    console.log('foods', this.cateId);
    this.dummy = Array(10);
    this.foods = [];
    this.api.post_public('v1/foods/getFoodsOrder', { "restId": this.storeId, "cid": this.cateId }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status == 200 && data.data) {
        data.data.forEach((element: any) => {
          if (element.variations && element.variations != '' && typeof element.variations == 'string') {
            element.variations = JSON.parse(element.variations);
          } else {
            element.variations = [];
          }
          if (this.cart.itemId.includes(element.id)) {
            const index = this.cart.cart.filter(x => x.id == element.id);
            console.log('->index->', index);
            if (index && index.length) {
              element['quantiy'] = index[0].quantiy;
              element['selectedItem'] = index[0].selectedItem;
            } else {
              element['quantiy'] = 0;
              element['selectedItem'] = [];
            }
          } else {
            element['quantiy'] = 0;
            element['selectedItem'] = [];
          }
        });

        this.foods = data.data;
        this.dummyFoods = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }

  onBack() {
    this.util.onBack();
  }

  openDetails() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.storeId
      }
    };
    this.util.navigateToPage('rest-details', param);
  }

  statusChange() {
    console.log('status', this.veg);
    const value = this.veg == true ? '1' : '0';
    console.log(value);
    this.changeStatus(value);
  }

  changeStatus(value: any) {
    this.foods = this.dummyFoods.filter((x: any) => x.veg == value);
    this.chMod.detectChanges();
  }

  segmentChanged() {
    this.getFoods();
  }

  add(index: any) {
    const uid = localStorage.getItem('uid');
    console.log('uid', localStorage.getItem('uid'));
    if (uid && uid != null && uid != 'null') {
      if (this.cart.cart.length == 0) {
        console.log('cart is empty');
        if (this.foods[index].variations && this.foods[index].variations.length) {
          console.log('open modal');
          this.openVariations(index);
        } else {
          this.foods[index].quantiy = 1;
          this.cart.addItem(this.foods[index]);
        }
      } else {
        console.log('cart is full');
        const restIds = this.cart.cart.filter(x => x.restId == this.storeId);
        console.log(restIds);
        if (restIds && restIds.length > 0) {
          if (this.foods[index].variations && this.foods[index].variations.length) {
            console.log('open modal');
            this.openVariations(index);
          } else {
            this.foods[index].quantiy = 1;
            this.cart.addItem(this.foods[index]);
          }
        } else {
          this.dummy = [];
          this.presentAlertConfirm();
        }
      }
      this.chMod.detectChanges();
    } else {
      this.util.navigateToPage('/login');
    }
  }

  getQuanity(id: any) {
    const data = this.cart.cart.filter(x => x.id == id);
    return data[0].quantiy;
  }

  addQ(index: any) {
    console.log('foooduieeeee====>>', this.foods[index]);
    if (this.foods[index].variations && this.foods[index].variations.length) {
      if (this.foods[index].quantiy != 0) {
        console.log('new variant....');
      }
      this.openVariations(index);
    } else {
      this.foods[index].quantiy = this.foods[index].quantiy + 1;
      this.cart.addQuantity(this.foods[index].quantiy, this.foods[index].id);
      this.chMod.detectChanges();
    }
  }

  removeQ(index: any) {
    if (this.foods[index].quantiy != 0) {
      if (this.foods[index].quantiy >= 1 && !this.foods[index].variations.length) {
        this.foods[index].quantiy = this.foods[index].quantiy - 1;
        if (this.foods[index].quantiy == 0) {
          this.foods[index].quantiy = 0;
          this.cart.removeItem(this.foods[index].id);
        } else {
          this.cart.addQuantity(this.foods[index].quantiy, this.foods[index].id);
        }
        this.chMod.detectChanges();
      } else {
        this.openVariations(index);
      }
    } else {
      this.foods[index].quantiy = 0;
      this.cart.removeItem(this.foods[index].id);
      this.chMod.detectChanges();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: this.util.translate('Warning'),
      message: this.util.translate(`you already have item's in cart with different restaurant`),
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: this.util.translate('Clear cart'),
          handler: () => {
            console.log('Confirm Okay');
            this.cart.clearCart();
          }
        }
      ]
    });

    await alert.present();
  }

  async openVariations(index: any) {
    const modal = await this.modalController.create({
      component: VariationsPage,
      cssClass: 'custom_modal2',
      componentProps: {
        name: this.name,
        food: this.foods[index]
      }
    });
    modal.onDidDismiss().then((data) => {
      console.log('from variations', data.data);
      console.log('data.data', data.role);
      let isValid = false;
      if (data.role == 'new') {
        this.foods[index].quantiy = 1;
        const carts = {
          item: data.data,
          total: 1
        };
        this.foods[index].selectedItem.push(carts);
        console.log('id==>?>>', this.foods[index].id);
        this.cart.addVariations(this.foods[index], carts, data.role);
        isValid = true;
      } else if (data.role == 'sameChoice') {
        this.foods[index].selectedItem = data.data;
        console.log('length=>', this.foods[index].selectedItem);
        this.foods[index].quantiy = this.foods[index].selectedItem.length;
        if (this.foods[index].quantiy == 0) {
          this.foods[index].quantiy = 0;
          this.cart.removeItem(this.foods[index].id);
        } else {
          this.cart.addVariations(this.foods[index], 'carts', data.role);
          isValid = true;
        }
      } else if (data.role == 'newCustom') {
        const carts = {
          item: data.data,
          total: 1
        };
        this.foods[index].selectedItem.push(carts);
        this.foods[index].quantiy = this.foods[index].quantiy + 1;
        this.cart.addVariations(this.foods[index], carts, data.role);
        isValid = true;
      } else if (data.role == 'remove') {
        console.log('number', data.data);
        this.foods[index].quantiy = 0;
        this.foods[index].selectedItem = [];
        isValid = true;
      } else if (data.role == 'dismissed') {
        console.log('dismissed');
        this.foods[index].quantiy = 1;
        const carts = {
          item: data.data,
          total: 1
        };
        this.foods[index].selectedItem.push(carts);
        console.log('id==>?>>', this.foods[index].id);
        this.cart.addVariations(this.foods[index], carts, 'new');
        isValid = true;
      }
      if (isValid) {
        console.log('isValid', isValid);
        this.cart.calcuate();
      }
    });
    return await modal.present();
  }

  viewCart() {
    console.log('viewCart');
    this.util.navigateRoot('/tabs/cart');
  }

  async presentPopover(ev: any) {
    if (this.categories.length <= 0) {
      return false;
    }
    const popover = await this.popoverController.create({
      component: MenuComponent,
      event: ev,
      componentProps: { data: this.categories, id: this.cateId },
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        this.cateId = data.data.id;
        this.getFoods();
      }
    });
    await popover.present();
  }
}
