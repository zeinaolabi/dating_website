<?php

use App\Http\Controllers\actionsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/send_message', [actionsController::class, 'sendMessage']);
    Route::get('/get_chatted_with/{id}', [actionsController::class, 'getChattedUsers']);
    Route::get('/get_chat/{id}/{match_id}', [actionsController::class, 'getChat']);
    Route::get('/is_favored/{id}/{match_id}', [actionsController::class, 'isFavored']);
    Route::post('/add_to_favorites', [actionsController::class, 'addToFav']);
    Route::post('/remove_from_favorites', [actionsController::class, 'removeFromFav']);
    Route::post('/block', [actionsController::class, 'block']);
    Route::post('/unblock', [actionsController::class, 'unblock']);


});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
