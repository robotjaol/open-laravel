<?php

namespace Database\Factories;

use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    private static ?string $password = null;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => self::$password ??= Hash::make('Password-12345!'),
            'status' => UserStatus::Active,
            'remember_token' => null,
        ];
    }

    public function inactive(): static
    {
        return $this->state(['status' => UserStatus::Inactive]);
    }

    public function unverified(): static
    {
        return $this->state(['email_verified_at' => null]);
    }
}
