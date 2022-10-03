<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Favorite;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class actionsController extends Controller
{
    function sendMessage(Request $request){
        $validator = Validator::make($request->all(), [
            'sender_id' => 'required',
            'receiver_id' => 'required',
            'message' => 'required|string|max:150',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = Message::create($validator->validated());

        return response()->json([
            'status' => 'Message sent',
        ], 201);
    }

    function getChattedUsers($id){
        $chattedUsers = User::select("users.id", "name")->
        join("messages", "receiver_id", "=", "users.id")->
        where('sender_id', $id)->get();

        return response()->json([
            "status" => "Success",
            "data" => $chattedUsers
        ]);
    }

    function getChat($id, $match_id){
        $chats = Message::select("message", "messages.created_at")->
        where([
            ['sender_id', '=', $id],
            ['receiver_id', '=', $match_id],
        ])->
        orWhere([
            ['sender_id', '=', $id],
            ['receiver_id', '=', $match_id],
        ])->
        orderBy('created_at', 'asc')->
        get();

        return response()->json([
            "status" => "Success",
            "data" => $chats
        ]);
    }

    function isFavored($id, $match_id){
        $isFavored = Favorite::select("*")->
        where([
            ['user_id', '=', $id],
            ['favoreduser_id', '=', $match_id],
        ])->
        get();

        return response()->json([
            "isLiked" => !$isFavored->isEmpty()
        ]);
    }

    function addToFav(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'favoreduser_id' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        Favorite::create($validator->validated());

        return response()->json([
            'status' => 'Added to Favorites',
        ], 201);
    }

    function removeFromFav(Request $request){
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'favoreduser_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $test = Favorite::where([
            ['user_id', '=', $request->user_id],
            ['favoreduser_id', '=', $request->favoreduser_id],
        ])->delete();

        if($test == 0){
            return response()->json([
                'status' => 'User not in Favorites',
            ], 201);
        }
        else{
            return response()->json([
                'status' => 'Removed from Favorites',
            ], 400);
        }
    }

}
