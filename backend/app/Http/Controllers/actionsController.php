<?php

namespace App\Http\Controllers;

use App\Models\Action;
use App\Models\Block;
use App\Models\Favorite;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class actionsController extends Controller
{
    function sendMessage(Request $request){
        //Validate input
        $validator = Validator::make($request->all(), [
            'sender_id' => 'required',
            'receiver_id' => 'required',
            'message' => 'required|string|max:150',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        //Check if users exist
        $userID = User::find($request->sender_id);
        $receiverID = User::find($request->receiver_id);

        //If users don't exist, display an error
        if($userID == null || $receiverID == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Create a new message
        Message::create($validator->validated());

        //Return a json response
        return response()->json([
            'status' => 'Message sent',
        ], 201);
    }

    function getChattedUsers($id){
        $blockedUsers = Block::where('user_id',$id)->pluck('blockeduser_id');

        //Get the users that have been chatted with
        $chattedUsers = User::select("users.id", "name", "image")->
        join("messages", "receiver_id", "=", "users.id")->
        where('sender_id', $id)->distinct()->
        whereNotIn('users.id',$blockedUsers)->get();

        //Send back a json response with the result
        return response()->json($chattedUsers);
    }

    function getChat($id, $match_id){
        //Check if users exist
        $userID = User::find($id);
        $matchID = User::find($match_id);

        //If users don't exist, display an error
        if($userID == null || $matchID == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Get messages between the two users ordered from oldest to newest
        $chats = Message::select("*")->
        where([
            ['sender_id', '=', $id],
            ['receiver_id', '=', $match_id],
        ])->
        orWhere([
            ['sender_id', '=', $match_id],
            ['receiver_id', '=', $id],
        ])->
        orderBy('created_at', 'desc')->
        get();

        //Return a json response with the data
        return response()->json([
            "status" => "Success",
            "data" => $chats
        ]);
    }

    function isFavored($id, $match_id){
        //Check if users exist
        $userID = User::find($id);
        $matchID = User::find($match_id);

        //If users don't exist, display an error
        if($userID == null || $matchID == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Check if a certain user is favored or not
        $isFavored = Favorite::select("*")->
        where([
            ['user_id', '=', $id],
            ['favoreduser_id', '=', $match_id],
        ])->
        get();

        //Return a json response with a boolean
        return response()->json([
            "isLiked" => !$isFavored->isEmpty()
        ]);
    }

    function addToFav(Request $request){
        //Validate input
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'favoreduser_id' => 'required',
        ]);

        //If the validator failed, display an error
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        //Check if users exist
        $userID = User::find($request->user_id);
        $favoreduser_id = User::find($request->favoreduser_id);

        //If users don't exist, display an error
        if($userID == null || $favoreduser_id == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Check if the user is blocked
        $isBlocked = Block::select("*")->
        where([
            ['user_id', '=', $request->user_id],
            ['blockeduser_id', '=', $request->required],
        ])->
        get();

        //If the user is blocked, display an error
        if(!$isBlocked->isEmpty()){
            return response()->json([
                "Message" => "Can't Favorite a Blocked User"
            ], 400);
        }

        //Add user to favorites
        Favorite::create($validator->validated());

        //Return a success response
        return response()->json([
            'status' => 'Added to Favorites',
        ], 201);
    }

    function removeFromFav(Request $request){
        //Validate input
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'favoreduser_id' => 'required|integer',
        ]);

        //If the validation failed, display an error
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        //Check if users exist
        $userID = User::find($request->user_id);
        $favoreduser_id = User::find($request->favoreduser_id);

        //If users don't exist, display an error
        if($userID == null || $favoreduser_id == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Delete record from the table
        $favored = Favorite::where([
            ['user_id', '=', $request->user_id],
            ['favoreduser_id', '=', $request->favoreduser_id],
        ])->delete();

        //If no record was returned back, display an error
        if($favored == 0){
            return response()->json([
                'status' => 'User not in Favorites',
            ], 201);
        }

        //Return a success response
        return response()->json([
            'status' => 'Removed from Favorites',
        ], 201);
    }

    function isBlocked($id, $match_id){
        //Check if users exist
        $userID = User::find($id);
        $matchID = User::find($match_id);

        //If users don't exist, display an error
        if($userID == null || $matchID == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Check if a certain user is blocked or not
        $isBlocked = Block::select("*")->
        where([
            ['user_id', '=', $id],
            ['blockeduser_id', '=', $match_id],
        ])->
        get();

        //Return a json response with a boolean
        return response()->json([
            "isBlocked" => !$isBlocked->isEmpty()
        ]);
    }

    function block(Request $request){
        //Validate input
        $validator = Validator::make($request->all(), [
            'user_id' => 'required',
            'blockeduser_id' => 'required',
        ]);

        //If validation failed, display an error
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        //Check if users exist
        $userID = User::find($request->user_id);
        $blockeduser_id = User::find($request->blockeduser_id);

        //If users don't exist, display an error
        if($userID == null || $blockeduser_id == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Check if user is already blocked
        $isBlocked = Block::where([
            ['user_id', '=', $request->user_id],
            ['blockeduser_id', '=', $request->blockeduser_id],
        ])->get();

        //If user is blocked, display an error
        if(!$isBlocked->isEmpty()){
            return response()->json([
                'status' => 'User Already Blocked',
            ], 400);
        }

        //Add block record to the database
        Block::create($validator->validated());

        //Return a success response
        return response()->json([
            'status' => 'User Blocked',
        ], 201);
    }

    function unblock(Request $request){
        //Validate input
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|integer',
            'blockeduser_id' => 'required|integer',
        ]);

        //If validation failed, display an error
        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        //Check if users exist
        $userID = User::find($request->user_id);
        $blockeduser_id = User::find($request->blockeduser_id);

        //If users don't exist, display an error
        if($userID == null || $blockeduser_id == null){
            return response()->json([
                'status' => 'Invalid Users',
            ], 400);
        }

        //Block the user
        $isBlocked = Block::where([
            ['user_id', '=', $request->user_id],
            ['blockeduser_id', '=', $request->blockeduser_id],
        ])->delete();

        //If blocking wasn't successful, display an error
        if($isBlocked == 0){
            return response()->json([
                'status' => 'User not Blocked',
            ], 201);
        }

        //Return a success response
        return response()->json([
            'status' => 'User Unblocked',
        ], 201);
    }
}
