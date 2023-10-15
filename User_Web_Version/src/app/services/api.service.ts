/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth/';
import * as firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: any = '';
  mediaURL: any = '';
  confirmationResult: firebase.default.auth.ConfirmationResult;
  constructor(
    private http: HttpClient,
    private fireAuth: AngularFireAuth
  ) {
    this.baseUrl = environment.baseUrl + 'api/';
    this.mediaURL = environment.baseUrl + 'storage/images/';
  }

  public signInWithPhoneNumber(recaptchaVerifier: any, phoneNumber: any) {
    return new Promise<any>((resolve, reject) => {
      console.log(phoneNumber);
      this.fireAuth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult: any) => {
          this.confirmationResult = confirmationResult;
          resolve(confirmationResult);
        }).catch((error: any) => {
          console.log(error);
          reject('SMS not sent');
        });
    });
  }

  public async enterVerificationCode(code: any) {
    return new Promise<any>((resolve, reject) => {
      this.confirmationResult.confirm(code).then(async (result: any) => {
        console.log(result);
        const user = result.user;
        resolve(user);
      }).catch((error: any) => {
        reject(error.message);
      });

    });
  }

  uploadFile(files: File[]) {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('image', f));
    return this.http.post(this.baseUrl + 'v1/uploadImage', formData);
  }

  JSON_to_URLEncoded(element: any, key?: any, list?: any) {
    let new_list = list || [];
    if (typeof element == 'object') {
      for (let idx in element) {
        this.JSON_to_URLEncoded(
          element[idx],
          key ? key + '[' + idx + ']' : idx,
          new_list
        );
      }
    } else {
      new_list.push(key + '=' + encodeURIComponent(element));
    }
    return new_list.join('&');
  }

  public post_private(url: any, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post_temp(url: any, body: any, temp: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${temp}`)
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public post_public(url: any, body: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      const param = this.JSON_to_URLEncoded(body);
      console.log(param);
      this.http.post(this.baseUrl + url, param, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public uploadImage(url: any, blobData: any, ext: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append('image', blobData, `image.${ext}`);
      this.http.post(this.baseUrl + url, formData).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public get_public(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  public get_private(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
          .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      };
      this.http.get(this.baseUrl + url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  public externalGet(url: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get(url, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  httpGet(url: any, key: any) {
    const header = {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `Bearer ${key}`)
    };
    return this.http.get(url, header);
  }

  public getLocalAssets(name: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const header = {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.http.get('assets/json/' + name, header).subscribe((data) => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }
}
