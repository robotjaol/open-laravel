<?php

namespace App\Core\Authentication\Listeners;

use App\Core\Authentication\LoginRecorder;
use App\Core\Authentication\Models\User;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Events\Dispatcher;

/**
 * Translates framework authentication events into login history and audit entries.
 */
class RecordAuthEvents
{
    public function __construct(private readonly LoginRecorder $recorder) {}

    public function onLogin(Login $event): void
    {
        if ($event->user instanceof User) {
            $this->recorder->record('login', $event->user);
        }
    }

    public function onFailed(Failed $event): void
    {
        $user = $event->user instanceof User ? $event->user : null;
        $this->recorder->record('failed', $user, (string) ($event->credentials['email'] ?? ''));
    }

    public function onLogout(Logout $event): void
    {
        if ($event->user instanceof User) {
            $this->recorder->record('logout', $event->user);
        }
    }

    public function onLockout(Lockout $event): void
    {
        $this->recorder->record('lockout', null, (string) $event->request->input('email'));
    }

    /**
     * @return array<class-string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class => 'onLogin',
            Failed::class => 'onFailed',
            Logout::class => 'onLogout',
            Lockout::class => 'onLockout',
        ];
    }
}
