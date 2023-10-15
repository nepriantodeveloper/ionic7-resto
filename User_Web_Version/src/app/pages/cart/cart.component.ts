/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NavigationExtras, Router } from '@angular/router';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { RazorPayService } from 'src/app/services/razorPay';
import Swal from 'sweetalert2';
import {
  IPayPalConfig,
  ICreateOrderRequest
} from 'ngx-paypal';
import { ModalDirective } from 'angular-bootstrap-md';
import * as  moment from 'moment';
import { Location } from '@angular/common';
declare var google: any;
declare let Razorpay: any;
declare let PaystackPop: any;
declare let FlutterwaveCheckout: any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  @ViewChild('addressFromMap') public addressFromMap: ModalDirective;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  @ViewChild('changedPlace') public changedPlace: ModalDirective;
  @ViewChild('offersModal') public offersModal: ModalDirective;
  @ViewChild('confirmModal', { static: true }) confirmModal: ModalDirective;
  @ViewChild('successModal', { static: true }) successModal: ModalDirective;
  @ViewChild('stripeModal', { static: true }) stripeModal: ModalDirective;
  @ViewChild('addCardModal', { static: true }) addCardModal: ModalDirective;
  @ViewChild('payPalModal') public payPalModal: ModalDirective;
  public payPalConfig?: IPayPalConfig;
  toggle: any = 'rd1';
  dummy: any[] = [];
  myaddress: any[] = [];
  cards: any[] = [];
  token: any;
  RAZORPAY_OPTIONS = {
    'key': '',
    'amount': 0,
    'name': this.util.generalSettings.name,
    'order_id': '',
    'description': this.util.generalSettings.name + ' Payment',
    'image': this.api.mediaURL + this.util.appSettings.logo,
    'prefill': {
      'name': '',
      'email': '',
      'contact': '',
      'method': ''
    },
    'modal': {},
    'theme': {
      'color': '#45C261'
    }
  };
  payMethods: any;
  payId: any;

  addCard: boolean;

  cnumber: any = '';
  cname: any = '';
  cvc: any = '';
  date: any = '';
  email: any = '';

  lat: any;
  lng: any;
  address: any = '';
  house: any = '';
  landmark: any = '';
  title: any = 'home';
  pincode: any = '';
  map: any;
  marker: any;

  // autocomplete1: { 'query': string };
  query: any = '';
  autocompleteItems1: any = [];
  GoogleAutocomplete;
  geocoder: any;
  addressSelected: boolean;

  orderNotes: any = '';

  storeFCM: any;

  offers: any[] = [];

  editAddressMode: boolean;
  editClicked: boolean;
  addressId: any;

  payments: any[] = [];
  paymentId: any = '';
  payMethodName: any = '';

  balance: any = 0.0;
  walletDiscount: any = 0.0;

  walletCheck: boolean = false;

  stripeKey: any = '';
  stripeCardList: any[] = [];
  selectedCard: any = '';

  cardNumber: any = '';
  cvv: any = '';
  expiryDate: any = '';
  cardHolderName: any = '';
  cardEmail: any = '';
  constructor(
    private route: Router,
    public cart: CartService,
    public api: ApiService,
    private razorpayService: RazorPayService,
    public util: UtilService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private navCtrl: Location
  ) {
    this.editAddressMode = false;
    console.log('min cart value------->>>>>>>>', this.util.generalSettings.min);
    if (this.cart.totalPrice < this.util.generalSettings.min) {
      console.log('it; min order');
      let text;
      if (this.util.appSettings.currencySide == 'left') {
        text = this.util.appSettings.currencySymbol + ' ' + this.util.generalSettings.min;
      } else {
        text = this.util.generalSettings.min + ' ' + this.util.appSettings.currencySymbol;
      }
      this.util.errorToast(this.util.translate('Minimum order amount must be') + text + this.util.translate('or more'));
      this.router.navigate(['']);
    }
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.query = '';
    this.autocompleteItems1 = [];
    this.addressSelected = false;
    this.getProfile();
    this.getAddress();
    this.getWalletAmount();
    this.getPayments();
    this.getOffers();
    this.cart.calcuate();
    localStorage.removeItem('selectedOffer');
    console.log('cart info==>>', this.cart.cart);
    if (this.cart && this.cart.cart.length && this.cart.cart[0].restId) {
      this.api.post_private('v1/stores/getOrderInfo', { "id": this.cart.cart[0].restId }).then((data: any) => {
        console.log(data);
        if (data && data.status && data.status == 200 && data.data) {
          if (data && data.storeOwner && data.storeOwner.id) {
            this.storeFCM = data.storeOwner.fcm_token;
            console.log('store fcm', this.storeFCM);
          }
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

  getProfile() {
    this.api.post_private('v1/users/getMyInfo', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log('profile', data);
      if (data && data.status == 200 && data.data && data.data.id) {
        this.cardEmail = data.data.email;
        this.stripeKey = data.data.stripe_key;
        console.log(this.stripeKey);
        console.log('stripe key');
        this.getStripeCard();
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }
  ngOnInit(): void {
  }

  loadMap(lat: any, lng: any) {
    const location = new google.maps.LatLng(lat, lng);
    const style = [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: -100 }
        ]
      }
    ];

    const mapOptions = {
      zoom: 16,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: false,
      overviewMapControl: false,
      center: location,
      mapTypeControl: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'Foodies by initappz']
      }
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    const mapType = new google.maps.StyledMapType(style, { name: 'Grayscale' });
    this.map.mapTypes.set('Foodies by initappz', mapType);
    this.map.setMapTypeId('Foodies by initappz');
    this.cd.detectChanges();
    this.addMarker(location);
  }

  addMarker(location: any) {
    const dot = {
      url: 'assets/images/map-marker.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
    };
    this.marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: dot
    });
  }

  getAddressFromMaps(lat: any, lng: any) {
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results: any, status: any) => {
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        this.address = results[0].formatted_address;
        this.cd.detectChanges();
        this.loadMap(lat, lng);

      }
    });
  }

  changeAddress() {
    this.addressFromMap.hide();
    this.changedPlace.show();
  }

  addNewAddress() {
    ///
    // this.newAddress.show();
    this.editClicked = false;
    this.util.start();
    if (window.navigator && window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position);
          this.util.stop();
          this.addressSelected = false;
          this.editAddressMode = false;
          this.addressFromMap.show();
          this.getAddressFromMaps(position.coords.latitude, position.coords.longitude);
        },
        error => {
          this.util.stop();
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
    } else {
      this.util.stop();
    };
  }

  editAddress(item: any) {
    console.log('item...--->><', item);
    this.editClicked = true;
    this.loadMap(item.lat, item.lng);
    this.editAddressMode = true;
    this.address = item.address;
    this.house = item.house;
    this.landmark = item.landmark;
    this.pincode = item.pincode;
    this.title = item.title;
    this.addressId = item.id;
    this.addressFromMap.show();
    this.chooseFromMaps();
  }

  editMyAddress() {
    this.addressFromMap.hide();
    if (this.address == '' || this.landmark == '' || this.house == '' || !this.pincode || this.pincode == '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    this.util.start();
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results: any, status: any) => {
      console.log(results, status);
      if (status == 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        const param = {
          id: this.addressId,
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };

        this.api.post_private('v1/address/update', param).then((data: any) => {
          this.util.stop();
          this.cd.detectChanges();
          if (data && data.status == 200) {
            this.getAddress();
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
            });

            Toast.fire({
              icon: 'success',
              title: this.util.translate('Address updated')
            });
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      } else {
        this.util.stop();
        this.util.errorToast(this.util.translate('Something went wrong'));
        return false;
      }
    });
  }

  updateAddress() {
    console.log('update address');
    if (this.address == '' || this.landmark == '' || this.house == '' || !this.pincode || this.pincode == '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    this.util.start();
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results: any, status: any) => {
      console.log(results, status);
      if (status == 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        const param = {
          id: this.addressId,
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };

        this.api.post_private('v1/address/update', param).then((data: any) => {
          this.util.stop();
          if (data && data.status == 200) {
            this.getAddress();
            this.addressFromMap.hide();
            this.util.errorToast(this.util.translate('Address updated'));
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      } else {
        this.util.stop();
        this.util.errorToast(this.util.translate('Something went wrong'));
        return false;
      }
    });
  }

  chooseFromMaps() {
    // console.log(this.mapElement);
    this.addressSelected = true;
    document.getElementById('map')!.style.height = '150px';
  }

  payMethod(method: any) {
    console.log(method);
    this.payMethods = method;
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
    if (this.cart.cart.length == 0) {
      this.navCtrl.back();
    }
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
      this.navCtrl.back();
    }
    this.cart.calcuate();
  }

  getAddress() {
    this.dummy = Array(10);
    this.api.post_private('v1/address/getByUid', { "id": localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      this.cd.detectChanges();
      if (data && data.status == 200 && data.data.length > 0) {
        this.myaddress = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  getPayments() {
    this.api.get_private('v1/payments/getPayments').then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.payments = data.data;
        const haveFlutterwave = this.payments.filter(x => x.id == 8); // flutterwave id
        if (haveFlutterwave.length) {
          this.util.loadScript('https://checkout.flutterwave.com/v3.js');
        }
        const havePaystack = this.payments.filter(x => x.id == 7);
        if (havePaystack.length) {
          this.util.loadScript('https://js.paystack.co/v1/inline.js'); // paystack id
        }

        const haveRazorPay = this.payments.filter(x => x.id == 5); // razorpay id
        if (haveRazorPay.length) {
          this.util.loadScript('https://checkout.razorpay.com/v1/checkout.js');
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  degreesToRadians(degrees: any) {
    return degrees * Math.PI / 180;
  }

  distanceInKmBetweenEarthCoordinates(lat1: any, lon1: any, lat2: any, lon2: any) {
    console.log(lat1, lon1, lat2, lon2);
    const earthRadiusKm = 6371;
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);
    lat1 = this.degreesToRadians(lat1);
    lat2 = this.degreesToRadians(lat2);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
  }

  async selectAddress(item: any) {
    const distance = await this.distanceInKmBetweenEarthCoordinates(parseFloat(this.cart.cartStoreInfo.lat),
      parseFloat(this.cart.cartStoreInfo.lng), parseFloat(item.lat), parseFloat(item.lng));
    console.log('distance', distance);
    const permittedDistance = this.util.appSettings.allowDistance;
    console.log('--', permittedDistance);
    if (distance <= permittedDistance) {
      console.log('distance is ok... you can order now');
      this.cart.deliveryAddress = item;
      this.cart.calcuate();
      this.toggle = 'rd2';
      this.cart.deliveryAddress = item;
      this.cart.calcuate();
    } else {
      this.util.errorToast(this.util.translate('Distance between your address and restaurant address must be') + ' ' +
        permittedDistance + ' ' + this.util.translate('KM'));
    }
  }

  addAddonCartQ(i: any, j: any) {
    console.log(this.cart.cart[i].selectedItem[j]);
    this.cart.cart[i].selectedItem[j].total = this.cart.cart[i].selectedItem[j].total + 1;
    this.cart.calcuate();
  }

  addCartQ(index: any) {
    console.log(this.cart.cart[index]);
    this.cart.cart[index].quantiy = this.cart.cart[index].quantiy + 1;
    this.cart.calcuate();
  }

  removeCartQ(index: any) {
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
    if (this.cart.cart.length == 0) {
      this.navCtrl.back();
    }
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
      this.navCtrl.back();
    }
    this.cart.calcuate();
  }

  getOffers() {
    this.api.get_private('v1/offers/getActiveOffers').then((data: any) => {
      console.log('list===>', data);
      this.offers = [];
      if (data && data.status == 200 && data.data.length) {
        const currnetDate = moment().format('YYYY-MM-DD');
        data.data.forEach((element: any) => {
          console.log(moment(element.expire).isAfter(currnetDate));
          if (element && element.status == '1' && moment(element.expire).isAfter(currnetDate)) {
            console.log('yes=>', element);
            element.available = element.available.split(',').map(Number);
            this.offers.push(element);
          }
        });
      }
    }).catch(error => {
      console.log(error);
    });
  }

  removeOffer() {
    this.cart.coupon = null;
    this.cart.calcuate();
    localStorage.removeItem('selectedOffer');
  }

  proceed() {
    if (!this.cart || !this.cart.deliveryAddress || !this.cart.deliveryAddress.lat) {
      this.util.errorToast(this.util.translate('Please select delivery address'));
      return false;
    }
    if (this.paymentId == 0) {
      this.util.errorToast(this.util.translate('Please select payment method'));
      return false;
    }
    this.confirmModal.show();
  }

  addAddress() {
    this.addressFromMap.hide();
    if (this.address == '' || this.landmark == '' || this.house == '' || this.pincode == '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    const geocoder = new google.maps.Geocoder;
    geocoder.geocode({ address: this.house + ' ' + this.landmark + ' ' + this.address + ' ' + this.pincode }, (results: any, status: any) => {
      console.log(results, status);
      if (status == 'OK' && results && results.length) {
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        console.log('----->', this.lat, this.lng);
        console.log('call api');
        this.util.start();
        const param = {
          uid: localStorage.getItem('uid'),
          address: this.address,
          lat: this.lat,
          lng: this.lng,
          title: this.title,
          house: this.house,
          landmark: this.landmark,
          pincode: this.pincode
        };
        this.api.post_private('v1/address/save', param).then((data: any) => {
          this.util.stop();

          if (data && data.status == 200) {
            this.getAddress();
            const Toast = Swal.mixin({
              toast: true,
              position: 'bottom-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true
            });

            Toast.fire({
              icon: 'success',
              title: this.util.translate('Address added')
            });
          } else {
            this.util.errorToast(this.util.translate('Something went wrong'));
          }
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.errorToast(this.util.translate('Something went wrong'));
        });
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
        return false;
      }
    });
  }

  onSearchChange(event: any) {
    console.log(event);
    if (this.query == '') {
      this.autocompleteItems1 = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.query }, (predictions: any, status: any) => {
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
    this.query = item.description;
    this.geocoder.geocode({ placeId: item.place_id }, (results: any, status: any) => {
      if (status == 'OK' && results[0]) {
        console.log(status);
        this.address = this.query;
        this.lat = results[0].geometry.location.lat();
        this.lng = results[0].geometry.location.lng();
        this.changedPlace.hide();
        this.addressFromMap.show();
        this.cd.detectChanges();
        this.loadMap(this.lat, this.lng);
      }
    });
  }

  getTime(time: any) {
    return moment(time).format('LLLL');
  }

  selectedOffers(item: any) {
    if (this.cart && this.cart.walletDiscount && this.cart.walletDiscount > 0) {
      this.util.errorToast(this.util.translate('Sorry you have already added a wallet discount to cart'));
      return false;
    }
    console.log(item, this.cart.cartStoreInfo);
    console.log(this.cart.cart[0].restId);
    if (item && item.available && item.available.length) {
      const data = item.available.includes(this.cart.cart[0].restId);
      console.log(data);
      if (data) {
        if (this.cart.totalPrice >= item.min) {
          console.log('ok');
          localStorage.setItem('selectedOffer', JSON.stringify(item));
          this.offersModal.hide();
          this.util.successToast(this.util.translate('Coupon Applied'));
          this.util.publishCoupon(item);
        } else {
          this.util.errorToast(this.util.translate('For claiming this coupon your order required minimum order of') + ' ' + this.util.appSettings.currencySymbol + ' ' + item.min);
        }
      } else {
        this.util.errorToast(this.util.translate('This coupon is not valid for') + ' ' + this.cart.cartStoreInfo.name);
      }
    } else {
      this.util.errorToast(this.util.translate('This coupon is not valid for') + ' ' + this.cart.cartStoreInfo.name);
    }
  }

  selectPaymentMethod(id: any) {
    this.paymentId = id;
    if (this.paymentId == 1) {
      this.payMethodName = 'cod';
    } else if (this.paymentId == 2) {
      this.payMethodName = 'stripe';
    } else if (this.paymentId == 3) {
      this.payMethodName = 'paypal';
    } else if (this.paymentId == 4) {
      this.payMethodName = 'paytm';
    } else if (this.paymentId == 5) {
      this.payMethodName = 'razorpay';
    } else if (this.paymentId == 6) {
      this.payMethodName = 'instamojo';
    } else if (this.paymentId == 7) {
      this.payMethodName = 'paystack';
    } else if (this.paymentId == 8) {
      this.payMethodName = 'flutterwave';
    }
  }

  onCheckout() {
    this.confirmModal.hide();
    if (this.paymentId == 1) {
      // COD
      this.createOrder('COD');
    } else if (this.paymentId == 2) {
      // Stripe
      this.stripeModal.show();
    } else if (this.paymentId == 3) {
      this.payPalWebPay();
    } else if (this.paymentId == 4) {
      this.payTmWeb();
    } else if (this.paymentId == 5) {
      this.razoryPayWeb();
    } else if (this.paymentId == 6) {
      this.payWithInstaMOJOWeb();
    } else if (this.paymentId == 7) {
      this.paystackWeb();
    } else if (this.paymentId == 8) {
      this.flutterwaveWeb();
    }
  }

  flutterwaveWeb() {
    this.util.start();
    this.api.get_private('v1/getFlutterwaveKey').then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status == 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id == this.paymentId);
        console.log(payMethod);
        FlutterwaveCheckout({
          public_key: data.data,
          tx_ref: '' + Math.floor((Math.random() * 1000000000) + 1),
          amount: this.cart.grandTotal,
          currency: payMethod[0].currency_code,
          payment_options: 'card, mobilemoneyghana, ussd',

          meta: {
            consumer_id: 23,
            consumer_mac: '92a3-912ba-1192a',
          },
          customer: {
            email: this.getEmail(),
            phone_number: localStorage.getItem('mobile'),
            name: this.getName(),
          },
          callback: (data: any) => {
            console.log(data);
            document.getElementsByName('checkout')[0].setAttribute('style',
              'position:fixed;top:0;left:0;z-index:-1;border:none;opacity:0;pointer-events:none;width:100%;height:100%;');
            document.body.style.overflow = '';
            this.createOrder
              (JSON.stringify(data));
          },
          onclose: (data: any) => {
            console.log('closed', data);
          },
          customizations: {
            title: this.util.generalSettings.name,
            description: this.util.generalSettings.name + ' Order',
            logo: this.api.mediaURL + this.util.appSettings.logo,
          },
        });


      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    });

  }

  paystackWeb() {
    this.util.start();
    this.api.get_private('v1/getPaystackKey').then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status == 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id == this.paymentId);
        console.log(payMethod);
        const handler = PaystackPop.setup({
          key: data.data,
          currency: payMethod[0].currency_code,
          email: this.getEmail(),
          amount: this.cart.grandTotal * 100,
          firstname: this.getFirstName(),
          lastname: this.getLastName(),
          ref: '' + Math.floor((Math.random() * 1000000000) + 1),
          onClose: () => {
            console.log('closed');
          },
          callback: (response: any) => {
            console.log(response);
            // response.reference
            this.createOrder
              (response.reference);
          }
        });
        handler.openIframe();
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    });
  }

  getFirstName() {
    return this.util && this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name : 'Foodies';
  }

  getLastName() {
    return this.util && this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.last_name : 'Foodies';
  }

  payWithInstaMOJOWeb() {
    const param = {
      address: JSON.stringify(this.cart.deliveryAddress),
      applied_coupon: this.cart.coupon && this.cart.coupon.discount ? 1 : 0,
      coupon_id: this.cart.coupon && this.cart.coupon.discount ? this.cart.coupon.id : 0,
      pay_method: this.paymentId,
      did: 0,
      delivery_charge: this.cart.deliveryPrice,
      discount: this.cart.coupon && this.cart.coupon.discount ? this.cart.coupon.discount : 0,
      grand_total: this.cart.grandTotal,
      orders: JSON.stringify(this.cart.cart),
      paid: 'NA',
      restId: this.cart.cartStoreInfo.uid,
      serviceTax: this.cart.orderTax,
      status: 'pending',
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      total: this.cart.totalPrice,
      uid: localStorage.getItem('uid'),
      notes: this.orderNotes != '' && this.orderNotes != null ? this.orderNotes : 'NA',
      extra_field: "NA",
      wallet_used: this.walletCheck == true && this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price:
        this.walletCheck == true && this.cart.walletDiscount > 0 ? this.cart.walletDiscount : 0,
    }
    this.util.start();
    this.api.post_private('v1/orders/save', param).then((data: any) => {
      this.util.stop();
      console.log(data);
      if (data && data.status == 200) {
        var orderId = data.data.id;
        const param = {
          allow_repeated_payments: 'False',
          amount: this.cart.grandTotal,
          buyer_name: this.getName(),
          purpose: this.util.generalSettings.name + ' ' + this.util.translate('Orders'),
          redirect_url: this.api.baseUrl + 'v1/instaMOJOWebSuccess?id=' + orderId,
          phone: this.util && this.util.userInfo && this.util.userInfo.mobile && this.util.userInfo.mobile != null ? this.util.userInfo.mobile : '',
          send_email: 'True',
          webhook: this.api.baseUrl,
          send_sms: 'True',
          email: this.getEmail()
        };

        this.util.start();
        this.api.post_private('v1/payments/instamojoPay', param).then((data: any) => {
          console.log('instamojo response', data);
          this.util.stop();
          if (data && data.status && data.status == 200 && data.success && data.success.success == true) {


            const navParma: NavigationExtras = {
              queryParams: {
                id: orderId,
                payLink: data.success.payment_request.longurl
              }
            }
            this.cart.clearCart();

            this.router.navigate(['/await-payments'], navParma);

          } else {
            const error = JSON.parse(data.error);
            console.log('error message', error);
            if (error && error.message) {
              this.util.errorToast(error.message);
              return false;
            }
            this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
          }
        }, error => {
          console.log(error);
          this.util.stop();
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }).catch(error => {
          console.log(error);
          this.util.stop();
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        });
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }

  razoryPayWeb() {
    this.util.start();
    this.api.get_private('v1/getRazorPayKey').then((data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status == 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id == this.paymentId);
        console.log(payMethod);

        var options = {
          amount: this.cart.grandTotal ? this.cart.grandTotal * 100 : 5,
          email: this.getEmail(),
          logo: this.util && this.util.appSettings.logo ? this.api.mediaURL + this.util.appSettings.logo : 'null',
          name: this.getName(),
          app_color: '#f47878',
          key: data.data, // Enter the Key ID generated from the Dashboard
          currency: payMethod[0].currency_code,
          description: this.util.generalSettings.name + ' ' + this.util.translate('Order Of') + ' ' + this.cart.grandTotal + ' ' + this.util.translate('amount'),

          handler: (response: any) => {
            console.log(response);
            this.verifyPurchaseRazorPay(response.razorpay_payment_id);
          }
        };
        console.log(options);
        var rzp1 = new Razorpay(options);
        rzp1.open();
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  verifyPurchaseRazorPay(paymentId: any) {
    this.util.start();
    this.api.get_private('v1/payments/VerifyRazorPurchase?id=' + paymentId).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.success && data.success.status && data.success.status == 'captured') {
        this.util.stop();
        this.createOrder
          (JSON.stringify(data.success));
      } else {
        this.util.stop();
        this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    });
  }

  getName() {
    return this.util && this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' +
      this.util.userInfo.last_name : 'Foodies';
  }

  getEmail() {
    return this.util && this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@initappz.com';
  }

  async payTmWeb() {
    const param = {
      address: JSON.stringify(this.cart.deliveryAddress),
      applied_coupon: this.cart.coupon && this.cart.coupon.discount ? 1 : 0,
      coupon_id: this.cart.coupon && this.cart.coupon.discount ? this.cart.coupon.id : 0,
      pay_method: this.paymentId,
      did: 0,
      delivery_charge: this.cart.deliveryPrice,
      discount: this.cart.coupon && this.cart.coupon.discount ? this.cart.coupon.discount : 0,
      grand_total: this.cart.grandTotal,
      orders: JSON.stringify(this.cart.cart),
      paid: 'NA',
      restId: this.cart.cartStoreInfo.uid,
      serviceTax: this.cart.orderTax,
      status: 'pending',
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      total: this.cart.totalPrice,
      uid: localStorage.getItem('uid'),
      notes: this.orderNotes != '' && this.orderNotes != null ? this.orderNotes : 'NA',
      extra_field: "NA",
      wallet_used: this.walletCheck == true && this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price:
        this.walletCheck == true && this.cart.walletDiscount > 0 ? this.cart.walletDiscount : 0,
    }
    this.util.start();
    this.api.post_private('v1/orders/save', param).then((data: any) => {
      this.util.stop();
      console.log(data);
      if (data && data.status == 200) {
        const navParma: NavigationExtras = {
          queryParams: {
            id: data.data.id,
            payLink: this.api.baseUrl + 'v1/payNowWeb?amount=' + this.cart.grandTotal + '&standby_id=' + data.data.id
          }
        }
        this.cart.clearCart();
        this.router.navigate(['/await-payments'], navParma);
        // this.successModal.show();
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }

  payPalWebPay() {
    this.util.start();
    this.api.get_private('v1/getPayPalKey').then(async (data: any) => {
      console.log(data);
      this.util.stop();
      if (data && data.status && data.status == 200 && data.data) {
        const payMethod = this.payments.filter(x => x.id == this.paymentId);
        console.log(payMethod);
        this.payPalModal.show();
        this.initConfig(payMethod[0].currency_code, data.data);
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  private initConfig(code: any, clientId: any): void {
    this.payPalConfig = {
      currency: code,
      clientId: clientId,
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: code,
            value: this.cart.grandTotal,
            breakdown: {
              item_total: {
                currency_code: code,
                value: this.cart.grandTotal
              }
            }
          },
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then((details: any) => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);

        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.payPalModal.hide();
        this.createOrder
          (JSON.stringify(data));

      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  async createOrder(payKey: any) {
    const param = {
      address: JSON.stringify(this.cart.deliveryAddress),
      applied_coupon: this.cart.coupon && this.cart.coupon.discount ? 1 : 0,
      coupon_id: this.cart.coupon && this.cart.coupon.discount ? this.cart.coupon.id : 0,
      pay_method: this.paymentId,
      did: 0,
      delivery_charge: this.cart.deliveryPrice,
      discount: this.cart.coupon && this.cart.coupon.discount ? this.cart.coupon.discount : 0,
      grand_total: this.cart.grandTotal,
      orders: JSON.stringify(this.cart.cart),
      paid: payKey,
      restId: this.cart.cartStoreInfo.uid,
      serviceTax: this.cart.orderTax,
      status: 'created',
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      total: this.cart.totalPrice,
      uid: localStorage.getItem('uid'),
      notes: this.orderNotes != '' && this.orderNotes != null ? this.orderNotes : 'NA',
      extra_field: "NA",
      wallet_used: this.walletCheck == true && this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price:
        this.walletCheck == true && this.cart.walletDiscount > 0 ? this.cart.walletDiscount : 0,
    };

    console.log('param----->', param);

    this.util.start();
    this.api.post_private('v1/orders/save', param).then((data: any) => {
      console.log(data);
      this.util.stop();
      this.orderNotes = '';
      this.sendNotification();
      this.cart.clearCart();
      this.successModal.show();
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

  sendNotification() {
    const param = {
      title: this.util.translate('New Order Received'),
      message: this.util.translate('You have received new order'),
      id: this.storeFCM
    };
    this.api.post_private('v1/notification/sendNotification', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch((error: any) => {
      console.log(error);
    });
  }

  onOrderHistory() {
    const name = (this.util.userInfo.first_name + '-' + this.util.userInfo.last_name).toLowerCase();
    this.router.navigate(['user', name, 'order']);
  }

  onHome() {
    this.successModal.hide()
    this.router.navigateByUrl('/');
  }

  getWalletAmount() {
    this.api.post_private('v1/users/getMyWalletBalance', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log('------------------', data);
      if (data && data.status && data.status == 200 && data.data) {
        this.balance = parseFloat(data.data.balance);
        this.walletDiscount = parseFloat(data.data.balance);
        console.log(this.balance, this.walletDiscount);
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  walletChange() {
    if (this.balance <= 0 || this.cart.coupon) {
      return false;
    }
    console.log('ok');
    this.walletCheck = !this.walletCheck;
    if (this.walletCheck == true) {
      if (this.cart && this.cart.coupon && this.cart.coupon.id) {
        this.util.errorToast(this.util.translate('Sorry you have already added a offers discount to cart'));
        this.walletCheck = false;
        return false;
      }
      this.cart.walletDiscount = parseFloat(this.balance);
      this.cart.calcuate();
    } else {
      this.cart.walletDiscount = 0;
      this.cart.calcuate();
    }
  }

  saveCard(id: any) {
    this.selectedCard = id;
  }

  addNewCard() {
    this.stripeModal.hide();
    this.addCardModal.show();
  }

  getStripeCard() {
    this.api.post_private('v1/payments/getStripeCards', { "id": this.stripeKey }).then((data: any) => {
      console.log(data);
      if (data && data.status == 200) {
        this.stripeCardList = data.success.data;
        console.log(this.stripeCardList);
      }
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  createPayment() {
    if (this.selectedCard != '') {
      this.stripeModal.hide();
      this.makePayment();
    }
    else {
      this.util.errorToast(this.util.translate('Please Select Card'));
    }
  }

  makePayment() {
    var savedPayment = this.payments.filter(x => x.id == this.paymentId);
    console.log(savedPayment);
    if (savedPayment.length > 0) {
      var param = {
        'amount': parseInt(this.cart.grandTotal) * 100,
        'currency': savedPayment[0].currency_code,
        'customer': this.stripeKey,
        'card': this.selectedCard
      };

      this.util.start();

      this.api.post_private('v1/payments/createStripePayments', param).then((data: any) => {
        this.util.stop();
        console.log(data);
        if (data && data.status == 200 && data.success && data.success.id) {
          this.createOrder
            (JSON.stringify(data.success));
          this.cart.clearCart();

        }

      }, error => {
        console.log(error);
        this.util.stop();
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.stop();
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    }
  }

  submitData() {
    console.log(this.expiryDate);
    if (this.cardNumber == '' || this.cvv == '' ||
      this.expiryDate == '' || this.cardHolderName == '' || this.cardEmail == '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    const year = this.expiryDate.split('/')[1];
    const month = this.expiryDate.split('/')[0];
    const param = {
      'number': this.cardNumber,
      'exp_month': month,
      'exp_year': year,
      'cvc': this.cvv,
      'email': this.cardEmail
    };
    this.util.start();
    console.log("constant", param);
    this.api.post_private('v1/payments/createStripeToken', param).then((data: any) => {
      console.log(data);
      this.util.stop();//
      // stripe key
      if (data && data.status && data.status == 200 && data.success && data.success.id) {
        if (this.stripeKey != '' && this.stripeKey && this.stripeKey != null) {
          this.addStripe(data.success.id);
        }
        else {
          this.createCustomer(data.success.id);
        }
      } else {
        this.util.errorToast(this.util.translate('Something went wrong'));
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  addStripe(id: any) {
    const param = {
      "token": id,
      "id": this.stripeKey,
    }
    this.util.start();
    this.api.post_private('v1/payments/addStripeCards', param).then((data: any) => {
      this.util.successToast('Card Information Saved');
      this.util.stop();
      this.addCardModal.hide();
      this.stripeModal.show();
      this.getStripeCard();
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  createCustomer(id: any) {

    this.util.start();
    const param = { 'email': this.cardEmail, 'source': id };
    this.api.post_private('v1/payments/createCustomer', param).then((data: any) => {
      this.util.stop();
      console.log('customer id', data);
      if (data && data.status == 200) {
        this.stripeKey = data.success.id;
        this.updateUserStripeKey(data.success.id);
      }
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  updateUserStripeKey(id: any) {
    const param = { 'id': localStorage.getItem('uid'), 'stripe_key': id };
    this.util.start();
    this.api.post_private('v1/profile/update', param).then((data: any) => {
      this.util.successToast(this.util.translate('Card Information Saved'));
      this.addCardModal.hide();
      this.stripeModal.show();
      this.getStripeCard();
    }, error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.util.stop();
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }
}
