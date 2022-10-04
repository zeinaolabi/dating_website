<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlocksTable extends Migration
{
    public function up()
    {
        Schema::create('blocks', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->integer("blockeduser_id");
            $table->timestamps();
            $table->unique( array('user_id','blockeduser_id') );
        });
    }

    public function down()
    {
        Schema::dropIfExists('blocks');
    }
}
