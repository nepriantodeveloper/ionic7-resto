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

class General extends Model
{
    use HasFactory;

    protected $table = 'general';

    public $timestamps = true; //by default timestamp false

    protected $fillable = ['name','mobile','email','address','city','state',
                            'zip','country','min','free','tax','shipping',
                            'shippingPrice','allowDistance','facebook',
                            'instagram','twitter','google_playstore',
                            'apple_appstore','web_footer','status','extra_field'];

    protected $hidden = [
         'created_at',
    ];
}
