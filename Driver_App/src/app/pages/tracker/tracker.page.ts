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

  id: any = '';

  phone: any = '';
  status: any = '';
  totalOrders: any[] = [];
  grandTotal: any;
  username: any;
  address: any;
  cover: any;
  driverLat: any;
  driverLng: any;
  interval: any;
  payMethod: any;
  myLat: any;
  myLng: any;
  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public util: UtilService,
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((data: any) => {
      console.log('data=>', data);
      if (data.hasOwnProperty('id')) {
        this.id = data.id;
        this.getOrder();
      }
    });

  }
  callDriver() {
    window.open('tel:' + this.phone, '_system');
  }
  getOrder() {
    this.api.post_private('v1/orders/getDriverOrderById', { id: this.id }).then((datas: any) => {
      console.log(datas);
      if (datas && datas.status && datas.status == 200 && datas.data) {
        const info = datas.data;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.orders)) {
          this.totalOrders = JSON.parse(info.orders);
        }
        this.grandTotal = info.grand_total;
        this.status = info.status;
        this.payMethod = info.pay_method == 'cod' ? 'COD' : 'PAID';
        this.username = info.first_name + ' ' + info.last_name;
        this.phone = info.user_mobile;
        this.cover = info.user_cover;
        if (info && info.address && info.address != '') {
          if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.address)) {
            const addr = JSON.parse(info.address);
            this.address = addr.house + ' ' + addr.landmark + ' ' + addr.address + ' ' + addr.pincode;
            this.myLat = addr.lat;
            this.myLng = addr.lng;
            this.loadMap(parseFloat(localStorage.getItem('lat') ?? ''), parseFloat(localStorage.getItem('lng') ?? ''),
              parseFloat(this.myLat), parseFloat(this.myLng));
          }
        }
      } else {
        this.util.onBack();
      }
    }, error => {
      console.log('error in orders', error);
      this.util.apiErrorHandler(error);
    }).catch(error => {
      console.log('error in order', error);
      this.util.apiErrorHandler(error);
    });
  }

  changeMarkerPosition(marker: any, map: any) {
    const latlng = new google.maps.LatLng(parseFloat(localStorage.getItem('lat') ?? ''), parseFloat(localStorage.getItem('lng') ?? ''));
    map.setCenter(latlng);
    marker.setPosition(latlng);
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
    console.log('leaae');
    clearInterval(this.interval);
  }

  onBack() {
    this.util.onBack();
  }
}
