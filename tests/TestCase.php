<?php

namespace Tests;

use App\Core\Authentication\Models\User;
use App\Core\Authorization\AuthorizationSynchronizer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        app(AuthorizationSynchronizer::class)->sync();
    }

    protected function userWithRole(string $role): User
    {
        $user = User::factory()->create();
        $user->assignRole($role);

        return $user;
    }

    protected function superAdmin(): User
    {
        return $this->userWithRole(User::SUPER_ADMIN_ROLE);
    }
}
