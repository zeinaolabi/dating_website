<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\InterestedIn;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

class userController extends Controller
{
    function getMatches(){

    }

    function getMatch($match_id){
        //Get all user's info depending on ID
        $match = User::select("*")->
        where("id", "=", $match_id)->get();

        //If no result were returned, display an error
        if($match->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "User doesn't exist"
            ], 400);
        }

        //Send back a json response with the result
        return response()->json($match, 201);
    }

    function getBlocked($id){
        //Get all blocked users
        $blockedUsers = User::select("*")->
            join("blocks", "users.id", "=", "blockeduser_id")->
        where("user_id", "=", $id)->get();

        //If no users are blocked, display an error
        if($blockedUsers->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No blocked Users"
            ], 400);
        }

        //Send back a json response with the result
        return response()->json($blockedUsers, 201);
    }

    function getFavorite($id){
        //Get IDs of blocked users
        $blockedUsers = Block::where('user_id',$id)->pluck('blockeduser_id');

        //Get all favorite users that are not blocked
        $favUsers = User::select("*")->
        join("favorites", "users.id", "=", "favoreduser_id")->
        whereNotIn('users.id',$blockedUsers)->
        where("favorites.user_id", "=", $id)->get();

        //If no results were returned, display an error
        if($favUsers->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No Favorite Users"
            ], 400);
        }

        //Send back a json response with the result
        return response()->json($favUsers, 201);
    }

    function getProfileInfo($id){
        //Get user's info depending on the ID
        $profileInfo = User::select("*")->
        where("id", "=", $id)->get();

        //If no result were returned, display an error
        if($profileInfo->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No blocked Users"
            ], 400);
        }

        //Send back a json respone with the result
        return response()->json($profileInfo, 201);
    }

    function updateProfile(Request $request){
        //Validate input
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'name' => 'string|between:2,100',
            'bio' => 'string|max:150',
            'age' => 'integer',
            'location' => 'string',
            'visibility' => 'integer',
            'gender_id' => 'integer',
            'image' => 'string'
        ]);

        //If the validator failed, send back an error
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        //Get the user info depending on the id, get the interests of the user
        $profile = User::find($request->id);
        $interests = InterestedIn::where("user_id", "=", $request->gender_id)->get();

        //If the user doesn't exist, display an error
        if($profile == null){
            return response()->json([
                'message' => 'No Such User',
            ], 400);
        }

        //Modify the info depending on the user's sent data
        $profile->name = $request->name != null ? $request->name : $profile->name;
        $profile->bio = $request->bio != null ? $request->bio : $profile->bio;
        $profile->age = $request->age != null ? $request->age : $profile->age;
        $profile->location = $request->location != null ? $request->location : $profile->location;
        $profile->visibility = $request->visibility != null ? $request->visibility : $profile->visibility;
        $interests->gender_id = $request->gender_id != null ? $request->gender_id : $profile->gender_id;

        //Get the image and save it in a folder
        if($request->hasFile('image')){
            $destination_path = "public/images";
            $image = $request->file('image');
            $imageName = $image->getClientOriginalName();
            $request->file('image')->storeAs($destination_path, $imageName);

            $profile->image = $imageName;
        }

        //If the new data wasn't saved, send back an error
        if(!$profile->save()){
            return response()->json([
                'message' => 'Unsuccessful Editing',
            ], 400);
        }

        //Return a json response with the data
        return response()->json([
            'message' => 'Successfully Edited',
            'user' => $profile
        ], 201);
    }
}
