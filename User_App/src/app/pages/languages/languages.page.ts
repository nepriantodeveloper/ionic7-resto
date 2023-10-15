/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.page.html',
  styleUrls: ['./languages.page.scss'],
})
export class LanguagesPage implements OnInit {
  selected: any;
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    this.selected = parseInt(localStorage.getItem('selectedLanguage') ?? '');
  }

  ngOnInit() {
  }

  changed() {
    console.log(this.selected);
    const item = this.util.languages.filter((x: any) => x.id == this.selected);
    console.log(item);
    if (item && item.length > 0) {
      const direction = item[0].positions == 0 ? 'ltr' : 'rtl';
      localStorage.setItem('selectedLanguage', item[0].id);
      localStorage.setItem('direction', direction);
      window.location.reload();
    }
  }

  onBack() {
    this.util.onBack();
  }
}
