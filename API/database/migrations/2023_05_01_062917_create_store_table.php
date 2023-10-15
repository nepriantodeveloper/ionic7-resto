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
        Schema::create('store', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('uid');
            $table->string('name');
            $table->string('mobile');
            $table->string('lat');
            $table->string('lng');
            $table->tinyInteger('verified')->default(1);
            $table->text('address');
            $table->text('descriptions');
            $table->text('images');
            $table->string('cover');
            $table->double('commission',10,2);
            $table->string('open_time');
            $table->string('close_time');
            $table->tinyInteger('isClosed')->default(0);
            $table->string('certificate_url')->nullable();
            $table->string('certificate_type')->nullable();
            $table->double('rating',10,2)->default(0);
            $table->integer('total_rating');
            $table->integer('cid');
            $table->text('cusine');
            $table->string('time');
            $table->text('dish');
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
        Schema::dropIfExists('store');
    }
};
