/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import swal from 'sweetalert2';
import { StripePaymentsPage } from '../stripe-payments/stripe-payments.page';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {
  payments: any[] = [];
  paymentAPICalled: boolean = false;

  pay_method: any = '';
  payMethodName: any = '';

  balance: any = 0;
  walletCheck: boolean = false;
  payName: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    public cart: CartService,
    private modalController: ModalController,
    private iab: InAppBrowser,
  ) {
    this.getPayments();
    this.getWallet();
  }

  ngOnInit() {
  }

  getPayments() {
    this.payments = [];
    this.paymentAPICalled = false;
    this.api.get_private('v1/payments/getPayments').then((data: any) => {
      console.log('payments->', data);
      this.paymentAPICalled = true;
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        this.payments = data.data;
      }
    }, error => {
      console.log(error);
      this.paymentAPICalled = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.paymentAPICalled = true;
      this.util.apiErrorHandler(error);
    });
  }

  getWallet() {
    this.api.post_private('v1/users/getMyWalletBalance', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        this.balance = parseFloat(data.data.balance);
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  walletChange(event: any) {
    console.log(event, event.detail.checked);
    if (event && event.detail && event.detail.checked == true) {
      if (this.cart && this.cart.coupon && this.cart.coupon.id) {
        this.util.errorToast('Sorry you have already added a offers discount to cart');
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

  paymentChange() {
    const payMethod = this.payments.filter(x => x.id == this.pay_method);
    console.log(payMethod);
    if (payMethod && payMethod.length) {
      this.payName = payMethod[0].name;
      console.log('---->', this.payName);
    }
  }

  onBack() {
    this.util.onBack();
  }

  goToTrack() {
    console.log(this.pay_method);
    swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('Orders once placed cannot be cancelled and are non-refundable'),
      icon: 'question',
      confirmButtonText: this.util.translate('Yes'),
      cancelButtonText: this.util.translate('Cancel'),
      showCancelButton: true,
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        console.log('go to procesed,,');
        if (this.pay_method == 1) {
          console.log('cod');
          this.payMethodName = 'cod';
          this.createOrder('cod');
        } else if (this.pay_method == 2) {
          console.log('stripe');
          this.payMethodName = 'stripe';
          this.stripePayment();
        } else if (this.pay_method == 3) {
          console.log('paypal');
          this.payMethodName = 'paypal';
          this.payWithPayPal();
        } else if (this.pay_method == 4) {
          console.log('paytm');
          this.payMethodName = 'paytm';
          this.payWithPayTm();
        } else if (this.pay_method == 5) {
          console.log('razorpay');
          this.payMethodName = 'razorpay';
          this.payWithRazorPay();
        } else if (this.pay_method == 6) {
          console.log('instamojo');
          this.payMethodName = 'instamojo';
          this.paywithInstaMojo();
        } else if (this.pay_method == 7) {
          console.log('paystack');
          this.payMethodName = 'paystack';
          this.paystackPay();
        } else if (this.pay_method == 8) {
          console.log('flutterwave');
          this.payMethodName = 'flutterwave';
          this.payWithFlutterwave();
        } else if (this.pay_method == 9) {
          console.log('paykun');
        }
      }
    });
  }

  async stripePayment() {
    const payMethod = this.payments.filter(x => x.id == this.pay_method);
    console.log(payMethod);
    const modal = await this.modalController.create({
      component: StripePaymentsPage,
      componentProps: { currency_code: payMethod[0].currency_code }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data.data, data.role);
      if (data && data.role && data.role == 'done') {
        this.createOrder(data.data);
      }
    });
    await modal.present();
  }

  async payWithPayPal() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const browser = this.iab.create(this.api.baseUrl + 'v1/payments/payPalPay?amount=' + this.cart.grandTotal, '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      console.log(navUrl.includes('success_payments'), navUrl.includes('failed_payments'));
      if (navUrl.includes('success_payments') || navUrl.includes('failed_payments')) {
        browser.close();
        if (navUrl.includes('success_payments')) {
          const urlItems = new URL(event.url);
          console.log(urlItems);
          const orderId = urlItems.searchParams.get('pay_id');
          const param = {
            key: orderId,
          };
          this.createOrder(JSON.stringify(param));
        } else {
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }
      }
    });
    console.log('browser=> end');
  }

  async payWithPayTm() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const browser = this.iab.create(this.api.baseUrl + 'v1/payNow?amount=' + this.cart.grandTotal, '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      console.log(navUrl.includes('success_payments'), navUrl.includes('failed_payments'));
      if (navUrl.includes('success_payments') || navUrl.includes('failed_payments')) {
        browser.close();
        if (navUrl.includes('success_payments')) {
          const urlItems = new URL(event.url);
          console.log(urlItems);
          const orderId = urlItems.searchParams.get('id');
          const txt_id = urlItems.searchParams.get('txt_id');
          const param = {
            key: orderId,
            txtId: txt_id
          };
          this.createOrder(JSON.stringify(param));
        } else {
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }
      }
    });
    console.log('browser=> end');
  }

  async payWithRazorPay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      amount: this.cart.grandTotal ? (this.cart.grandTotal * 100).toFixed() : 5,
      email: this.getEmail(),
      logo: this.util && this.util.appSettings.logo ? this.api.mediaURL + this.util.appSettings.logo : 'null',
      name: this.getName(),
      app_color: '#ff384c'
    }
    const browser = this.iab.create(this.api.baseUrl + 'v1/payments/razorPay?' + this.api.JSON_to_URLEncoded(param), '_blank', options);
    console.log('opended');
    console.log('browser=>');
    browser.on('loadstop').subscribe(event => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_payments')) {
        const urlItems = new URL(event.url);
        console.log(urlItems);
        const orderId = urlItems.searchParams.get('pay_id');
        if (orderId && orderId != null) {
          this.verifyPurchaseRazorPay(orderId);
        } else {
          const orderId = urlItems.searchParams.get('key_id');
          this.verifyPurchaseRazorPay(orderId);
        }
      }
      if (navUrl.includes('status=authorized') || navUrl.includes('status=failed') || navUrl.includes('redirect_callback')) {
        console.log('close here');
        browser.close();
        const urlItems = new URL(event.url).pathname;
        console.log('--->>', urlItems.split('/'), urlItems.split('/').length, urlItems.split('/')[3]);
        if (urlItems.split('/').length >= 5 && urlItems.split('/')[3].startsWith('pay_')) {
          const paymentId = urlItems.split('/')[3];
          console.log('paymentId', paymentId);
          this.verifyPurchaseRazorPay(paymentId);
        }
      }
    });
    console.log('browser=> end');
  }

  getName() {
    return this.util.userInfo && this.util.userInfo.first_name ? this.util.userInfo.first_name + ' ' + this.util.userInfo.last_name : 'Foodies';
  }

  getEmail() {
    return this.util.userInfo && this.util.userInfo.email ? this.util.userInfo.email : 'info@foodies.com';
  }

  verifyPurchaseRazorPay(paymentId: any) {
    this.util.show();
    this.api.get_private('v1/payments/VerifyRazorPurchase?id=' + paymentId).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.success && data.success.status && data.success.status == 'captured') {
        this.util.hide();
        this.createOrder(JSON.stringify(data.success));
      } else {
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
    });
  }

  async paywithInstaMojo() {
    const param = {
      allow_repeated_payments: 'False',
      amount: this.cart.grandTotal,
      buyer_name: this.getName(),
      purpose: this.util.generalSettings.name + ' Orders',
      redirect_url: this.api.baseUrl + 'v1/success_payments',
      phone: this.util.userInfo && this.util.userInfo.mobile ? this.util.userInfo.mobile : '',
      send_email: 'True',
      webhook: this.api.baseUrl,
      send_sms: 'True',
      email: this.getEmail()
    };

    this.util.show();
    this.api.post_private('v1/payments/instamojoPay', param).then((data: any) => {
      console.log('instamojo response', data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.success && data.success.success == true) {
        const options: InAppBrowserOptions = {
          location: 'no',
          clearcache: 'yes',
          zoom: 'yes',
          toolbar: 'yes',
          closebuttoncaption: 'close'
        };
        const browser: any = this.iab.create(data.success.payment_request.longurl, '_blank', options);
        browser.on('loadstop').subscribe((event: any) => {
          const navUrl = event.url;
          console.log('navURL', navUrl);
          if (navUrl.includes('success_payments')) {
            browser.close();
            const urlItems = new URL(event.url);
            console.log(urlItems);
            const orderId = urlItems.searchParams.get('payment_id');
            console.log(orderId);
            this.createOrder(orderId);
          }
        });
      } else {
        const error = JSON.parse(data.error);
        console.log('error message', error);
        if (error && error.message) {
          this.util.showToast(error.message, 'danger', 'bottom');
          return false;
        }
        this.util.apiErrorHandler(error);
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  async paystackPay() {
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const paykey = '' + Math.floor((Math.random() * 1000000000) + 1);
    const param = {
      email: this.util.userInfo.email,
      amount: (this.cart.grandTotal * 100).toFixed(),
      first_name: this.util.userInfo.first_name,
      last_name: this.util.userInfo.last_name,
      ref: paykey
    }
    console.log('to url==>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'v1/payments/paystackPay?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe((event: any) => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success') || navUrl.includes('close')) {
        console.log('close');
        browser.close();
        if (navUrl.includes('success')) {
          console.log('closed---->>>>>')
          this.createOrder(paykey);
        } else {
          console.log('closed');
        }
      }
    });
  }

  async payWithFlutterwave() {
    const payMethod = this.payments.filter(x => x.id == this.pay_method);
    console.log(payMethod);
    const options: InAppBrowserOptions = {
      location: 'no',
      clearcache: 'yes',
      zoom: 'yes',
      toolbar: 'yes',
      closebuttoncaption: 'close'
    };
    const param = {
      amount: this.cart.grandTotal,
      email: this.getEmail(),
      phone: this.util.userInfo.mobile,
      name: this.getName(),
      code: payMethod[0].currency_code,
      logo: this.api.mediaURL + this.util.appSettings.logo,
      app_name: this.util.generalSettings.name
    }
    console.log('to url==>', this.api.JSON_to_URLEncoded(param))
    const url = this.api.baseUrl + 'v1/payments/flutterwavePay?' + this.api.JSON_to_URLEncoded(param);
    const browser: any = this.iab.create(url, '_blank', options);
    browser.on('loadstop').subscribe((event: any) => {
      console.log('event?;>11', event);
      const navUrl = event.url;
      if (navUrl.includes('success_payments') || navUrl.includes('failed_payments')) {
        console.log('close');
        browser.close();
        if (navUrl.includes('success_payments')) {
          const urlItems = new URL(event.url);
          const orderId = urlItems.searchParams.get('transaction_id');
          const txtId = urlItems.searchParams.get('tx_ref');
          const ord = {
            orderId: orderId,
            txtId: txtId
          }
          this.createOrder(JSON.stringify(ord));
        } else {
          this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
        }

      }
    });
  }

  async createOrder(payKey: any) {
    const param = {
      address: JSON.stringify(this.cart.deliveryAddress),
      applied_coupon: this.cart.coupon && this.cart.coupon.discount ? 1 : 0,
      coupon_id: this.cart.coupon && this.cart.coupon.discount ? this.cart.coupon.id : 0,
      pay_method: this.pay_method,
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
      notes: this.cart && this.cart.orderNotes != '' && this.cart.orderNotes != null ? this.cart.orderNotes : 'NA',
      extra_field: "NA",
      wallet_used: this.walletCheck == true && this.cart.walletDiscount > 0 ? 1 : 0,
      wallet_price:
        this.walletCheck == true && this.cart.walletDiscount > 0 ? this.cart.walletDiscount : 0,
    };

    console.log('param----->', param);

    this.util.show();
    this.api.post_private('v1/orders/save', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      this.cart.orderNotes = '';
      this.sendNotification();
      this.cart.clearCart();
      this.util.navigateRoot('success');
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

  sendNotification() {
    const param = {
      title: this.util.translate('New Order Received'),
      message: this.util.translate('You have received new order'),
      id: this.cart.storeFCM
    };
    this.api.post_private('v1/notification/sendNotification', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch((error: any) => {
      console.log(error);
    });
  }
}
