<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleCreateUserRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(ArticleCreateUserRequest $request){
        $fields = $request->validated();
        try {
            $user = User::create([
                'name' => $fields['name'],
                'email' => $fields['email'],
                'password' => bcrypt($fields['password']),
            ]);
            $this->revokeOldTokens($user);
            $token = $user->createToken('access_token')->plainTextToken;
            $response = [
                'user' => $user,
                'token' => $token,
                'authenticated' => true
            ];
            return response($response, 201);
        } catch (\Exception $e) {
            return response(['message' => 'Erro ao processar o registro.'], 500);
        }
    }

    public function login(Request $request){
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);
        $user = User::where('email', $fields['email'])->first();
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response([
                'message' => 'Credenciais inválidas.'
            ], 401);
        }
        $this->revokeOldTokens($user);
        $token = $user->createToken('access_token')->plainTextToken;
        $response = [
            'user' => $user,
            'token' => $token,
            'authenticated' => true
        ];
        return response($response, 201);
    }

    private function revokeOldTokens($user){
        DB::table('personal_access_tokens')
            ->where('tokenable_id', $user->id)
            ->where('tokenable_type', get_class($user))
            ->delete();
    }
    public function logout(Request $request){
        try {
            $user = $request->user();
            if (!$user) {
                return response(['message' => 'Usuário não autenticado.'], 401);
            }
            $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
            return response(['message' => 'Logout realizado com sucesso.'], 200);
        } catch (\Exception $e) {
            return response(['message' => 'Erro ao realizar logout.'], 500);
        }
    }

}

