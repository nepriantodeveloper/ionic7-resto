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

import { ManageStoresRoutingModule } from './manage-stores-routing.module';
import { ManageStoresComponent } from './manage-stores.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BadgeModule } from '@coreui/angular';
import { NavModule, TabsModule } from '@coreui/angular';

@NgModule({
  declarations: [
    ManageStoresComponent
  ],
  imports: [
    CommonModule,
    ManageStoresRoutingModule,
    ModalModule.forRoot(),
    FormsModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    NgxSkeletonLoaderModule.forRoot({ animation: 'progress-dark' }),
    TabsModule,
    ButtonsModule.forRoot(),
    BadgeModule,
    NavModule
  ]
})
export class ManageStoresModule { }
