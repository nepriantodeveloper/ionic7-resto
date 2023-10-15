/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { PreviewPage } from '../preview/preview.page';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-add-new-foods',
  templateUrl: './add-new-foods.page.html',
  styleUrls: ['./add-new-foods.page.scss'],
})
export class AddNewFoodsPage implements OnInit {
  categories: any[] = [];
  name: any = '';
  cid: any = '';
  price: any = '';
  descriptions: any = '';
  image: any = '';
  coverImage: any = '';
  isEdit: boolean = false;
  id: any = '';
  veg: any = '1';
  status: any = '1';
  variations: any[] = [];
  size: any = '0';
  image1: any = '';
  image2: any = '';
  image3: any = '';
  image4: any = '';
  image5: any = '';
  image6: any = '';
  isLoaded: boolean = false;
  moreImages: any[] = [];
  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private alertController: AlertController
  ) {
    this.getCategories();
    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id) {
        this.id = data.id;
        this.isEdit = true;
        this.getProduct();
      } else {
        this.isEdit = false;
        this.isLoaded = true;
      }
    });
  }

  ngOnInit() {
  }

  onBack() {
    this.util.onBack();
  }

  getCategories() {
    this.api.post_private('v1/categories/getMyCategories', { id: localStorage.getItem('uid') }).then((data: any) => {
      console.log(data);
      this.categories = [];
      if (data && data.status && data.status == 200) {
        this.categories = data.data;
      }
    }, error => {
      console.log(error);
      this.categories = [];
      this.util.apiErrorHandler(error);
    }).catch((error: any) => {
      console.log(error);
      this.categories = [];
      this.util.apiErrorHandler(error);
    });
  }

  getProduct() {
    this.isLoaded = false;
    this.api.post_private('v1/foods/getById', { id: this.id }).then((data: any) => {
      console.log(data);
      this.isLoaded = true;
      if (data && data.status && data.status == 200 && data.data) {
        const info = data.data;
        console.log('info->', info);
        this.name = info.name;
        this.descriptions = info.details;
        this.coverImage = info.cover;
        this.cid = info.cid;
        this.price = info.price;
        this.size = info.size;
        this.status = info.status;
        this.veg = info.veg;
        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.variations)) {
          this.variations = JSON.parse(info.variations);
          console.log(this.variations);
        }

        if (((x) => { try { JSON.parse(x); return true; } catch (e) { return false } })(info.extra_field)) {
          const extradata = JSON.parse(info.extra_field);
          if (extradata && extradata.extra_images) {
            this.moreImages = JSON.parse(extradata.extra_images);
            console.log(this.moreImages);
            this.image1 = this.moreImages[0];
            this.image2 = this.moreImages[1];
            this.image3 = this.moreImages[2];
            this.image4 = this.moreImages[3];
            this.image5 = this.moreImages[4];
            this.image6 = this.moreImages[5];
          }
        }
      } else {
        this.util.errorToast(this.util.translate('Product not found'));
      }
    }, error => {
      console.log(error);
      this.isLoaded = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.isLoaded = true;
      this.util.errorToast(this.util.translate('Something went wrong'));
    });
  }

  changeSize(event: any) {
    console.log(event, this.size);
    if (event == '1') {
      const items = this.variations.filter(x => x.title == 'size');
      console.log('length', items);
      if (!items.length) {
        const item = {
          title: 'size',
          type: 'radio',
          items: []
        };
        this.variations.push(item);
        console.log(this.variations);
      }
    } else {
      this.variations = this.variations.filter(x => x.title != 'size');
    }
  }

  async cover() {
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

  async addNew() {
    const alert = await this.alertController.create({
      header: this.util.translate('Add Add-ons!'),
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.util.translate('Title')
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.name) {
              const item = this.variations.filter(x => x.title == data.name);
              console.log('=>"', item);
              if (item && item.length > 0) {
                this.util.errorToast('Duplicate');
              } else {
                this.presentAlertRadio(data.name);
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editTitle(index: any) {
    const alert = await this.alertController.create({
      header: this.util.translate('Edit title!'),
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: this.util.translate('Title'),
          value: this.variations[index].title
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.name) {
              this.variations[index].title = data.name;
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async presentAlertRadio(name: any) {
    const alert = await this.alertController.create({
      header: this.util.translate('Select Type'),
      inputs: [
        {
          name: 'radio1',
          type: 'radio',
          label: this.util.translate('Only One'),
          value: 'radio',
          checked: true
        },
        {
          name: 'radio2',
          type: 'radio',
          label: this.util.translate('Multiple'),
          value: 'check'
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            const item = {
              title: name,
              type: data,
              items: []
            };
            this.variations.push(item);
            console.log(this.variations);
          }
        }
      ]
    });

    await alert.present();
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
            this.coverImage = data.data.image_name;
            console.log('this cover', this.coverImage);
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

  submit() {
    if (this.name == '' || !this.name || this.cid == '' ||
      !this.cid || this.price == '' || !this.price || this.descriptions == '' || !this.descriptions) {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    if (!this.coverImage || this.coverImage == '') {
      this.util.errorToast(this.util.translate('Please add your cover image'));
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
    const extraData = {
      extra_images: JSON.stringify(image)
    }
    if (this.isEdit && this.id) {
      const param = {
        restId: localStorage.getItem('uid'),
        cid: this.cid,
        name: this.name,
        price: this.price,
        details: this.descriptions,
        cover: this.coverImage,
        veg: this.veg,
        status: this.status,
        variations: JSON.stringify(this.variations),
        size: this.size,
        id: this.id,
        extra_field: JSON.stringify(extraData)
      };
      this.util.show();
      this.api.post_private('v1/foods/update', param).then((data: any) => {
        this.util.hide();
        if (data && data.status == 200) {
          this.util.showToast(this.util.translate('Food updated Successfully'), 'success', 'bottom');
          this.util.onFoodChanged();
          this.util.onBack();
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      });
    } else {
      const param = {
        restId: localStorage.getItem('uid'),
        cid: this.cid,
        name: this.name,
        price: this.price,
        details: this.descriptions,
        cover: this.coverImage,
        rating: 0,
        veg: this.veg,
        status: 1,
        variations: JSON.stringify(this.variations),
        size: this.size,
        extra_field: JSON.stringify(extraData)
      };
      this.util.show();
      this.api.post_private('v1/foods/save', param).then((data: any) => {
        this.util.hide();
        if (data && data.status == 200) {
          this.util.showToast(this.util.translate('Food Added Successfully'), 'success', 'bottom');
          this.util.onFoodChanged();
          this.util.onBack();
        } else {
          this.util.errorToast(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.hide();
        this.util.errorToast(this.util.translate('Something went wrong'));
      });

    }
  }

  delete(item: any) {
    console.log(item);
    if (item.title == 'size') {
      this.size = false;
    }
    this.variations = this.variations.filter(x => x.title != item.title);
  }

  async addItem(index: any) {
    console.log(this.variations[index]);
    const alert = await this.alertController.create({
      header: this.util.translate('Add item to') + ' ' + this.variations[index].title,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.util.translate('Add-ons name')
        },
        {
          name: 'price',
          type: 'number',
          placeholder: this.util.translate('Add-ons price')
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            if (data && data.title && data.price) {
              const item = {
                title: data.title,
                price: data.price
              };
              this.variations[index].items.push(item);
              console.log(this.variations);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  deleteSub(index: any, item: any) {
    console.log(index);
    console.log(item);
    const selected = this.variations[index].items;
    console.log('selected', selected);
    const data = selected.filter((x: any) => x.title != item.title);
    console.log(data);
    this.variations[index].items = data;
    console.log('done', this.variations);
  }

  async editSub(index: any, items: any, subIndex: any) {
    console.log(index, items, subIndex);
    console.log(this.variations);
    const alert = await this.alertController.create({
      header: this.util.translate('Edit item') + ' ' + this.variations[index].title,
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: this.util.translate('Variation name'),
          value: this.variations[index].items[subIndex].title
        },
        {
          name: 'price',
          type: 'number',
          placeholder: this.util.translate('Variation price'),
          value: this.variations[index].items[subIndex].price
        },
      ],
      buttons: [
        {
          text: this.util.translate('Cancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            this.variations[index].items[subIndex].title = data.title;
            this.variations[index].items[subIndex].price = data.price;
            console.log(this.variations);
          }
        }
      ]
    });

    await alert.present();
  }

  async preview() {
    const modal = await this.modalController.create({
      component: PreviewPage,
      cssClass: 'custom_modal2',
      componentProps: {
        name: this.name,
        variations: this.variations,
        desc: this.descriptions
      }
    });
    return await modal.present();

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
}
