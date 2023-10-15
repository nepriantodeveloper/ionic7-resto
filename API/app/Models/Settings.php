<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    use HasFactory;

    protected $table = 'settings';

    public $timestamps = true; //by default timestamp false

    protected $fillable = ['currencySymbol','currencySide','appDirection','logo',
                            'sms_name','sms_creds','delivery','home_ui','reset_pwd',
                            'user_login','store_login','driver_login','web_login',
                            'default_country_code','country_modal','allowDistance','searchResultKind',
                            'search_radius','user_verify_with',
                            'fcm_token','driver_assignments','status','extra_field'];

    protected $hidden = [
         'created_at','fcm_token','sms_creds'
    ];
}
