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
        Schema::create('general', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->text('mobile');
            $table->text('email');
            $table->text('address');
            $table->text('city');
            $table->text('state');
            $table->text('zip');
            $table->text('country');
            $table->double('min',10,2);
            $table->double('free',10,2);
            $table->double('tax',10,2);
            $table->string('shipping');
            $table->double('shippingPrice',10,2);
            $table->double('allowDistance',10,2);
            $table->text('facebook');
            $table->text('instagram');
            $table->text('twitter');
            $table->text('google_playstore');
            $table->text('apple_appstore');
            $table->text('web_footer');
            $table->tinyInteger('status')->default(1);
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
        Schema::dropIfExists('general');
    }
};
