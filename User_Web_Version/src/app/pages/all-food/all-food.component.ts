/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-food',
  templateUrl: './all-food.component.html',
  styleUrls: ['./all-food.component.scss']
})
export class AllFoodComponent {
  @ViewChild('variantModal') public variantModal: ModalDirective;
  tab: any = 1;
  id: any = '';
  name: any = '';
  descritions: any = '';
  cover: any = '';
  address: any = '';
  Rating: any = '';
  time: any = '';
  totalRating: any = '';
  dishPrice: any = '';
  cusine: any[] = [];
  foods: any[] = [];
  dummyFoods: any[] = [];
  categories: any[] = [];
  dummy = Array(5);
  dumyCates: any[] = Array(10);
  veg: boolean;
  deliveryAddress: any = '';
  restDetail: any = '';
  caetId: any = '';
  productName: any = '';
  desc: any = '';
  total: any = 0;
  lists: any[] = [];
  carts: any[] = [];
  userCart: any[] = [];
  sameProduct: boolean = false;
  removeProduct: boolean = false;

  radioSelected: any = '';
  haveSize: boolean;

  newItem: boolean = false;
  sameCart: any[] = [];
  images: any[] = [];
  variantIndex: any = '';

  viewAcc = false;
  activeTab = 'home';

  uid: any = '';
  open: any = '';
  close: any = '';
  contactNo: any = '';

  reviews: any[] = [];

  haveData: boolean;
  haveReview: boolean;
  havePhotos: boolean;

  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
    public cart: CartService,
    private chMod: ChangeDetectorRef,
    private navCtrl: Location,
    private router: Router) {
    this.haveData = true;
    this.haveReview = true;
    this.havePhotos = true;
    console.log('-/', this.route.snapshot.paramMap.get('id'))
    if (this.route.snapshot.paramMap.get('id')) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.getVenueDetails();
    }
  }

  getVenueDetails() {
    this.api.post_public('v1/stores/getStoreData', { "id": this.id }).then((datas: any) => {
      console.log(datas);
      if (datas && datas.status && datas.status == 200 && datas.data) {
        const data = datas.data;
        if (data) {
          this.getReviews();
          this.cart.cartStoreInfo = data;
          this.name = data.name;
          this.descritions = data.descriptions;
          this.cover = data.cover;
          this.address = data.address;
          this.Rating = data.rating ? data.rating : 0;
          this.totalRating = data.total_rating ? data.total_rating : 0;
          this.dishPrice = data.dish;
          this.contactNo = data.mobile;
          if (data.images && data.images != '' && typeof data.images == 'string') {
            this.images = JSON.parse(data.images);
            this.havePhotos = true;
          } else {
            this.havePhotos = false;
          }

          this.time = data.time;
          this.open = moment('10-10-2020 ' + data.open_time).format('LT');
          this.close = moment('10-10-2020 ' + data.close_time).format('LT');
          if (data.cusine && data.cusine != '') {
            this.cusine = data.cusine.split(',');
          } else {
            this.cusine = [];
          }
          this.chMod.detectChanges();
        } else {
          this.util.errorToast(this.util.translate('Restaurant not found'));
          this.navCtrl.back();
        }
        if (datas && datas.categories && datas.categories.length) {
          this.categories = datas.categories;
          this.caetId = this.categories[0].id;
          this.getFoodByCid();
          this.dumyCates = [];
        } else {
          this.dumyCates = [];
          this.dummy = [];
          this.haveData = false;
        }

      } else {
        this.dummy = [];
        this.dumyCates = [];
        this.haveData = false;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.dumyCates = [];
      this.haveData = false;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.dumyCates = [];
      this.haveData = false;
      this.util.apiErrorHandler(error);
    });
  }

  getReviews() {
    console.log('get reviews');
    this.api.post_public('v1/stores/getStoreReviews', { id: this.id }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.reviews = data.data
      } else {
        this.haveReview = false;
      }
    }, error => {
      console.log(error);
      this.haveReview = false;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.haveReview = false;
      this.util.apiErrorHandler(error);
    });
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
        const restIds = this.cart.cart.filter(x => x.restId == this.id);
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
      this.util.onLoginPop();
    }
  }

  async presentAlertConfirm() {
    console.log('present alert to clear');
    Swal.fire({
      title: this.util.translate('Warning'),
      text: this.util.translate(`you already have item's in cart with different restaurant`),
      icon: 'error',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: this.util.translate('Clear cart'),
      backdrop: false,
      background: 'white'
    }).then(status => {
      if (status && status.value) {
        console.log('clear');
        this.cart.clearCart();
      }
    });

  }

  getQuanity(id: any) {
    const data = this.cart.cart.filter(x => x.id == id);
    return data[0].quantiy;
  }

  addQ(index: any) {
    console.log('foooduieeeee====>>', this.foods[index]);
    if (this.foods[index].variations && this.foods[index].variations.length) {
      this.openVariations(index);
    } else {
      this.foods[index].quantiy = this.foods[index].quantiy + 1;
      this.cart.addQuantity(this.foods[index].quantiy, this.foods[index].id);
      this.chMod.detectChanges();
    }
  }

  removeQ(index: any) {
    if (index < 0) {
      console.log('negative items');
      this.cart.cart = [];
      localStorage.removeItem('userCart');
      window.location.reload();
    }
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

  async openVariations(index: any) {
    console.log('open variantions///', this.foods[index]);
    this.variantIndex = null;
    this.lists = [];
    this.productName = '';
    this.haveSize = false;
    this.sameProduct = false;
    this.sameCart = [];
    this.userCart = [];
    ////
    this.carts = [];
    this.variantIndex = index;
    this.lists = this.foods[index].variations;
    console.log('===============');
    console.log(this.lists);
    this.lists.forEach((subElementItem: any) => {
      console.log(subElementItem);
      subElementItem.items.forEach((sub: any) => {
        sub.isChecked = false;
      });
    });
    console.log('===============');
    this.productName = this.foods[index].name;
    console.log(this.productName, this.foods[index]);
    const userCart = localStorage.getItem('userCart');
    this.haveSize = this.foods[index].size == '1';
    console.log('usercart---->', userCart);
    if (userCart && userCart != 'null' && userCart != undefined && userCart != 'undefined') {
      this.userCart = JSON.parse(userCart);
      console.log('==>>', this.userCart);
      const sameItem = this.userCart.filter(x => x.id == this.foods[index].id);
      console.log('sameItem', sameItem);
      if (sameItem && sameItem.length && sameItem.length > 0) {
        this.sameProduct = true;
        this.sameCart = sameItem[0].selectedItem;
        console.log('=??==>asdasd-->>>asd>>>>', this.sameCart);
      }
    } else {
      this.userCart = [];
    }
    console.log(this.sameProduct);
    this.variantModal.show();
  }

  removeCartQ(i: any) {
    const index = this.foods.findIndex(x => x.id == this.cart.cart[i].id);
    console.log(index);
    if (index < 0) {
      console.log('negative items');
      this.cart.cart = [];
      localStorage.removeItem('userCart');
      window.location.reload();
    }
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

  addCartQ(i: any) {
    const index = this.foods.findIndex(x => x.id == this.cart.cart[i].id);
    console.log(index);
    console.log('foooduieeeee====>>', this.foods[index]);
    if (this.foods[index].variations && this.foods[index].variations.length) {
      this.openVariations(index);
    } else {
      this.foods[index].quantiy = this.foods[index].quantiy + 1;
      this.cart.addQuantity(this.foods[index].quantiy, this.foods[index].id);
      this.chMod.detectChanges();
    }
  }

  removeAddonCartQ(i: any, j: any) {
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

  addAddonCartQ(i: any, j: any) {
    console.log(this.cart.cart[i].selectedItem[j]);
    this.cart.cart[i].selectedItem[j].total = this.cart.cart[i].selectedItem[j].total + 1;
    this.cart.calcuate();
  }

  radioGroupChange(index: any, subIndex: any) {
    console.log(index, subIndex);
    console.log(this.lists);
    this.lists[index].items.forEach((element: any) => {
      element.isChecked = false;
    });
    this.lists[index].items[subIndex].isChecked = true;
  }

  addToCart() {
    console.log(this.lists);
    this.carts = [];
    this.lists.forEach((element: any) => {
      element.items.forEach((subItem: any) => {
        if (subItem.isChecked == true) {
          const param = {
            type: element.title,
            value: parseFloat(subItem.price),
            name: subItem.title
          };
          this.carts.push(param);
        }
      });
    });
    const addedSize = this.carts.filter(x => x.type == 'size');
    console.log(addedSize);
    let role;
    if (this.haveSize && !addedSize.length) {
      console.log('no size added');
      this.util.errorToast(this.util.translate('Please select size'));
      return false;
    }
    if (this.carts.length && !this.userCart.length) {
      role = 'new';
    }
    if (this.carts.length && this.userCart.length) {
      role = 'new';
    }
    if (!this.carts.length) {
      role = 'dismissed';
    }
    if (this.newItem) {
      role = 'newCustom';
    }
    console.log('role', role, this.carts);

    if (this.haveSize == false) {
      const regularItem =
      {
        name: 'Regular',
        type: 'size',
        value: Number(this.foods[this.variantIndex].price)
      };
      this.carts.push(regularItem);
    }

    if (role == 'new') {
      this.foods[this.variantIndex].quantiy = 1;
      const carts = {
        item: this.carts,
        total: 1
      };
      this.foods[this.variantIndex].selectedItem.push(carts);
      console.log('id==>?>>', this.foods[this.variantIndex].id);
      this.cart.addVariations(this.foods[this.variantIndex], carts, role);
      this.cart.calcuate();
    }
    if (role == 'newCustom') {
      const carts = {
        item: this.carts,
        total: 1
      };
      this.foods[this.variantIndex].selectedItem.push(carts);
      this.foods[this.variantIndex].quantiy = this.foods[this.variantIndex].quantiy + 1;
      this.cart.addVariations(this.foods[this.variantIndex], carts, 'newCustom');
      this.cart.calcuate();
    }
    if (role == 'dismissed') {
      this.foods[this.variantIndex].quantiy = 1;
      const carts = {
        item: this.carts,
        total: 1
      };
      this.foods[this.variantIndex].selectedItem.push(carts);
      console.log('id==>?>>', this.foods[this.variantIndex].id);
      this.cart.addVariations(this.foods[this.variantIndex], carts, 'new');
    }
    this.variantModal.hide();
    this.reload();
  }

  reload() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['./'], { relativeTo: this.route });
  }

  checkedEvent(event: any, index: any, subIndex: any) {
    this.lists[index].items[subIndex].isChecked = event.target.checked;
  }

  sameChoise() {
    console.log(this.sameCart);
    this.foods[this.variantIndex].selectedItem = this.sameCart;
    this.foods[this.variantIndex].quantiy = this.foods[this.variantIndex].selectedItem.length;
    if (this.foods[this.variantIndex].quantiy == 0) {
      this.foods[this.variantIndex].quantiy = 0;
      this.cart.removeItem(this.foods[this.variantIndex].id);
    } else {
      this.cart.addVariations(this.foods[this.variantIndex], 'carts', 'sameChoice');
      this.cart.calcuate();
    }
    this.variantModal.hide();
  }

  removeQSame(index: any) {
    this.sameCart[index].total = this.sameCart[index].total - 1;
    if (this.sameCart[index].total == 0) {
      this.sameCart = this.sameCart.filter(x => x.total != 0);
    }
    console.log(this.sameCart.length);
    if (this.sameCart.length <= 0) {
      this.foods[this.variantIndex].quantiy = 0;
      this.foods[this.variantIndex].selectedItem = [];
      this.cart.removeItem(this.foods[this.variantIndex].id);
      this.sameProduct = false;
      this.cart.calcuate();
      this.variantModal.hide();
    }
  }

  addQSame(index: any) {
    this.sameCart[index].total = this.sameCart[index].total + 1;
  }

  openCart() {
    if (this.cart.totalPrice < this.util.generalSettings.min) {
      let text;
      if (this.util.appSettings.currencySide == 'left') {
        text = this.util.appSettings.currencySymbol + ' ' + this.util.generalSettings.min;
      } else {
        text = this.util.generalSettings.min + ' ' + this.util.appSettings.currencySymbol;
      }
      Swal.fire({
        title: this.util.translate('Error'),
        text: this.util.translate('Minimum order amount must be') + ' ' + text + ' ' + this.util.translate('or more'),
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: this.util.translate('OK'),
        backdrop: false,
        background: 'white'
      }).then(status => {
        if (status && status.value) {
        }
      });
      return false;
    }
    this.util.navigateToPage('cart');
  }

  getDate(date: any) {
    return moment(date).format('lll');
  }

  getFoodByCid() {
    this.dummy = Array(5);
    this.foods = [];
    this.haveData = true;
    this.api.post_public('v1/foods/getFoodsOrder', { "restId": this.id, "cid": this.caetId }).then((data: any) => {
      this.dummy = [];
      console.log(data);
      console.log(data && data.status && data.status == 200 && data.data);
      if (data && data.status && data.status == 200 && data.data) {
        data.data.forEach((element: any) => {
          if (element.variations && element.variations != '' && typeof element.variations == 'string') {
            element.variations = JSON.parse(element.variations);
            if (element.variations && element.variations.length) {
              element.variations.forEach((subElementItem: any) => {
                console.log(subElementItem);
                subElementItem.items.forEach((sub: any) => {
                  sub.isChecked = false;
                });
              });
            }
          } else {
            element.variations = [];
          }
          if (this.cart.itemId.includes(element.id)) {
            const index = this.cart.cart.filter(x => x.id == element.id);
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
        this.chMod.detectChanges();
        console.log('foodds--->>', this.foods);
      } else {
        this.haveData = false;
      }
    }, error => {
      console.log(error);
      this.haveData = false;
      this.dummy = [];
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.haveData = false;
      this.dummy = [];
      this.util.apiErrorHandler(error);
    });
  }
}
