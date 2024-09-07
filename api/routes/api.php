<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\ProdutoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

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
Route::post("/register", [AuthController::class,"register"]);
Route::post("/login", [AuthController::class,"login"]);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::group(["middleware"=> ["auth:sanctum"]], function () {
    Route::get("/categorias", [CategoriaController::class,"index"]);
    Route::get("/produtos", [ProdutoController::class,"index"]);
    Route::get("/produto/{id}", [ProdutoController::class,"show"]); 
});

Route::group(["middleware"=> ["auth:sanctum", "can:admin-access"]], function () {
    //crud de categorias
    Route::post("/categoria", [CategoriaController::class,"store"]);  
    Route::get("/categoria/{id}", [CategoriaController::class,"show"]);
    Route::put("/categoria/{id}", [CategoriaController::class,"update"]);
    Route::delete("/categoria/{id}", [CategoriaController::class,"destroy"]);
    
    //crud de produtos
    Route::post("/produto", [ProdutoController::class,"store"]); 
    //não esta funcionando a atualização de um produto
    Route::post("/produto/{id}", [ProdutoController::class,"update"]);
    Route::delete("/produto/{id}", [ProdutoController::class,"destroy"]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


