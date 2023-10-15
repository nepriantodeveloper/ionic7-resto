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

import { AllFoodRoutingModule } from './all-food-routing.module';
import { AllFoodComponent } from './all-food.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
@NgModule({
  declarations: [
    AllFoodComponent
  ],
  imports: [
    CommonModule,
    AllFoodRoutingModule,
    MDBBootstrapModule.forRoot(),
    NgxSpinnerModule,
    FormsModule,
    NgxSkeletonLoaderModule
  ]
})
export class AllFoodModule { }
