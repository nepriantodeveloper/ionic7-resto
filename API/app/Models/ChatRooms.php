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

class ChatRooms extends Model
{
    use HasFactory;

    protected $table = 'chat_rooms';

    public $timestamps = true; //by default timestamp false

    protected $fillable = ['sender_id','receiver_id','last_message','last_message_type','status','extra_fields'];

    protected $hidden = [
         'created_at',
    ];
}
