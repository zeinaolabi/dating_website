<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\InterestedIn;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Validator;

class userController extends Controller
{
    function getMatches($id){
        //Get IDs of blocked &invisible users
        $blockedUsers = Block::where('user_id',$id)->pluck('blockeduser_id');
        $invisibleUsers = User::where("visibility","=",0)->get();
        $user = User::find($id);

        //Get all users that are not blocked/invisible
        $matches = User::select("*")->
        where('id', '<>', $id)->
        whereNotIn('users.id',$blockedUsers)->
        whereNotIn('users.id', $invisibleUsers)->
        orderBy(DB::raw(
            'ST_DISTANCE_SPHERE(Point(latitude, longitude), Point('.$user->latitude.','.$user->longitude.'))'
        ), 'desc')->get();

        //If no results were returned, display an error
        if($matches->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No Matches"
            ], 400);
        }

        //Send back a json response with the result
        return response()->json($matches, 201);
    }

    function getFemaleMatches($id){
        //Get IDs of blocked &invisible users
        $blockedUsers = Block::where('user_id',$id)->pluck('blockeduser_id');
        $invisibleUsers = User::where("visibility","=",0)->get();
        $user = User::find($id);

        //Get all users that are not blocked/invisible
        $matches = User::select("*")->
        where("users.gender", "=", "Female")->
        where('id', '<>', $id)->
        whereNotIn('users.id',$blockedUsers)->
        whereNotIn('users.id', $invisibleUsers)->
        orderBy(DB::raw(
            'ST_DISTANCE_SPHERE(Point(latitude, longitude), Point('.$user->latitude.','.$user->longitude.'))'
        ), 'desc')->get();

        //If no results were returned, display an error
        if($matches->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No Matches"
            ], 400);
        }

        //Send back a json response with the result
        return response()->json($matches, 201);
    }

    function getMaleMatches($id){
        //Get IDs of blocked &invisible users
        $blockedUsers = Block::where('user_id',$id)->pluck('blockeduser_id');
        $invisibleUsers = User::where("visibility","=",0)->get();
        $user = User::find($id);

        //Get all users that are not blocked/invisible
        $matches = User::select("*")->
        where("users.gender", "=", "Male")->
        where('id', '<>', $id)->
        whereNotIn('users.id',$blockedUsers)->
        whereNotIn('users.id', $invisibleUsers)->
        orderBy(DB::raw(
            'ST_DISTANCE_SPHERE(Point(latitude, longitude), Point('.$user->latitude.','.$user->longitude.'))'
        ), 'desc')->get();

        //If no results were returned, display an error
        if($matches->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No Matches"
            ], 400);
        }

        //Send back a json response with the result
        return response()->json($matches, 201);
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
        $invisibleUsers = User::where("visibility","=",0)->get();

        //Get all favorite users that are not blocked
        $favUsers = User::select("*")->
        join("favorites", "users.id", "=", "favoreduser_id")->
        whereNotIn('users.id',$blockedUsers)->
        whereNotIn('users.id', $invisibleUsers)->
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
        join("interested_in", "users.id", "=", "user_id")->
        where("users.id", "=", $id)->get();

        //If no result were returned, display an error
        if($profileInfo->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No blocked Users"
            ], 400);
        }

        $profileInfo[0]->image =  base64_encode(file_get_contents($profileInfo[0]->image));

        //Send back a json respone with the result
        return response()->json($profileInfo, 201);
    }

    function updateProfile(Request $request){
        //Validate input
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'name' => 'string|between:2,100',
            'bio' => 'string|max:100',
            'age' => 'integer',
            'longitude' => 'string',
            'latitude' => 'string',
            'visibility' => 'integer',
            'gender_id' => 'integer',
            'image' => 'string',
        ]);

        //If the validator failed, send back an error
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        //Get the user info depending on the id, get the interests of the user
        $profile = User::find($request->id);
        $id = InterestedIn::where("user_id", "=", $request->id)->get()[0]->id;
        $interests = InterestedIn::find($id);

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
        $profile->longitude = $request->longitude != null ? $request->longitude : $profile->longitude;
        $profile->latitude = $request->latitude != null ? $request->latitude : $profile->latitude;
        $profile->visibility = $request->visibility != null ? $request->visibility : $profile->visibility;
        $interests->gender_id = $request->gender_id != null ? $request->gender_id : $interests->gender_id;

        if ($request->image) {
            $folderPath = public_path()."/images/";

            $base64Image = explode(";base64,", $request->image);
            $explodeImage = explode("image/", $base64Image[0]);
            $imageType = $explodeImage[1];
            $image_base64 = base64_decode($base64Image[1]);
            $file = $folderPath . uniqid() .'.'. $imageType;

            file_put_contents($file, $image_base64);
            $profile->image = $file;
        }

        //If the new data wasn't saved, send back an error
        if(!$profile->save()){
            return response()->json([
                'message' => 'Unsuccessful Editing',
            ], 400);
        }

        if(!$interests->save()){
            return response()->json([
                'message' => 'Unsuccessful Editing',
            ], 400);
        }

        $profile->interested_in = $interests->gender_id;

        //Return a json response with the data
        return response()->json([
            'message' => 'Successfully Edited',
            'user' => $profile
        ], 201);
    }
}
