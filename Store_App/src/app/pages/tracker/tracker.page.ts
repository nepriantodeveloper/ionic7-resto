/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
declare var google: any;

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.page.html',
  styleUrls: ['./tracker.page.scss'],
})
export class TrackerPage implements OnInit {
  @ViewChild('map', { static: true }) mapElement: ElementRef;
  map: any;
  id: any;
  dName: any = '';
  restAddress: any = '';
  dCover: any = '';
  dId: any;
  phone: any = '';
  status: any = '';
  totalOrders: any[] = [];
  grandTotal: any;
  myLat: any;
  myLng: any;
  driverLat: any;
  driverLng: any;
  interval: any;
  paid: any;
  payMethod: any;
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.getOrder();
      }
    });
  }

  ngOnInit() {
  }

  getOrder() {
    this.api.post_private('v1/orders/getById', { id: this.id }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.grandTotal = info.grand_total;
        this.status = info.status;
        this.restAddress = info.store_address;
        this.payMethod = data.pay_method == 'cod' ? 'COD' : 'PAID';
        if (info && info.address) {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.address)) {
            const add = JSON.parse(info.address);
            this.myLat = add.lat;
            this.myLng = add.lng;
          }
        }
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.orders)) {
          this.totalOrders = JSON.parse(info.orders);
        }

        if (info && info.did && info.did != 0) {
          this.dId = info.did;
          this.getDriverInfo();
        }
      }
    }, error => {
      console.log('error in orders', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log('error in order', error);
      this.util.apiErrorHandler(error);
    });

  }

  getDriverInfo() {
    this.api.post_private('v1/driver/getDriverInfo', { id: this.dId }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.dName = info.first_name + ' ' + info.last_name;
        this.dCover = info.cover;
        this.phone = info.mobile;
        this.driverLat = info.lat;
        this.driverLng = info.lng;
        this.loadMap(parseFloat(this.myLat), parseFloat(this.myLng), parseFloat(this.driverLat), parseFloat(this.driverLng));
        console.log(this);
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  callDriver() {
    window.open('tel:' + this.phone, '_system');
  }

  changeMarkerPosition(marker: any, map: any) {
    const param = {
      id: this.dId
    };
    this.api.post_private('v1/driver/getDriverInfo', param).then((data: any) => {
      console.log('driver info--->>', data);
      if (data && data.status == 200 && data.data) {
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

  ionViewDidLeave() {
    clearInterval(this.interval);
  }

  onBack() {
    this.util.onBack();
  }
}
