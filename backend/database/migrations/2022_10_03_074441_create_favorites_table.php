<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFavoritesTable extends Migration
{
    public function up()
    {
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->integer("favoreduser_id");
            $table->timestamps();
            $table->unique( array('user_id','favoreduser_id') );
        });
    }

    public function down()
    {
        Schema::dropIfExists('favorites');
    }
}
