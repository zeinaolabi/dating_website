<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InterestedIn extends Model
{
    use HasFactory;
    protected $table = 'interested_in';

    protected $fillable = [
        'user_id',
        'gender_id'
    ];
}
