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
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PickLocationPageRoutingModule } from './pick-location-routing.module';

import { PickLocationPage } from './pick-location.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PickLocationPageRoutingModule
  ],
  declarations: [PickLocationPage]
})
export class PickLocationPageModule { }
