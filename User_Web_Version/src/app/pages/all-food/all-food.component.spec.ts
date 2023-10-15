/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllFoodComponent } from './all-food.component';

describe('AllFoodComponent', () => {
  let component: AllFoodComponent;
  let fixture: ComponentFixture<AllFoodComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AllFoodComponent]
    });
    fixture = TestBed.createComponent(AllFoodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
