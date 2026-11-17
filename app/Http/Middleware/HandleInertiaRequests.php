<?php

namespace App\Http\Middleware;

use App\Core\Authentication\Models\User;
use App\Core\Settings\SettingsService;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    /**
     * Props shared with every page. Keep this small: it is serialised into every response.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user instanceof User ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'status' => $user->status->value,
                    'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                ] : null,
                'permissions' => $user instanceof User ? $this->permissionsFor($user) : [],
                'roles' => $user instanceof User ? $user->getRoleNames()->all() : [],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'status' => fn () => $request->session()->get('status'),
            'notifications' => [
                'unread' => fn () => $user instanceof User ? $user->unreadNotifications()->count() : 0,
            ],
            'features' => [
                'registration' => (bool) app(SettingsService::class)->get('registration_enabled'),
            ],
        ];
    }

    /**
     * Permission names used only to show or hide UI. The server re-checks every action.
     *
     * @return list<string>
     */
    private function permissionsFor(User $user): array
    {
        return $user->isSuperAdmin()
            ? ['*']
            : $user->getAllPermissions()->pluck('name')->values()->all();
    }
}
