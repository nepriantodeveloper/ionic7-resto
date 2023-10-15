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
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  first_name: any = '';
  last_name: any = '';
  email: any = '';
  password: any = '';
  mobile: any = '';
  country_code: any = '';
  confirm_password: any = '';
  submited: any = false;
  constructor(
    private router: Router,
    private location: Location,
    public api: ApiService,
    public util: UtilService
  ) {

  }

  onRegister() {
    this.submited = true;
    if (this.first_name == '' || this.last_name == '' || this.country_code == '' ||
      this.email == '' || this.mobile == '' || this.password == '' || this.confirm_password == '') {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    const regex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!regex.test(this.email)) {
      this.util.error(this.util.translate('Please enter valid Email ID'));
      return false;
    }

    if (this.password !== this.confirm_password) {
      this.util.error(this.util.translate(`Password doesn't match..`));
      return false;
    }
  }

}
