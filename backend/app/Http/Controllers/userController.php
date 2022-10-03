<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class userController extends Controller
{
    function getMatches(){

    }

    function getMatch($match_id){
        $match = User::select("*")->
        where("id", "=", $match_id)->get();

        if($match->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "User doesn't exist"
            ], 400);
        }

        return response()->json($match, 201);
    }
}
