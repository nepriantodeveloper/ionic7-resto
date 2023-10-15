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
import { IonicModule } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';
import { FormsModule } from '@angular/forms';
import { MenuComponent } from './menu/menu.component';
const components = [
  PopoverComponent,
  MenuComponent
];
@NgModule({
  declarations: [
    components
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
  ],
  exports: [
    ...components,
  ]
})
export class ComponentsModule { }
