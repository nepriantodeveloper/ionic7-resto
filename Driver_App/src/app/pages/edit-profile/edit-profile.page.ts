/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActionSheetController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  fname: any = '';
  lname: any = '';
  mobile: any = '';
  gender: any = '';
  email: any = '';
  cover: any = '';
  edit_flag: boolean = true;
  current: boolean;
  constructor(
    public util: UtilService,
    public api: ApiService,
    private actionSheetController: ActionSheetController
  ) {
    this.getMyProfile();
  }

  ngOnInit() {
  }

  getMyProfile() {
    this.api.post_private('v1/drivers/getById', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log('driver info', data);
      if (data && data.status && data.status == 200 && data.data) {
        this.util.driverInfo = data.data;
        this.fname = this.util.driverInfo.first_name;
        this.lname = this.util.driverInfo.last_name;
        this.mobile = this.util.driverInfo.mobile;
        this.gender = this.util.driverInfo.gender;
        this.email = this.util.driverInfo.email;
        this.cover = this.util.driverInfo.cover;
        this.current = this.util.driverInfo.current == 'active' ? true : false;
      }
    }, error => {
      console.log(error);
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.apiErrorHandler(error);
    });
  }

  async opemCamera(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        source,
        quality: 50,
        resultType: CameraResultType.Base64
      });
      console.log('image output', image);
      if (image && image.base64String) {
        const blobData = this.b64toBlob(image.base64String, `image/${image.format}`);
        this.util.show(this.util.translate('Uploading..'));
        this.api.uploadImage('v1/uploadImage', blobData, image.format).then((data) => {
          console.log('image upload', data);
          this.util.hide();
          if (data && data.status == 200 && data.success == true && data.data.image_name) {
            this.cover = data.data.image_name;
            console.log('this cover', this.cover);
            const param = {
              id: localStorage.getItem('uid'),
              cover: this.cover,
            };
            this.util.show();
            this.api.post_private('v1/driver/updateMyLocation', param).then((data: any) => {
              console.log(data);
              this.util.hide();
              if (data && data.status && data.status == 200 && data.data) {
                this.getMyProfile();
              }
            }, error => {
              console.log(error);
              this.util.hide();
              this.util.apiErrorHandler(error);
            }).catch((error: any) => {
              console.log(error);
              this.util.hide();
              this.util.apiErrorHandler(error);
            });

          } else {
            console.log('NO image selected');
          }
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        }).catch(error => {
          console.log('error', error);
          this.util.hide();
          this.util.apiErrorHandler(error);
        });
      }
    } catch (error) {
      console.log(error);
      this.util.apiErrorHandler(error);
    }
  }

  b64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  async updateProfile() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      buttons: [{
        text: this.util.translate('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('camera clicked');
          this.opemCamera(CameraSource.Camera);
        }
      }, {
        text: this.util.translate('Gallery'),
        icon: 'images',
        handler: () => {
          console.log('gallery clicked');
          this.opemCamera(CameraSource.Photos);
        }
      }, {
        text: this.util.translate('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  onBack() {
    this.util.onBack();
  }

  update() {
    if (this.fname == null || this.fname == '' || this.lname == null || this.lname == '' || this.cover == null || this.cover == '') {
      this.util.errorToast('All Fields are required');
      return false;
    }
    const param = {
      id: localStorage.getItem('uid'),
      first_name: this.fname,
      last_name: this.lname,
      cover: this.cover,
    };
    this.util.show();
    this.api.post_private('v1/driver/updateMyLocation', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.getMyProfile();
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.util.hide();
      this.util.apiErrorHandler(error);
    });

  }
}
