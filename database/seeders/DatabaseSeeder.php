<?php

namespace Database\Seeders;

use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Models\User;
use App\Core\Authorization\AuthorizationSynchronizer;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(AuthorizationSynchronizer $authorization): void
    {
        $authorization->sync();

        $this->seedSuperAdmin();

        if (! app()->isProduction()) {
            $this->call(DemoSeeder::class);
        }
    }

    /**
     * Creates the first Super Admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD. It is skipped when
     * either value is missing or any Super Admin already exists, so reseeding never resets a password.
     */
    private function seedSuperAdmin(): void
    {
        // Seed-time input only; the seeder never runs from cached config.
        // @phpstan-ignore larastan.noEnvCallsOutsideOfConfig
        $email = env('SEED_ADMIN_EMAIL');
        // @phpstan-ignore larastan.noEnvCallsOutsideOfConfig
        $password = env('SEED_ADMIN_PASSWORD');

        if (! $email || ! $password || User::role(User::SUPER_ADMIN_ROLE)->exists()) {
            return;
        }

        $user = User::create([
            'name' => 'Super Admin',
            'email' => strtolower($email),
            'password' => $password,
            'status' => UserStatus::Active,
        ]);
        $user->forceFill(['email_verified_at' => now()])->save();
        $user->assignRole(User::SUPER_ADMIN_ROLE);
    }
}
