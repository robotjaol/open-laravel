<?php

namespace App\Core\Settings\Http;

use App\Core\Audit\AuditLogger;
use App\Core\Authentication\Models\LoginHistory;
use App\Core\Authentication\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('settings/profile', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at?->toIso8601String(),
            ],
            'mustVerifyEmail' => (bool) config('security.require_email_verification'),
            'loginHistory' => LoginHistory::query()
                ->where('user_id', $user->id)
                ->latest('created_at')->latest('id')
                ->limit(10)
                ->get(['id', 'event', 'ip_address', 'user_agent', 'created_at'])
                ->map(fn (LoginHistory $h): array => [
                    'id' => $h->id,
                    'event' => $h->event,
                    'ip_address' => $h->ip_address,
                    'user_agent' => $h->user_agent,
                    'created_at' => $h->created_at->toIso8601String(),
                ])->all(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
        ]);
        $data['email'] = strtolower($data['email']);

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('success', 'Profile updated.');
    }

    public function password(): Response
    {
        return Inertia::render('settings/password');
    }

    public function updatePassword(Request $request, AuditLogger $audit): RedirectResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        /** @var User $user */
        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages(['current_password' => 'The current password is incorrect.']);
        }

        $user->forceFill(['password' => $data['password']])->save();
        $audit->log('auth.password_changed', 'Password changed', $user);

        return back()->with('success', 'Password updated.');
    }

    public function sessions(Request $request): Response
    {
        $supported = config('session.driver') === 'database';

        $sessions = [];
        if ($supported) {
            $sessions = DB::table(config('session.table', 'sessions'))
                ->where('user_id', $request->user()->id)
                ->orderByDesc('last_activity')
                ->get()
                ->map(fn (object $s): array => [
                    'id' => substr(hash('sha256', $s->id), 0, 12),
                    'ip_address' => $s->ip_address,
                    'user_agent' => $s->user_agent,
                    'last_active' => now()->setTimestamp((int) $s->last_activity)->toIso8601String(),
                    'current' => $s->id === $request->session()->getId(),
                ])->all();
        }

        return Inertia::render('settings/sessions', ['supported' => $supported, 'sessions' => $sessions]);
    }
}
