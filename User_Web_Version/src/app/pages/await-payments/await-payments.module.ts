/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AwaitPaymentsRoutingModule } from './await-payments-routing.module';
import { AwaitPaymentsComponent } from './await-payments.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AwaitPaymentsComponent
  ],
  imports: [
    CommonModule,
    AwaitPaymentsRoutingModule,
    MDBBootstrapModule.forRoot(),
    FormsModule,
  ]
})
export class AwaitPaymentsModule { }
