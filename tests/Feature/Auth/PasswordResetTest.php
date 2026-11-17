<?php

namespace Tests\Feature\Auth;

use App\Core\Authentication\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    public function test_response_is_identical_for_known_and_unknown_email(): void
    {
        Notification::fake();
        $user = User::factory()->create();

        $known = $this->from('/forgot-password')->post('/forgot-password', ['email' => $user->email]);
        $unknown = $this->from('/forgot-password')->post('/forgot-password', ['email' => 'ghost@example.com']);

        $known->assertSessionHas('status');
        $this->assertSame(session('status'), $known->getSession()->get('status'));
        $this->assertSame($known->getSession()->get('status'), $unknown->getSession()->get('status'));
        Notification::assertSentTo($user, ResetPassword::class);
        Notification::assertCount(1);
    }

    public function test_password_can_be_reset_with_valid_token(): void
    {
        $user = User::factory()->create();
        $token = Password::createToken($user);

        $this->post('/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'Brand-New-Pass-99!',
            'password_confirmation' => 'Brand-New-Pass-99!',
        ])->assertRedirect('/login');

        $this->post('/login', ['email' => $user->email, 'password' => 'Brand-New-Pass-99!'])->assertRedirect('/dashboard');
    }

    public function test_weak_password_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->post('/reset-password', [
            'token' => Password::createToken($user),
            'email' => $user->email,
            'password' => 'short',
            'password_confirmation' => 'short',
        ])->assertSessionHasErrors('password');
    }

    public function test_invalid_token_is_rejected(): void
    {
        $user = User::factory()->create();

        $this->post('/reset-password', [
            'token' => 'invalid',
            'email' => $user->email,
            'password' => 'Brand-New-Pass-99!',
            'password_confirmation' => 'Brand-New-Pass-99!',
        ])->assertSessionHasErrors('email');
    }
}
