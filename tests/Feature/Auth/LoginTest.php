<?php

namespace Tests\Feature\Auth;

use App\Core\Authentication\Models\LoginHistory;
use App\Core\Authentication\Models\User;
use Tests\TestCase;

class LoginTest extends TestCase
{
    public function test_login_page_renders_for_guests(): void
    {
        $this->get('/login')->assertOk()->assertInertia(fn ($p) => $p->component('auth/login'));
    }

    public function test_user_can_sign_in_and_is_recorded(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'Password-12345!'])
            ->assertRedirect('/dashboard');

        $this->assertAuthenticatedAs($user);
        $this->assertDatabaseHas('login_histories', ['user_id' => $user->id, 'event' => 'login']);
    }

    public function test_wrong_password_fails_with_generic_message(): void
    {
        $user = User::factory()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertSessionHasErrors(['email' => trans('auth.failed')]);

        $this->assertGuest();
        $this->assertDatabaseHas('login_histories', ['event' => 'failed']);
    }

    public function test_unknown_email_gets_same_message_as_wrong_password(): void
    {
        $this->post('/login', ['email' => 'nobody@example.com', 'password' => 'whatever'])
            ->assertSessionHasErrors(['email' => trans('auth.failed')]);
    }

    public function test_inactive_account_cannot_sign_in(): void
    {
        $user = User::factory()->inactive()->create();

        $this->post('/login', ['email' => $user->email, 'password' => 'Password-12345!'])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_login_is_rate_limited_after_five_failures(): void
    {
        $user = User::factory()->create();

        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', ['email' => $user->email, 'password' => 'bad']);
        }

        $response = $this->post('/login', ['email' => $user->email, 'password' => 'Password-12345!']);
        $response->assertSessionHasErrors('email');
        $this->assertGuest();
        $this->assertSame(1, LoginHistory::query()->where('event', 'lockout')->count());
    }

    public function test_logout_ends_the_session(): void
    {
        $this->actingAs(User::factory()->create())->post('/logout')->assertRedirect('/login');

        $this->assertGuest();
    }

    public function test_guests_are_redirected_from_protected_pages(): void
    {
        $this->get('/dashboard')->assertRedirect('/login');
        $this->get('/users')->assertRedirect('/login');
    }
}
