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

import { ManageOrdersRoutingModule } from './manage-orders-routing.module';
import { ManageOrdersComponent } from './manage-orders.component';
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
import { IconModule, IconSetService } from '@coreui/icons-angular';
import { ButtonModule } from '@coreui/angular';
import { DropdownModule } from '@coreui/angular';


@NgModule({
  declarations: [
    ManageOrdersComponent
  ],
  imports: [
    CommonModule,
    ManageOrdersRoutingModule,
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
    DropdownModule
  ],
  providers: [IconSetService]
})
export class ManageOrdersModule { }
