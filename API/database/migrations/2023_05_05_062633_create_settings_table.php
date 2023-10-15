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
        Schema::create('settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('currencySymbol');
            $table->string('currencySide');
            $table->string('appDirection');
            $table->string('logo');
            $table->string('sms_name');
            $table->text('sms_creds');
            $table->tinyInteger('delivery');
            $table->tinyInteger('home_ui');
            $table->tinyInteger('reset_pwd');
            $table->tinyInteger('user_login');
            $table->tinyInteger('store_login');
            $table->tinyInteger('driver_login');
            $table->tinyInteger('web_login');
            $table->text('fcm_token')->nullable();
            $table->tinyInteger('driver_assignments');
            $table->string('default_country_code');
            $table->text('country_modal');
            $table->double('allowDistance');
            $table->tinyInteger('searchResultKind')->default(0);
            $table->double('search_radius',10,2)->default(10);
            $table->tinyInteger('user_verify_with')->default(0);
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
        Schema::dropIfExists('settings');
    }
};
