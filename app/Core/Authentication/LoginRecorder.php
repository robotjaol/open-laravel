<?php

namespace App\Core\Authentication;

use App\Core\Audit\AuditLogger;
use App\Core\Authentication\Models\LoginHistory;
use App\Core\Authentication\Models\User;
use Illuminate\Support\Str;

/**
 * Single place that records authentication outcomes, used by both web and API sign-in.
 */
class LoginRecorder
{
    public function __construct(private readonly AuditLogger $audit) {}

    public function record(string $event, ?User $user, ?string $email = null): void
    {
        $request = request();

        LoginHistory::create([
            'user_id' => $user?->getKey(),
            'email' => $email ?? $user?->email,
            'event' => $event,
            'ip_address' => $request->ip(),
            'user_agent' => Str::limit((string) $request->userAgent(), 255, ''),
        ]);

        if ($event === 'login' && $user) {
            $user->forceFill(['last_login_at' => now(), 'last_login_ip' => $request->ip()])->saveQuietly();
        }

        $this->audit->log(
            event: 'auth.'.$event,
            description: match ($event) {
                'login' => 'signed in',
                'logout' => 'signed out',
                'lockout' => 'was locked out after repeated failed sign-ins',
                default => 'failed sign-in attempt',
            },
            subject: $user,
            properties: $event === 'login' || $event === 'logout' ? [] : ['email' => $email ?? $user?->email],
            actor: $event === 'failed' || $event === 'lockout' ? null : $user,
        );
    }
}
