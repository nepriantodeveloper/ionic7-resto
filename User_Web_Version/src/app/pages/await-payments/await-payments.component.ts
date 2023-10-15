/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'angular-bootstrap-md';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-await-payments',
  templateUrl: './await-payments.component.html',
  styleUrls: ['./await-payments.component.scss']
})
export class AwaitPaymentsComponent {
  @ViewChild('successModal') public successModal: ModalDirective;
  orderId: any;
  interval: any;
  confirmed: boolean = false;
  payLink: any;
  payClick: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    public util: UtilService,
    private zone: NgZone,
    private router: Router
  ) {
    this.util.changeIntevert().subscribe(() => {
      clearInterval(this.interval);
    })
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id && data.payLink) {
        this.orderId = data.id;
        this.payLink = data.payLink;
        this.interval = setInterval(() => {
          console.log('calling');
          if (this.confirmed == false) {
            this.getOrderStatus();
          }
        }, 5000);
      }
    });
  }

  async openBrowser() {

    this.payClick = true;
    await window.open(this.payLink, '_blank');
  }

  ngOnInit(): void {
  }

  getOrderStatus() {

    this.api.post_private('v1/orders/getById', { id: this.orderId }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200) {
        if (data && data.data && data.data.status == 'created') {
          this.confirmed = true;
          this.successModal.show();
        }
      }
    }).catch(error => {
      console.log(error);
      this.router.navigate(['']);
      this.util.errorToast(this.util.translate('Something went wrong while payments. please contact administrator'));
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
}
