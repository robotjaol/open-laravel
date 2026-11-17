<?php

namespace Database\Seeders;

use App\Core\Authentication\Models\User;
use App\Modules\Projects\Models\Project;
use Illuminate\Database\Seeder;

/** Sample data for local development and screenshots. Never runs in production. */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        if (User::query()->where('email', 'like', '%@demo.test')->exists()) {
            return;
        }

        $owners = collect(['Admin' => 'admin', 'Manager' => 'manager', 'Viewer' => 'viewer'])
            ->map(function (string $local, string $role): User {
                $user = User::factory()->create(['name' => "Demo {$role}", 'email' => "{$local}@demo.test"]);
                $user->assignRole($role);

                return $user;
            });

        Project::factory()->count(12)->create(['owner_id' => $owners['Manager']->id]);
    }
}
