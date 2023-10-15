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

class Orders extends Model
{
    use HasFactory;

    protected $table = 'orders';

    public $timestamps = true; //by default timestamp false

    protected $fillable = ['address','applied_coupon','coupon_id','did',
                            'delivery_charge','discount','grand_total','orders',
                            'paid','pay_method','restId','serviceTax','time','total',
                            'wallet_used','wallet_price','uid','notes','status','extra_field'];

    protected $hidden = [
         'created_at',
    ];
}
