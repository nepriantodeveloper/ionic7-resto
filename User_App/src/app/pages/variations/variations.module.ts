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

import { VariationsPageRoutingModule } from './variations-routing.module';

import { VariationsPage } from './variations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VariationsPageRoutingModule
  ],
  declarations: [VariationsPage]
})
export class VariationsPageModule { }
