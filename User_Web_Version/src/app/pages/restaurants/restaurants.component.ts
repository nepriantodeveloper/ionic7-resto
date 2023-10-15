/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { orderBy } from 'lodash';
import { register } from 'swiper/element/bundle';
import { Router } from '@angular/router';

register();
@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent {
  @ViewChild('topBanners', { read: ElementRef }) public topBanners: ElementRef<any>;
  @ViewChild('filterModal') public filterModal: ModalDirective;
  tabID = '';
  plt: any = '';
  allRest: any[] = [];
  chips: any[] = [];
  showFilter: boolean;
  lat: any = '';
  lng: any = '';
  dummyRest: any[] = [];
  dummy = Array(15);
  haveLocation: boolean;
  profile: any = '';
  banners: any[] = [];
  dummyBanners = Array(10);
  slideOpts = {
    slidesPerView: 1.2,
    pagination: true
  };
  cityName: any = '';
  cityId: any = '';
  activeFilter: any = '';
  searchKeyword: any = '';
  haveData: boolean;
  @HostListener('window:beforeunload')
  canDeactivate(): any {
    console.log('ok');
  };
  distanceType: any = '';
  constructor(
    public api: ApiService,
    private chMod: ChangeDetectorRef,
    public util: UtilService,
    private router: Router
  ) {
    this.haveData = true;
    this.util.subscribeNewAddress().subscribe(data => {
      this.haveData = true;
      console.log('new address ');
      this.getRestaurants();
    });
    this.getRestaurants();
    this.util.subscribeFitlerCode().subscribe(data => {
      this.addFilter(data);
    });
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scroll, true); // third parameter
  }

  onIndexChange(event: any) {
    console.log(event);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    const amount = event.srcElement.scrollTop;
    if (amount >= 280) {
      this.util.publishHeader({ header: true, total: this.allRest.length, active: this.activeFilter });
      return;
    } else {
      this.util.publishHeader({ header: false, total: this.allRest.length, active: this.activeFilter });
      return;
    }
  };

  goToRestDetail(item: any) {
    this.util.publishHeader({ header: false, total: this.allRest.length, active: this.activeFilter });
    this.router.navigate(['order', item.uid, item.name.replace(/\s+/g, '-').toLowerCase()])
  }

  openOffers(item: any) {
    if (item.type == '0') {
      this.util.publishHeader({ header: false, total: this.allRest.length, active: this.activeFilter });
      this.router.navigate(['order', item.value, item.message.replace(/\s+/g, '-').toLowerCase()])
    } else {
      window.open(item.value, '_blank')
    }

  }

  changeMenu(val: any) {
    this.tabID = val;
  }

  getRestaurants() {
    this.allRest = [];
    this.dummyRest = [];
    this.banners = [];
    this.dummyBanners = [];
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

        this.allRest = data.data;
        this.dummyRest = data.data;
        this.banners = data.banners;

        this.distanceType = data.distanceType;

        console.log(this.allRest);

        this.allRest = this.allRest.sort((a, b) =>
          parseFloat(a.distance) < parseFloat(b.distance) ? -1
            : (parseFloat(a.distance) > parseFloat(b.distance) ? 1 : 0));
        this.chMod.detectChanges();
      } else {
        this.allRest = [];
        this.dummy = [];
        this.dummyRest = [];
        this.dummyBanners = [];
        this.haveData = false;
      }
    }, error => {
      console.log(error);
      this.allRest = [];
      this.dummy = [];
      this.dummyRest = [];
      this.dummyBanners = [];
      this.haveData = false;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.allRest = [];
      this.dummy = [];
      this.dummyRest = [];
      this.dummyBanners = [];
      this.haveData = false;
      this.util.apiErrorHandler(error);
    });
  }

  addFilter(index: any) {
    console.log(index);
    this.activeFilter = index;
    if (index == 0) {
      console.log('rating');
      this.allRest = orderBy(this.allRest, 'rating', 'desc');
    } else if (index == 1) {
      console.log('fast');
      this.allRest = orderBy(this.allRest, 'time', 'asc');
    } else if (index == 2) {
      console.log('cost');
      this.allRest = orderBy(this.allRest, 'dish', 'asc');
    } else if (index == 3) {
      console.log('A-Z');
      this.allRest = orderBy(this.allRest, 'name', 'asc');
    } else if (index == 4) {
      console.log('Z-A');
      this.allRest = orderBy(this.allRest, 'name', 'desc');
    }
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

  onSearchChange(event: any) {
    console.log(event);
    if (event != '') {
      this.allRest = this.dummyRest.filter((ele: any) => {
        return ele.name.toLowerCase().includes(event.toLowerCase());
      });
    } else {
      this.allRest = this.dummyRest;
    }
  }

  scrollRight() {
    this.topBanners.nativeElement.scrollLeft += 450;
  }

  scrollLeft() {
    this.topBanners.nativeElement.scrollLeft -= 450;
  }

  getAddressName() {
    const location = localStorage.getItem('address');
    if (location && location != null && location != 'null') {
      return location.length > 30 ? location.slice(0, 30) + '....' : location;;
    }
    localStorage.clear();
    return 'No address';
  }

  showAddressChangePopup() {
    this.util.publishAddressPopup();
  }
}
