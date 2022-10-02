<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateActionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('actions', function (Blueprint $table) {
            $table->id();
            $table->integer("user_id");
            $table->integer("blockeduser_id");
            $table->integer("favoreduser_id");
            $table->timestamps();
            $table->unique( array('user_id','blockeduser_id') );
            $table->unique( array('user_id','favoreduser_id') );
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('actions');
    }
}
