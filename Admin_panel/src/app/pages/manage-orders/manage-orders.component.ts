/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit {
  id: any = '';
  grandTotal: any = '';
  orders: any[] = [];
  serviceTax: any = '';
  status: any = '';
  time: any = '';
  total: any = '';
  uid: any = '';
  address: any = '';
  restName: any = '';
  deliveryAddress: any = '';
  paid: any = '';
  restPhone: any = '';
  coupon: boolean = false;
  dicount: any = '';
  dname: any = '';
  restCover: any = '';
  username: any = '';
  userpic: any = '';
  userAddress: any = '';
  paymentRef: any;
  payName: any = '';
  changeStatusOrder: any;
  orderStatus: any = '';
  userFCM: any = '';
  payment = [
    this.util.translate('NA'),
    this.util.translate('COD'),
    this.util.translate('Stripe'),
    this.util.translate('PayPal'),
    this.util.translate('Paytm'),
    this.util.translate('Razorpay'),
    this.util.translate('Instamojo'),
    this.util.translate('Paystack'),
    this.util.translate('Flutterwave')
  ];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private navCtrl: Location
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getOrderDetails();
      }
    });
  }

  ngOnInit(): void {
  }

  getOrderDetails() {
    this.util.show();
    this.api.post_private('v1/orders/getOrderDetailsAdmin', { id: this.id }).then((datas: any) => {
      console.log(datas);
      this.util.hide();
      if (datas && datas.status && datas.status == 200 && datas.data) {
        const data = datas.data;
        this.grandTotal = data.grand_total;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(data.orders)) {
          this.orders = JSON.parse(data.orders);
        }
        this.serviceTax = data.serviceTax;
        this.status = data.status;
        this.time = data.time;

        this.restCover = data.store_cover;
        this.total = data.total;
        this.address = data.store_address;
        this.restName = data.store_name;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(data.address)) {
          const addr = JSON.parse(data.address);
          console.log(addr);
          this.deliveryAddress = addr.house + ' ' + addr.landmark + ' ' + addr.address + ' ' + addr.pincode;
          this.userAddress = addr.house + ' ' + addr.landmark + ' ' + addr.address + ' ' + addr.pincode;
        }
        this.paid = data.pay_method;
        this.paymentRef = data.paid;
        console.log('this', this.orders);
        this.coupon = data.applied_coupon == 0 ? false : true;
        this.dicount = data.discount;
        this.username = data.user_first_name + ' ' + data.user_last_name;
        this.userFCM = data.user_fcm_token;
        this.userpic = data.user_cover;
        this.payName = this.payment[data.pay_method];
        this.orderStatus = data.status;
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

  refundStripe() {
    console.log('refund stripe');
    console.log(this.paymentRef);
    const ref = JSON.parse(this.paymentRef);
    console.log('ref=>', ref);
    if (ref && ref.id) {
      const param = {
        charge_id: ref.id,
      };
      this.util.show();
      this.api.post_private('v1/payments/refundStripePayments', param).then((data: any) => {
        console.log(data);
        if (data && data.status && data.status == 200) {
          this.refundOrder();
        } else {
          this.util.hide();
          this.util.apiErrorHandler(data);
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
  }

  refundPayPal() {
    console.log('refund paypal');
    console.log(this.paymentRef);
    const ref = JSON.parse(this.paymentRef);
    console.log('ref=>', ref);
    let id;
    if (ref && ref.key) {
      id = ref.key;
    } else if (ref && ref.intent && ref.intent == 'CAPTURE') {
      id = ref.purchase_units[0].payments.captures[0].id;
    }
    console.log('transactional id', id);

    const param = {
      ref: id,
      amount: this.grandTotal
    }
    console.log('param', param);
    this.util.show();
    this.api.post_private('v1/payments/payPalRefund', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.refundOrder();
      } else {
        this.util.hide();
        this.util.apiErrorHandler(data);
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

  refundPayTM() {
    console.log('refund paytm');
    console.log(this.paymentRef);
    const ref = JSON.parse(this.paymentRef);
    console.log('ref=>', ref);
    let key;
    let txtId;
    if (ref && ref.key && ref.txtId) {
      key = ref.key;
      txtId = ref.txtId;
      const param = {
        id: key,
        txt_id: txtId,
        amount: this.grandTotal
      };
      this.util.show();
      this.api.post_private('v1/payments/paytmRefund', param).then((data: any) => {
        console.log(data);
        if (data && data.status && data.status == 200) {
          this.refundOrder();
        } else {
          this.util.hide();
          this.util.apiErrorHandler(data);
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
  }

  refundRazorPay() {
    console.log('refund razorpay');
    console.log(this.paymentRef);
    const ref = JSON.parse(this.paymentRef);
    console.log('ref=>', ref);
    if (ref && ref.id) {
      const param = {
        id: ref.id
      }
      this.util.show();
      this.api.post_private('v1/payments/razorPayRefund', param).then((data: any) => {
        console.log(data);
        if (data && data.status && data.status == 200) {
          this.refundOrder();
        } else {
          this.util.hide();
          this.util.apiErrorHandler(data);
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
      //
    }
  }

  refundInstaMOJO() {
    console.log('refund instamojo');
    console.log(this.paymentRef);

    let key;
    if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(this.paymentRef)) {
      const ref = JSON.parse(this.paymentRef);
      console.log('ref=>', ref);
      key = ref.payment_id;
    } else {
      key = this.paymentRef;
    }

    console.log('key', key);
    const param = {
      id: key
    }
    this.util.show();
    this.api.post_private('v1/payments/instaMOJORefund', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.refundOrder();
      } else {
        this.util.hide();
        this.util.apiErrorHandler(data);
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

  refundPayStack() {
    console.log('refund paystack');
    const param = {
      id: this.paymentRef
    }
    this.util.show();
    this.api.post_private('v1/payments/refundPayStack', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.refundOrder();
      } else {
        this.util.hide();
        this.util.apiErrorHandler(data);
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

  refundFlutterwave() {
    console.log('refund flutterwave');
    console.log(this.paymentRef);
    const ref = JSON.parse(this.paymentRef);
    console.log('ref=>', ref);
    let id;
    if (ref && ref.orderId) {
      id = ref.orderId;
    } else if (ref && ref.transaction_id) {
      id = ref.transaction_id;
    }
    console.log('transactional id', id);
    const param = {
      ref: id,
      amount: this.grandTotal
    }
    console.log('param', param);
    this.util.show();
    this.api.post_private('v1/payments/refundFlutterwave', param).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200) {
        this.refundOrder();
      } else {
        this.util.hide();
        this.util.apiErrorHandler(data);
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

  refundPaykun() {
    console.log('refund paykun');
  }

  changeOrderStatus() {
    console.log(this.changeStatusOrder);
    console.log('stauts', this.orderStatus);
    console.log('paid with', this.payName);
    if (this.changeStatusOrder == 'refund') {
      console.log('refund with API');
      if (this.payName == 'Stripe') {
        this.refundStripe();
      } else if (this.payName == 'PayPal') {
        this.refundPayPal();
      } else if (this.payName == 'Paytm') {
        this.refundPayTM();
      } else if (this.payName == 'Razorpay') {
        this.refundRazorPay();
      } else if (this.payName == 'Instamojo') {
        this.refundInstaMOJO();
      } else if (this.payName == 'Paystack') {
        this.refundPayStack();
      } else if (this.payName == 'Flutterwave') {
        this.refundFlutterwave();
      } else if (this.payName == '9') {
        this.refundPaykun();
      }
    } else {
      console.log('refund with merchant');
      this.refundOrder();
    }
  }

  refundOrder() {
    this.util.show();
    const param = {
      id: this.id,
      status: 'refunded',
    };
    this.api.post_private('v1/orders/updateStatusAdmin', param).then((data: any) => {
      console.log('order', data);
      this.util.hide();
      if (data && data.status == 200) {
        this.sendNotification();
        this.back();
      } else {
        this.util.apiErrorHandler(data);
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });
  }

  sendNotification() {
    const param = {
      title: this.util.translate('Order refunded'),
      message: this.util.translate('Your order is rejected by store your refund amount will be credited within 2-3 bussiness days'),
      id: this.userFCM
    };
    this.api.post_private('v1/notification/sendNotification', param).then((data: any) => {
      console.log(data);
    }, error => {
      console.log(error);
    }).catch(error => {
      console.log(error);
    });
  }

  back() {
    this.navCtrl.back();
  }

  printOrder() {
    const param = {
      id: this.id,
      token: localStorage.getItem('token')
    };
    const url = this.api.baseUrl + 'v1/orders/printInvoice?' + this.api.JSON_to_URLEncoded(param);
    window.open(url, '_system');
  }
}
