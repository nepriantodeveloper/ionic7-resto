/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
import { Component } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    message: '',
    status: '0',
    register_date: moment().format('YYYY-MM-DD')
  };
  constructor(
    public util: UtilService,
    public api: ApiService
  ) {
    console.log('general', this.util.generalSettings);
  }

  ngOnInit(): void {
  }
  submit() {
    console.log('contact', this.contact);
    if (this.contact.name == '' || this.contact.email == '' || this.contact.message == '') {
      this.util.errorToast(this.util.translate('All Fields are required'));
      return false;
    }
    const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailfilter.test(this.contact.email)) {
      this.util.errorToast(this.util.translate('Please enter valid email'));
      return false;
    }

    this.util.start();
    this.api.post_public('v1/contacts/create', this.contact).then((data: any) => {
      this.util.stop();
      if (data && data.status && data.status == 200 && data.data) {
        const param = {
          id: data.data.id,
          mediaURL: this.api.mediaURL,
          subject: this.util.translate('New Mail Request Received'),
          thank_you_text: this.util.translate('You have received new mail'),
          header_text: this.util.translate('New Contact Details'),
          email: this.util.generalSettings.email,
          from_mail: this.contact.email,
          from_username: this.contact.name,
          from_message: this.contact.message,
          to_respond: this.util.translate('We have received your request, we will respond on your issue soon')
        };
        console.log(param);
        this.api.post_public('v1/sendMailToAdmin', param).then((data: any) => {
          console.log(data);
        }, error => {
          console.log(error);
        });
        this.contact.email = '';
        this.contact.name = '';
        this.contact.message = '';
        if (data && data.status == 200) {
          this.success();
        } else {
          this.util.apiErrorHandler(data);
        }
      }

    }, error => {
      console.log(error);
      this.util.stop();
      this.util.apiErrorHandler(error);
    });
  }

  success() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });

    Toast.fire({
      icon: 'success',
      title: this.util.translate('message sent successfully')
    });
  }
}
