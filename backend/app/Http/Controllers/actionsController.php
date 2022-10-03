<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class actionsController extends Controller
{
    function getChattedUsers($id){


        $user = User::
        where("id", 1)
            ->get();

        $chattedUsers = User::select("name")->
        join("messages", "receiver_id", "=", "users.id")->
        where('sender_id', $id)->get();

        return response()->json([
            "status" => "Success",
            "data" => $chattedUsers
        ]);
    }
}
