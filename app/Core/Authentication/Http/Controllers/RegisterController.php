<?php

namespace App\Core\Authentication\Http\Controllers;

use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Http\Requests\RegisterRequest;
use App\Core\Authentication\Models\User;
use App\Core\Settings\SettingsService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class RegisterController extends Controller
{
    /** Role granted to self-registered accounts: least privilege. */
    public const DEFAULT_ROLE = 'Viewer';

    public function create(SettingsService $settings): Response
    {
        abort_unless($settings->get('registration_enabled'), 404);

        return Inertia::render('auth/register');
    }

    public function store(RegisterRequest $request, SettingsService $settings): RedirectResponse
    {
        abort_unless($settings->get('registration_enabled'), 404);

        $user = DB::transaction(function () use ($request): User {
            $user = User::create([
                'name' => $request->validated('name'),
                'email' => $request->validated('email'),
                'password' => $request->validated('password'),
                'status' => UserStatus::Active,
            ]);

            $user->assignRole(self::DEFAULT_ROLE);

            if (! config('security.require_email_verification')) {
                $user->forceFill(['email_verified_at' => now()])->save();
            }

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }
}
