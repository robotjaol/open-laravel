<?php

namespace Tests\Feature\Auth;

use App\Core\Authentication\Models\User;
use App\Core\Settings\SettingsService;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    private array $payload = [
        'name' => 'New Person',
        'email' => 'New@Example.com',
        'password' => 'Sufficient-Pass-1!',
        'password_confirmation' => 'Sufficient-Pass-1!',
    ];

    public function test_registration_is_closed_by_default(): void
    {
        $this->get('/register')->assertNotFound();
        $this->post('/register', $this->payload)->assertNotFound();
        $this->assertDatabaseCount('users', 0);
    }

    public function test_registration_creates_least_privilege_user_when_enabled(): void
    {
        app(SettingsService::class)->set(['registration_enabled' => true]);

        $this->post('/register', $this->payload)->assertRedirect('/dashboard');

        $user = User::query()->where('email', 'new@example.com')->firstOrFail();
        $this->assertSame(['Viewer'], $user->getRoleNames()->all());
        $this->assertAuthenticatedAs($user);
    }
}
