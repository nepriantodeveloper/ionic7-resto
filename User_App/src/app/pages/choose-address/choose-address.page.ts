/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { PopoverComponent } from 'src/app/components/popover/popover.component';
import { ApiService } from 'src/app/services/api.service';
import { CartService } from 'src/app/services/cart.service';
import { UtilService } from 'src/app/services/util.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-choose-address',
  templateUrl: './choose-address.page.html',
  styleUrls: ['./choose-address.page.scss'],
})
export class ChooseAddressPage implements OnInit {
  id: any = '';
  myaddress: any[] = [];
  from: any = '';
  selectedAddress: any;
  dummy: any[] = [];

  constructor(
    public api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    private popoverController: PopoverController,
    private cart: CartService
  ) {
    console.log('notes', this.cart.orderNotes);
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.from) {
        this.from = data.from;
      }
    });
    this.getAddress();
    this.util.getAddressObservable().subscribe((data) => {
      this.getAddress();
    });
  }

  ngOnInit() {

  }

  onBack() {
    this.util.onBack();
  }

  getAddress() {
    this.dummy = Array(5);
    this.myaddress = [];
    this.api.post_private('v1/address/getByUid', { "id": localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data) {
        this.myaddress = data.data;
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


  addNew() {
    this.util.navigateToPage('add-new-address');
  }

  async selectAddress() {
    if (this.from == 'cart') {
      console.log(this.util.generalSettings);
      console.log(this.cart.cartStoreInfo);
      const selected = this.myaddress.filter(x => x.id == this.selectedAddress);
      if (selected && selected.length && this.cart.cartStoreInfo && this.cart.cartStoreInfo.lat) {
        const item = selected[0];
        const distance = await this.distanceInKmBetweenEarthCoordinates(parseFloat(this.cart.cartStoreInfo.lat),
          parseFloat(this.cart.cartStoreInfo.lng), parseFloat(item.lat), parseFloat(item.lng));
        console.log('distance', distance);
        const permittedDistance = this.util.generalSettings.allowDistance;
        console.log('--', permittedDistance);
        if (distance <= permittedDistance) {
          console.log('distance is ok... you can order now');
          this.cart.deliveryAddress = item;
          this.cart.calcuate();
          this.util.navigateToPage('payments');
        } else {
          this.util.errorToast(this.util.translate('Distance between your address and restaurant address must be') + ' ' + permittedDistance + ' ' + this.util.translate('KM'));
        }
      }
    }
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

  async openMenu(item: any, events: any) {
    const popover = await this.popoverController.create({
      component: PopoverComponent,
      event: events,
      mode: 'ios',
    });
    popover.onDidDismiss().then(data => {
      console.log(data.data);
      if (data && data.data) {
        if (data.data == 'edit') {
          const param: NavigationExtras = {
            queryParams: {
              from: 'edit',
              data: item.id
            }
          };
          this.util.navigateToPage('add-new-address', param);
        } else if (data.data == 'delete') {
          console.log(item);
          Swal.fire({
            title: this.util.translate('Are you sure?'),
            text: this.util.translate('to delete this address'),
            icon: 'question',
            confirmButtonText: this.util.translate('Yes'),
            backdrop: false,
            background: 'white',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: this.util.translate('Cancel')
          }).then(data => {
            console.log(data);
            if (data && data.value) {
              this.util.show();
              this.api.post_private('v1/address/delete', { id: item.id }).then(info => {
                console.log(info);
                this.util.hide();
                this.getAddress();
              }, error => {
                console.log(error);
                this.util.hide();
                this.util.apiErrorHandler(error);
              }).catch((error) => {
                console.log(error);
                this.util.hide();
                this.util.apiErrorHandler(error);
              });
            }
          });

        }
      }
    });
    await popover.present();
  }
}
