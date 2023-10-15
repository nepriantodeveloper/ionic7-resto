/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPagesComponent } from './app-pages.component';

describe('AppPagesComponent', () => {
  let component: AppPagesComponent;
  let fixture: ComponentFixture<AppPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPagesComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AppPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
