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

import { ReviewsRoutingModule } from './reviews-routing.module';
import { ReviewsComponent } from './reviews.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from 'ngx-spinner'
import { FormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { NavModule, TabsModule } from '@coreui/angular';
import { SpinnerModule } from '@coreui/angular';
import { AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { DropdownModule } from '@coreui/angular';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@NgModule({
  declarations: [
    ReviewsComponent
  ],
  imports: [
    CommonModule,
    ReviewsRoutingModule,
    FormsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    NgxSpinnerModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'progress-dark' }),
    NgxPaginationModule,
    ChartjsModule,
    TabsModule,
    NavModule,
    SpinnerModule,
    AlertModule,
    IconModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    FormModule,
    GridModule
  ]
})
export class ReviewsModule { }
