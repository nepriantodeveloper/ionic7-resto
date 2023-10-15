/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { Location } from '@angular/common';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { ModalDirective } from 'angular-bootstrap-md';
declare var google: any;

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {
  @ViewChild('tracker') public tracker: ModalDirective;
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  id: any;
  grandTotal: any;
  orders: any[] = [];
  serviceTax: any;
  walletPrice: any = '';
  deliveryPrice: any = '';
  status: any;
  time: any;
  total: any;
  uid: any;
  address: any;
  restName: any;
  deliveryAddress: any;
  paid: any;
  restPhone: any;
  coupon: boolean = false;
  dicount: any;
  dname: any;
  loaded: boolean;
  restFCM: any;
  driverFCM: any;
  dId: any;
  driverName: any;
  driverMobile: any;
  driverCover: any;
  orderNotes: any = '';
  map: any;

  dName: any = '';
  restAddress: any = '';
  dCover: any = '';
  phone: any = '';
  totalOrders: any[] = [];
  payMethod: any;

  myLat: any;
  myLng: any;
  driverLat: any;
  driverLng: any;
  interval: any;
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    private router: Router,
    public util: UtilService,
    private navCtrl: Location
  ) {
    this.loaded = false;
    this.util.subscribeHeader().subscribe((data) => {
      console.log('leaved');
      this.closeInterval();
    });
    this.route.queryParams.subscribe((data: any) => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.getOrder();
      }
    });
  }

  closeInterval() {
    this.tracker.hide();
    clearInterval(this.interval);
  }

  ngOnInit() {

  }

  getOrder() {
    this.api.post_private('v1/orders/getById', { id: this.id }).then((datas: any) => {
      this.loaded = true;
      console.log(datas);
      if (datas && datas.status && datas.status == 200 && datas.data) {
        const data = datas.data;
        this.util.orderDetails = data;
        this.grandTotal = data.grand_total;
        this.serviceTax = data.serviceTax;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(data.orders)) {
          this.orders = JSON.parse(data.orders);
        }
        this.status = data.status;
        this.time = moment(data.time).format('llll');
        this.total = data.total;
        this.paid = data.pay_method;
        this.address = data.store_address;
        this.restName = data.store_name;

        this.coupon = data.applied_coupon == 1 ? true : false;
        this.dicount = data.discount;
        this.restPhone = data.store_mobile;
        this.restFCM = data.store_fcm_token;
        this.walletPrice = data.wallet_price;
        this.deliveryPrice = data.delivery_charge;
        if (data && data.address) {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(data.address)) {
            const add = JSON.parse(data.address);
            this.deliveryAddress = add.house + ' ' + add.landmark + ' ' + add.address + add.pincode;
            this.myLat = add.lat;
            this.myLng = add.lng;
          }
        }
        if (data && data.did && data.did != 0) {
          this.dId = data.did;
          this.getDriverInfo();
        }
        this.orderNotes = data.notes;
      } else {
        this.navCtrl.back();
      }
    }, error => {
      console.log('error in orders', error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log('error in order', error);
      this.loaded = true;
      this.util.apiErrorHandler(error);
    });
  }

  async presentAlertConfirm() {
    Swal.fire({
      title: this.util.translate('How was your experience?'),
      text: this.util.translate('Rate') + ' ' + this.restName + ' ' + this.util.translate('and') + ' ' + this.driverName,
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        console.log('ok');
        this.router.navigate(['rate']);
      }
    });
  }

  trackMyOrder() {
    this.tracker.show();
  }

  call() {
    if (this.restPhone) {
      window.open('tel:' + this.restPhone);
    }
  }

  getDriverInfo() {
    this.api.post_private('v1/driver/getDriverInfo', { id: this.dId }).then((data: any) => {
      console.log('driver info--->>', data);
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.util.orderDetails['driverInfo'] = info;
        console.log('---->>>>>', info);
        this.driverName = info.first_name + ' ' + info.last_name;
        this.driverMobile = info.mobile;
        this.driverCover = info.cover;
        this.driverFCM = info.fcm_token;
        this.driverLat = info.lat;
        this.driverLng = info.lng;
        this.loadMap(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  loadMap(latOri: any, lngOri: any, latDest: any, lngDest: any) {
    const directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay = new google.maps.DirectionsRenderer();
    const bounds = new google.maps.LatLngBounds;

    const origin1 = { lat: parseFloat(latOri), lng: parseFloat(lngOri) };
    const destinationA = { lat: latDest, lng: lngDest };

    const maps = new google.maps.Map(this.mapElement.nativeElement, {
      center: { lat: latOri, lng: lngOri },
      disableDefaultUI: true,
      zoom: 100
    });

    const custPos = new google.maps.LatLng(latOri, lngOri);
    const restPos = new google.maps.LatLng(latDest, lngDest);

    const logo = {
      url: 'assets/images/pin.png',
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(0, 0) // anchor
    };
    const marker = new google.maps.Marker({
      map: maps,
      position: custPos,
      animation: google.maps.Animation.DROP,
      icon: logo,
    });
    const markerCust = new google.maps.Marker({
      map: maps,
      position: restPos,
      animation: google.maps.Animation.DROP,
      icon: logo,
    });
    marker.setMap(maps);
    markerCust.setMap(maps);

    directionsDisplay.setMap(maps);
    // directionsDisplay.setOptions({ suppressMarkers: true });
    directionsDisplay.setOptions({
      polylineOptions: {
        strokeWeight: 4,
        strokeOpacity: 1,
        strokeColor: '#ff384c'
      },
      suppressMarkers: true
    });
    const geocoder = new google.maps.Geocoder;

    const service = new google.maps.DistanceMatrixService;

    service.getDistanceMatrix({
      origins: [origin1],
      destinations: [destinationA],
      travelMode: 'DRIVING',
      unitSystem: google.maps.UnitSystem.METRIC,
      avoidHighways: false,
      avoidTolls: false
    }, function (response: any, status: any) {
      if (status != 'OK') {
        alert('Error was: ' + status);
      } else {
        const originList = response.originAddresses;
        const destinationList = response.destinationAddresses;
        const showGeocodedAddressOnMap = function (asDestination: any) {
          return function (results: any, status: any) {
            if (status == 'OK') {
              maps.fitBounds(bounds.extend(results[0].geometry.location));
            } else {
              alert('Geocode was not successful due to: ' + status);
            }
          };
        };

        directionsService.route({
          origin: origin1,
          destination: destinationA,
          travelMode: 'DRIVING'
        }, function (response: any, status: any) {
          if (status == 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });


        for (let i = 0; i < originList.length; i++) {
          const results = response.rows[i].elements;
          geocoder.geocode({ 'address': originList[i] },
            showGeocodedAddressOnMap(false));
          for (let j = 0; j < results.length; j++) {
            geocoder.geocode({ 'address': destinationList[j] },
              showGeocodedAddressOnMap(true));
          }
        }
      }
    });
    this.interval = setInterval(() => {
      this.changeMarkerPosition(marker, maps);
    }, 12000);
  }

  changeMarkerPosition(marker: any, map: any) {
    this.api.post_private('v1/driver/getDriverInfo', { id: this.dId }).then((data: any) => {
      console.log('driver info--->>', data);
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        console.log('---->>>>>', info);
        this.dName = info.first_name + ' ' + info.last_name;
        this.dCover = info.cover;
        this.phone = info.mobile;
        this.driverLat = info.lat;
        this.driverLng = info.lng;
        const latlng = new google.maps.LatLng(parseFloat(this.driverLat), parseFloat(this.driverLng));
        map.setCenter(latlng);
        marker.setPosition(latlng);
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch((error) => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });

  }

  driverCall() {
    if (this.driverMobile) {
      window.open('tel:' + this.driverMobile);
    } else {
      this.util.errorToast(this.util.translate('Number not found'));
    }
  }

  chat() {
    const param: NavigationExtras = {
      queryParams: {
        id: 0,
        name: 'Support',
        uid: localStorage.getItem('uid')
      }
    };
    this.router.navigate(['inbox'], param);
  }

  changeStatus() {
    Swal.fire({
      title: this.util.translate('Are you sure?'),
      text: this.util.translate('To Cancel this order'),
      showCancelButton: true,
      cancelButtonText: this.util.translate('Cancel'),
      showConfirmButton: true,
      confirmButtonText: this.util.translate('Yes'),
      backdrop: false,
      background: 'white'
    }).then((data) => {
      console.log(data);
      if (data && data.value) {
        this.util.start();
        this.api.post_private('v1/orders/update', { id: this.id, status: 'cancel' }).then((data: any) => {
          console.log(data);
          if (data && data.status && data.status == 200 && data.data) {
            if (this.dId && this.dId != '' && this.dId != 0) {
              this.api.post_private('v1/driver/updateOrderStatus', { id: this.dId, current: 'active' }).then((data: any) => {
                console.log(data);
                this.util.stop();
                if (data && data.status && data.status == 200 && data.data) {
                  Swal.fire({
                    title: this.util.translate('success'),
                    text: this.util.translate('Order status changed to cancelled'),
                    icon: 'success',
                    timer: 2000,
                    backdrop: false,
                    background: 'white'
                  });
                  this.onBack();
                  this.sendNotification();
                }
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
          } else {
            this.util.stop();
          }
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
    });
  }

  callDriver() {
    window.open('https://api.whatsapp.com/send?phone=91' + this.phone);
  }

  onBack() {
    this.navCtrl.back();
  }

  sendNotification() {
    const param = {
      title: this.util.translate('Order status changed'),
      message: this.util.translate('Order status changed'),
      id: this.driverFCM
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
