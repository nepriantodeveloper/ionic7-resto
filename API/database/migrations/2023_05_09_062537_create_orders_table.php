<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('address');
            $table->tinyInteger('applied_coupon');
            $table->integer('coupon_id');
            $table->integer('did')->default(0);
            $table->double('delivery_charge',10,2);
            $table->double('discount',10,2);
            $table->double('grand_total',10,2);
            $table->text('orders');
            $table->text('paid');
            $table->string('pay_method');
            $table->integer('restId');
            $table->double('serviceTax',10,2);
            $table->timestamp('time');
            $table->double('total',10,2);
            $table->integer('uid');
            $table->text('notes');
            $table->tinyInteger('wallet_used')->default(0);
            $table->double('wallet_price',10,2)->nullable();
            $table->string('status')->default('created');
            $table->text('extra_field')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
};
