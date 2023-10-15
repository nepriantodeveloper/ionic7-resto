/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
})
export class BlogDetailComponent {
  title: any;
  cover: any;
  cotent: any;
  id: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: Location,
    public api: ApiService,
    private util: UtilService
  ) {
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id) {
        this.id = data.id;
        this.getById();
      }
    });
  }

  getById() {
    this.api.post_public('v1/blogs/getById', { id: this.id }).then((data: any) => {
      console.log(data);
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        this.title = info.title;
        this.cotent = info.content;
        this.cover = info.cover;
      }
    }, error => {
      console.log(error);
      this.navCtrl.back();
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.navCtrl.back();
      this.util.apiErrorHandler(error);
    });
  }

  ngOnInit(): void { }

}
