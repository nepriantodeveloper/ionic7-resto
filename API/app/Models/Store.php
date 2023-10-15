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

class Store extends Model
{
    use HasFactory;

    protected $table = 'store';

    public $timestamps = true; //by default timestamp false

    protected $fillable = ['uid','name','mobile','lat',
                            'lng','verified','address','descriptions','images',
                            'cover','commission','open_time','close_time',
                            'isClosed','certificate_url','certificate_type','rating',
                            'total_rating','cid','cusine','time','dish','status','extra_field'];

    protected $hidden = [
         'created_at','commission'
    ];
}
