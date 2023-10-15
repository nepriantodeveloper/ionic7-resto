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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { CusineModalPage } from '../cusine-modal/cusine-modal.page';

@Component({
  selector: 'app-venue-profile',
  templateUrl: './venue-profile.page.html',
  styleUrls: ['./venue-profile.page.scss'],
})
export class VenueProfilePage implements OnInit {
  isLoaded: boolean = false;
  address: any = '';
  close_time: any = '';
  id: any = '';
  cover: any = '';
  cusine: any[] = [];
  descriptions: any = '';
  dish: any = '';
  images: any[] = [];
  name: any = '';
  open_time: any = '';
  time: any = '';
  image1: any = '';
  image2: any = '';
  image3: any = '';
  image4: any = '';
  image5: any = '';
  image6: any = '';
  constructor(
    public util: UtilService,
    public api: ApiService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController
  ) {
    this.getStoreInfo();
  }

  ngOnInit() {
  }

  getStoreInfo() {
    this.isLoaded = false;
    this.api.post_private('v1/stores/getMyInfo', { id: localStorage.getItem('sid') }).then((data: any) => {
      console.log('store info', data);
      this.isLoaded = true;
      if (data && data.status && data.status == 200 && data.data && data.data.id) {
        const info = data.data;
        this.util.storeInfo = data.data;
        this.id = info.id;
        this.address = info.address;
        this.close_time = info.close_time;
        this.cover = info.cover;
        this.descriptions = info.descriptions;
        this.dish = info.dish;
        this.name = info.name;
        this.open_time = info.open_time;
        this.time = info.time;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false; } })(info.images)) {
          this.images = JSON.parse(info.images);
          this.image1 = this.images[0];
          this.image2 = this.images[1];
          this.image3 = this.images[2];
          this.image4 = this.images[3];
          this.image5 = this.images[4];
          this.image6 = this.images[5];
        }
        try {
          this.cusine = info.cusine.split(',');
          console.log(this.cusine);
        } catch (error) {
          console.log(error);
        }
      }
    }, error => {
      console.log(error);
      this.isLoaded = true;
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.isLoaded = true;
      this.util.apiErrorHandler(error);
    });
  }

  onBack() {
    this.util.onBack();
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

  async uploadCover() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.translate('Choose from'),
      mode: 'ios',
      buttons: [{
        text: this.util.translate('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('Delete clicked');
          this.opemCamera(CameraSource.Camera);
        }
      }, {
        text: this.util.translate('Gallery'),
        icon: 'image',
        handler: () => {
          console.log('Share clicked');
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

  submit() {
    console.log(this.name);
    console.log(this.address);
    console.log(this.dish);
    console.log(this.open_time);
    console.log(this.close_time);
    console.log(this.time);
    console.log(this.descriptions);
    console.log(this.cusine);
    console.log(this.cover);
    console.log(this.images);
    console.log(this.image1);
    console.log(this.image2);
    console.log(this.image3);
    console.log(this.image4);
    console.log(this.image5);
    console.log(this.image6);
    if (this.name == null || this.name == '' || this.address == null || this.address == '' || this.dish == '' || this.dish == null || this.open_time == null || this.open_time == '' ||
      this.close_time == null || this.close_time == '' || this.time == '' || this.time == null || this.descriptions == null || this.descriptions == '' || this.cover == null || this.cover == '') {
      this.util.errorToast('All Fields are required');
      return false;
    }
    if (this.cusine.length == 0) {
      this.util.errorToast('Please select cuisine');
      return false;
    }
    const image = [
      this.image1 ? this.image1 : '',
      this.image2 ? this.image2 : '',
      this.image3 ? this.image3 : '',
      this.image4 ? this.image4 : '',
      this.image5 ? this.image5 : '',
      this.image6 ? this.image6 : ''
    ];
    const param = {
      id: this.id,
      name: this.name,
      address: this.address,
      close_time: this.close_time,
      cover: this.cover,
      cusine: this.cusine.join(','),
      descriptions: this.descriptions,
      dish: this.dish,
      images: image,
      open_time: this.open_time,
      time: this.time,
    }
    console.log(param);
    this.util.show();
    this.api.post_private('v1/stores/updateMyProfile', param).then((data: any) => {
      console.log(data);
      this.util.hide();
      if (data && data.status && data.status == 200 && data.data) {
        this.getStoreInfo();
        this.util.showToast('Updated', 'success', 'bottom');
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

  async uploadExtra(source: CameraSource, num: any) {
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
            if (num == 1 || num == '1') {
              this.image1 = data.data.image_name;
            }
            if (num == 2 || num == '2') {
              this.image2 = data.data.image_name;
            }
            if (num == 3 || num == '3') {
              this.image3 = data.data.image_name;
            }
            if (num == 4 || num == '4') {
              this.image4 = data.data.image_name;
            }
            if (num == 5 || num == '5') {
              this.image5 = data.data.image_name;
            }
            if (num == 6 || num == '6') {
              this.image6 = data.data.image_name;
            }
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

  async others(num: any) {
    console.log('num', num);
    const actionSheet = await this.actionSheetController.create({
      mode: 'ios',
      buttons: [{
        text: this.util.translate('Camera'),
        role: 'camera',
        icon: 'camera',
        handler: () => {
          console.log('Camera clicked');
          this.uploadExtra(CameraSource.Camera, num);
        }
      },
      {
        text: this.util.translate('Gallery'),
        role: 'gallery',
        icon: 'image',
        handler: () => {
          console.log('Gallery clicked');
          this.uploadExtra(CameraSource.Photos, num);
        }
      }, {
        text: this.util.translate('Cancel'),
        role: 'cancel',
        icon: 'close',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

  async openCusinesList() {
    const modal = await this.modalController.create({
      component: CusineModalPage,
      componentProps: { value: this.cusine }
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data && data.data && data.role == 'ok') {
        this.cusine = data.data;
      }
    });
    await modal.present();
  }
}
