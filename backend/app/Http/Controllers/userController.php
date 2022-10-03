<?php

namespace App\Http\Controllers;

use App\Models\Block;
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

    function getBlocked($id){
        $blockedUsers = User::select("*")->
            join("blocks", "users.id", "=", "blockeduser_id")->
        where("user_id", "=", $id)->get();

        if($blockedUsers->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No blocked Users"
            ], 400);
        }

        return response()->json($blockedUsers, 201);
    }

    function getFavorite($id){
        $favUsers = User::select("*")->
        join("favorites", "users.id", "=", "favoreduser_id")->
        where("user_id", "=", $id)->get();

        if($favUsers->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No blocked Users"
            ], 400);
        }

        return response()->json($favUsers, 201);
    }
}
