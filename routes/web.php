<?php

use App\Core\Audit\Http\ActivityController;
use App\Core\Authentication\Http\Controllers\EmailVerificationController;
use App\Core\Authentication\Http\Controllers\LoginController;
use App\Core\Authentication\Http\Controllers\PasswordResetController;
use App\Core\Authentication\Http\Controllers\RegisterController;
use App\Core\Notifications\Http\NotificationController;
use App\Core\Settings\Http\ProfileController;
use App\Core\Settings\Http\SettingsController;
use App\Http\Controllers\ApiOverviewController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware('guest')->group(function (): void {
    Route::get('login', [LoginController::class, 'create'])->name('login');
    Route::post('login', [LoginController::class, 'store'])->middleware('throttle:web-login');

    Route::get('register', [RegisterController::class, 'create'])->name('register');
    Route::post('register', [RegisterController::class, 'store'])->middleware('throttle:web-login');

    Route::get('forgot-password', [PasswordResetController::class, 'request'])->name('password.request');
    Route::post('forgot-password', [PasswordResetController::class, 'email'])->middleware('throttle:web-login')->name('password.email');
    Route::get('reset-password/{token}', [PasswordResetController::class, 'create'])->name('password.reset');
    Route::post('reset-password', [PasswordResetController::class, 'store'])->middleware('throttle:web-login')->name('password.store');
});

Route::middleware('auth')->group(function (): void {
    Route::post('logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('email/verify', [EmailVerificationController::class, 'notice'])->name('verification.notice');
    Route::get('email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware(['signed', 'throttle:6,1'])->name('verification.verify');
    Route::post('email/verification-notification', [EmailVerificationController::class, 'send'])
        ->middleware('throttle:6,1')->name('verification.send');
});

Route::middleware(array_filter(['auth', 'active', config('security.require_email_verification') ? 'verified' : null]))
    ->group(function (): void {
        Route::get('settings/profile', [ProfileController::class, 'edit'])->name('settings.profile');
        Route::patch('settings/profile', [ProfileController::class, 'update']);
        Route::get('settings/password', [ProfileController::class, 'password'])->name('settings.password');
        Route::put('settings/password', [ProfileController::class, 'updatePassword']);
        Route::get('settings/sessions', [ProfileController::class, 'sessions'])->name('settings.sessions');
        Route::get('settings/application', [SettingsController::class, 'edit'])->name('settings.application');
        Route::put('settings/application', [SettingsController::class, 'update']);

        Route::get('activity', [ActivityController::class, 'index'])->name('activity');

        Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
        Route::post('notifications/read-all', [NotificationController::class, 'readAll'])->name('notifications.read-all');
        Route::post('notifications/{id}/read', [NotificationController::class, 'read'])->name('notifications.read');
        Route::delete('notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

        Route::get('api-overview', ApiOverviewController::class)->name('api.overview');
    });
