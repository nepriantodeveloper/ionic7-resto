/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  autocomplete1: { 'query': string };
  autocompleteItems1: any = [];
  GoogleAutocomplete;
  geocoder: any;

  blogs: any;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.geocoder = new google.maps.Geocoder();
    this.autocomplete1 = { query: '' };
    this.autocompleteItems1 = [];
    this.getBlogs();
  }

  ngOnInit(): void {
  }

  goToRest() {
    this.util.publishModalPopup('location');
  }

  getBlogs() {
    this.api.get_public('v1/blogs/getTop').then((data: any) => {
      console.log(data);
      if (data && data.status == 200 && data.data.length) {
        this.blogs = data.data;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch((error: any) => {
      console.log(error);
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  goToBlogs(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        title: item.title.replace(/\s+/g, '-').toLowerCase()
      }
    }
    this.util.navigateToPage('/blog-detail', param);
  }
  locate() {
    if (window.navigator && window.navigator.geolocation) {
      this.util.start();
      window.navigator.geolocation.getCurrentPosition(
        position => {

          console.log(position);
          this.getAddress(position.coords.latitude, position.coords.longitude);
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
            default:
              console.log('defual');
          }
        }
      );
    };
  }

  onSearchChange(event: any) {
    console.log(event);
    if (this.autocomplete1.query == '') {
      this.autocompleteItems1 = [];
      return;
    }
    const addsSelected = localStorage.getItem('addsSelected');
    if (addsSelected && addsSelected != null) {
      localStorage.removeItem('addsSelected');
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete1.query }, (predictions: any, status: any) => {
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
    this.autocomplete1.query = item.description;
    this.geocoder.geocode({ placeId: item.place_id }, (results: any, status: any) => {
      if (status == 'OK' && results[0]) {
        console.log(status);
        localStorage.setItem('location', 'true');
        localStorage.setItem('lat', results[0].geometry.location.lat());
        localStorage.setItem('lng', results[0].geometry.location.lng());
        localStorage.setItem('address', this.autocomplete1.query);
        this.util.navigateToPage('/restaurants');
      }
    });
  }

  getAddress(lat: any, lng: any) {
    this.util.stop();
    const geocoder = new google.maps.Geocoder();
    const location = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'location': location }, (results: any, status: any) => {
      console.log(results);
      console.log('status', status);
      if (results && results.length) {
        localStorage.setItem('location', 'true');
        localStorage.setItem('lat', lat);
        localStorage.setItem('address', results[0].formatted_address);
        localStorage.setItem('lng', lng);
        this.util.navigateToPage('restaurants');
      }
    }, (error: any) => {
      console.log('error in geocoder');
    });
  }

  getContent(item: any) {
    return (item.content.length > 50) ? item.content.slice(0, 50) + '...' : item.content;
  }


  getDate(item: any) {
    return moment(item).format('DD');
  }

  getMonth(item: any) {
    return moment(item).format('MMM');
  }
}
