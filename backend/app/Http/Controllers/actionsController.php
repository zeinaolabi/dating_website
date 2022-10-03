<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class actionsController extends Controller
{
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


}
