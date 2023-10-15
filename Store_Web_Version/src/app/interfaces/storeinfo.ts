/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
export interface StoreInfo {
  id: number;
  uid: number;
  name: string;
  mobile: string;
  lat: string;
  lng: string;
  verified: number;
  address: string;
  descriptions: string;
  images: string;
  cover: string;
  open_time: string;
  close_time: string;
  isClosed: number;
  certificate_url: string;
  certificate_type: string;
  rating: number;
  total_rating: number;
  cid: number;
  cusine: string;
  time: string;
  dish: string;
  status: number;
  extra_field: string;
  updated_at: string;
}
