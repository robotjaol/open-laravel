<?php

namespace Tests\Integration;

use App\Core\Authentication\Models\User;
use App\Core\Authorization\AuthorizationSynchronizer;
use Database\Seeders\DatabaseSeeder;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthorizationSyncTest extends TestCase
{
    public function test_sync_is_idempotent_and_preserves_admin_edits(): void
    {
        $viewer = Role::findByName('Viewer');
        $viewer->givePermissionTo('audit.view');
        $count = Role::count();

        app(AuthorizationSynchronizer::class)->sync();

        $this->assertSame($count, Role::count());
        $this->assertTrue($viewer->fresh()->hasPermissionTo('audit.view'));
    }

    public function test_manager_gets_project_wildcard_expansion(): void
    {
        $manager = Role::findByName('Manager');

        $this->assertTrue($manager->hasPermissionTo('projects.delete'));
        $this->assertFalse($manager->hasPermissionTo('roles.delete'));
    }

    public function test_seeder_creates_super_admin_only_once(): void
    {
        putenv('SEED_ADMIN_EMAIL=root@example.com');
        putenv('SEED_ADMIN_PASSWORD=Seed-Pass-123456!');
        $_ENV['SEED_ADMIN_EMAIL'] = 'root@example.com';
        $_ENV['SEED_ADMIN_PASSWORD'] = 'Seed-Pass-123456!';

        try {
            $this->seed(DatabaseSeeder::class);
            $this->seed(DatabaseSeeder::class);
        } finally {
            putenv('SEED_ADMIN_EMAIL');
            putenv('SEED_ADMIN_PASSWORD');
            unset($_ENV['SEED_ADMIN_EMAIL'], $_ENV['SEED_ADMIN_PASSWORD']);
        }

        $this->assertSame(1, User::query()->where('email', 'root@example.com')->count());
    }
}
