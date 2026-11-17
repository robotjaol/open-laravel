<?php

namespace App\Core\Authentication\Http\Controllers\Api;

use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class TokenController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:100'],
        ]);

        $user = User::query()->where('email', strtolower($data['email']))->first();

        if (! $user || $user->status !== UserStatus::Active || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages(['email' => trans('auth.failed')]);
        }

        $token = $user->createToken($data['device_name'] ?? 'api')->plainTextToken;

        return response()->json(['data' => ['token' => $token, 'token_type' => 'Bearer']], 201);
    }

    public function destroy(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(status: 204);
    }
}
