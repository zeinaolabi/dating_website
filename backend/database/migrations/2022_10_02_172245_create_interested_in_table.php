<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInterestedInTable extends Migration
{
    public function up()
    {
        Schema::create('interested_in', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->integer("gender_id");
            $table->timestamps();
            $table->unique( array('user_id','gender_id') );
        });
    }

    public function down()
    {
        Schema::dropIfExists('interested_in');
    }
}
