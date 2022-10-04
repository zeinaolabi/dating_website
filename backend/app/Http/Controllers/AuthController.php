<?php
namespace App\Http\Controllers;
use App\Models\InterestedIn;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Validator;

class AuthController extends Controller
{
    public function login(Request $request){
        //Validate the input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        //If the validation failed, display an error
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        //If authorization failed, display an error
        if (!$token = auth()->attempt($validator->validated())) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        //Send back a token
        return $this->createNewToken($token);
    }

    public function register(Request $request) {
        //Validate all input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|between:2,100',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|min:6',
            'age' => 'required|string',
            'gender' => 'required|string|max:6',
            'longitude' => 'required|string',
            'latitude' => 'required|string'
        ]);

        //Validate the gender id
        $interestedIn = Validator::make($request->all(), [
            'gender_id' => 'required|integer',
        ]);

        //If validation failed, display an error
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(), 400);
        }
        if($interestedIn->fails()){
            return response()->json($interestedIn->errors()->toJson(), 400);
        }

        //Create a new user with a hashed password
        $user = User::create(array_merge(
            $validator->validated(),
            ['password' => Hash::make($request->password)]
        ));

        //Add the interested in gender
        InterestedIn::create([
            'user_id' => $user->id,
            'gender_id' => $request->gender_id,
        ]);

        $user->token = auth()->login($user);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }

    public function logout() {
        auth()->logout();
        return response()->json(['message' => 'User successfully signed out']);
    }

    public function refresh() {
        return $this->createNewToken(auth()->refresh());
    }

    public function userProfile() {
        return response()->json(auth()->user());
    }

    protected function createNewToken($token){
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user' => auth()->user()
        ]);
    }
}
