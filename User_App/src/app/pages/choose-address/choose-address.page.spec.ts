/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseAddressPage } from './choose-address.page';

describe('ChooseAddressPage', () => {
  let component: ChooseAddressPage;
  let fixture: ComponentFixture<ChooseAddressPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ChooseAddressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
