<?php

namespace App\Http\Controllers;

use App\Models\Block;
use App\Models\User;
use Illuminate\Http\Request;
use Validator;

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

    function getProfileInfo($id){
        $profileInfo = User::select("*")->
        where("id", "=", $id)->get();

        if($profileInfo->isEmpty()){
            return response()->json([
                'status' => "Error",
                'message' => "No blocked Users"
            ], 400);
        }

        return response()->json($profileInfo, 201);
    }

    function updateProfile(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'name' => 'string|between:2,100',
            'bio' => 'string|max:150',
            'age' => 'integer',
            'location' => 'string',
            'visibility' => 'integer',
            'interested_in' => 'integer',
            'image' => 'string'
        ]);

        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }

        $profile = User::find($request->id);

        if($profile == null){
            return response()->json([
                'message' => 'No Such User',
            ], 400);
        }

        $profile->name = $request->name != null ? $request->name : $profile->name;
        $profile->bio = $request->bio != null ? $request->bio : $profile->bio;
        $profile->age = $request->age != null ? $request->age : $profile->age;
        $profile->location = $request->location != null ? $request->location : $profile->location;
        $profile->visibility = $request->visibility != null ? $request->visibility : $profile->visibility;

        if($request->hasFile('image')){
            $destination_path = "public/images";
            $image = $request->file('image');
            $imageName = $image->getClientOriginalName();
            $request->file('image')->storeAs($destination_path, $imageName);

            $profile->image = $imageName;
        }

        if(!$profile->save()){
            return response()->json([
                'message' => 'Unsuccessful Editing',
            ], 400);
        }

        return response()->json([
            'message' => 'Successfully Edited',
            'user' => $profile
        ], 201);
    }
}
