/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  tabID = '';

  blogs: any;
  dummy: any = Array(10);
  constructor(
    private router: Router,
    public api: ApiService,
    public util: UtilService
  ) {
    this.getBlogs();
  }

  ngOnInit(): void { }

  goToBlogDetail(item: any) {
    console.log(item);
    const param: NavigationExtras = {
      queryParams: {
        id: item.id,
        title: item.title.replace(/\s+/g, '-').toLowerCase()
      }
    }
    this.router.navigate(['/blog-detail'], param);
  }

  getBlogs() {
    this.api.get_public('v1/blogs/getTop').then((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status == 200 && data.data.length) {
        this.blogs = data.data;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch((error: any) => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.translate('Something went wrong'));
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
