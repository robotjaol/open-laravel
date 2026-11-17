<?php

use App\Core\Authentication\Http\Controllers\Api\MeController;
use App\Core\Authentication\Http\Controllers\Api\TokenController;
use Illuminate\Support\Facades\Route;

/*
 | Core API, served under /api/v1. Module routes are registered by each module's own routes/api.php.
 */
Route::prefix('v1')->name('api.v1.')->group(function (): void {
    Route::post('auth/token', [TokenController::class, 'store'])->middleware('throttle:api-login')->name('auth.token');

    Route::middleware(['auth:sanctum', 'active'])->group(function (): void {
        Route::delete('auth/token', [TokenController::class, 'destroy'])->name('auth.revoke');
        Route::get('me', MeController::class)->name('me');
    });
});
