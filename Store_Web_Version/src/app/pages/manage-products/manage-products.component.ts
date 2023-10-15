/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { brandSet, flagSet, freeSet } from '@coreui/icons';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit {
  @ViewChild('newAddone') public newAddone: ModalDirective;
  @ViewChild('contentVarient') public contentVarient: ModalDirective;

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

  addonName: any;
  addonType: any = 'radio';

  variant_title: any = '';
  variant_price: any;
  variatIndex: any;
  subIndex: any;
  sub: boolean;

  constructor(
    public util: UtilService,
    public api: ApiService,
    private route: ActivatedRoute,
    private navCtrl: Location,
    private iconSetService: IconSetService,
  ) {
    iconSetService.icons = { ...brandSet, ...flagSet, ...freeSet };
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
    })
  }

  ngOnInit(): void {
  }

  onBack() {
    this.navCtrl.back();
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
        this.util.error(this.util.translate('Product not found'));
      }
    }, error => {
      console.log(error);
      this.isLoaded = true;
      this.util.error(this.util.translate('Something went wrong'));
    }).catch(error => {
      console.log(error);
      this.isLoaded = true;
      this.util.error(this.util.translate('Something went wrong'));
    });
  }

  submit() {
    if (this.name == '' || !this.name || this.cid == '' ||
      !this.cid || this.price == '' || !this.price || this.descriptions == '' || !this.descriptions) {
      this.util.error(this.util.translate('All Fields are required'));
      return false;
    }
    if (!this.coverImage || this.coverImage == '') {
      this.util.error(this.util.translate('Please add your cover image'));
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
          this.util.success('Food updated Successfully');
          this.onBack();
        } else {
          this.util.error(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.error(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.hide();
        this.util.error(this.util.translate('Something went wrong'));
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
          this.util.success('Food Added Successfully');
          this.onBack();
        } else {
          this.util.error(this.util.translate('Something went wrong'));
        }
      }, error => {
        console.log(error);
        this.util.hide();
        this.util.error(this.util.translate('Something went wrong'));
      }).catch(error => {
        console.log(error);
        this.util.hide();
        this.util.error(this.util.translate('Something went wrong'));
      });

    }
  }

  preview_banner(files: any) {
    console.log('fle', files);
    if (files.length == 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    if (files) {
      console.log('ok');
      this.util.show();
      this.api.uploadFile(files).subscribe((data: any) => {
        console.log('==>>>>>>', data.data);
        this.util.hide();
        if (data && data.data.image_name) {
          this.coverImage = data.data.image_name;
        }
      }, err => {
        console.log(err);
        this.util.hide();
      });
    } else {
      console.log('no');
    }
  }

  changeSize(event: any) {
    console.log(event.target.value, this.size);
    if (event.target.value == '1') {
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

  addNew() {
    this.newAddone.show();
  }

  addNewAddon() {
    if (this.addonName && this.addonName != '') {
      const item = {
        title: this.addonName,
        type: this.addonType,
        items: []
      };
      this.variations.push(item);
      this.newAddone.hide();
    } else {
      this.util.error(this.util.translate('All Field are required'));
    }
  }

  close3() {
    if (this.sub == false) {
      if (this.variant_title && this.variant_price && this.variant_price != 0 && this.variant_price > 0) {
        const item = {
          title: this.variant_title,
          price: parseFloat(this.variant_price),
        };
        this.variations[this.variatIndex].items.push(item);
        this.contentVarient.hide();
        this.variant_title = '';
        this.variant_price = 0;

        this.variatIndex = '';
      } else {
        this.util.error(this.util.translate('Please add title and price'));
      }
    } else {
      if (this.variant_title && this.variant_price && this.variant_price != 0 && this.variant_price > 0) {
        this.variations[this.variatIndex].items[this.subIndex].title = this.variant_title;
        this.variations[this.variatIndex].items[this.subIndex].price = parseFloat(this.variant_price);

        this.contentVarient.hide();
      } else {
        this.util.error(this.util.translate('Please add title and price'));
      }
    }

  }

  async addItem(index: any) {
    console.log(this.variations[index]);
    this.sub = false;
    this.variatIndex = index;
    this.variant_price = 0;
    this.variant_title = '';
    this.contentVarient.show();
  }

  delete(item: any) {
    console.log(item);
    if (item.title == 'size') {
      this.size = false;
    }
    this.variations = this.variations.filter(x => x.title != item.title);
  }

  async editSub(index: any, items: any, subIndex: any) {
    console.log(this.variations[index].items[subIndex]);
    this.sub = true;
    this.variatIndex = index;
    this.subIndex = subIndex;
    this.variant_title = this.variations[index].items[subIndex].title;
    this.variant_price = this.variations[index].items[subIndex].price;
    this.contentVarient.show();
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
}
