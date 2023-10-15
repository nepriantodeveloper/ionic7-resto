/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-choose-restaurant',
  templateUrl: './choose-restaurant.page.html',
  styleUrls: ['./choose-restaurant.page.scss'],
})
export class ChooseRestaurantPage implements OnInit {
  restaurants: any[] = [];
  dummyRest: any = [];
  dummy: any[] = [];
  distanceType: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
  ) {
    this.getRestaurant();
  }

  ngOnInit() {
  }

  protected resetChanges = () => {
    this.restaurants = this.dummyRest;
  }

  setFilteredItems() {
    console.log('clear');
    this.restaurants = [];
    this.restaurants = this.dummyRest;
  }

  filterItems(searchTerm: any) {
    return this.restaurants.filter((item) => {
      return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    });

  }
  onSearchChange(event: any) {
    this.resetChanges();
    this.restaurants = this.filterItems(event.detail.value);
  }

  getRestaurant() {
    this.dummy = Array(10);
    this.api.post_public('v1/stores/getNearMe', { "lat": localStorage.getItem('lat'), "lng": localStorage.getItem('lng') }).then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status && data.status == 200 && data.data && data.data.length) {
        data.data.forEach(async (element: any) => {
          element.rating = parseFloat(element.rating);
          element.time = parseInt(element.time);
          element.dish = parseInt(element.dish);
          element['isOpen'] = this.isOpen(element.open_time, element.close_time);
        });
        this.restaurants = data.data;
        this.distanceType = data.distanceType;
        this.restaurants = this.restaurants.sort((a, b) =>
          parseFloat(a.distance) < parseFloat(b.distance) ? -1
            : (parseFloat(a.distance) > parseFloat(b.distance) ? 1 : 0));
        console.log(this.restaurants);
        this.dummyRest = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.dummyRest = [];
      this.restaurants = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.dummyRest = [];
      this.restaurants = [];
      this.util.apiErrorHandler(error);
    });
  }

  isOpen(open: any, close: any) {
    const format = 'HH:mm:ss';
    const currentTime = moment().format(format);
    const time = moment(currentTime, format);
    const beforeTime = moment(open, format);
    const afterTime = moment(close, format);

    if (time.isBetween(beforeTime, afterTime)) {
      return true;
    }
    return false;
  }

  onBack() {
    this.util.onBack();
  }

  goToAddReview(item: any) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.uid,
        name: item.name
      }
    };
    this.util.navigateToPage('/add-review', param);
  }
}
