<?php

namespace App\Core\Authorization;

use App\Core\Authentication\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

/**
 * Makes the database match the code-defined permission catalogue and default roles.
 * Idempotent: safe to run on every deployment (`php artisan authorization:sync`).
 */
class AuthorizationSynchronizer
{
    /**
     * Default roles and the permission patterns they receive. "*" grants everything,
     * "x.*" grants every permission starting with "x.", a plain name grants that permission.
     *
     * @var array<string, list<string>>
     */
    public const DEFAULT_ROLES = [
        User::SUPER_ADMIN_ROLE => ['*'],
        'Admin' => ['*'],
        'Manager' => ['projects.*', 'users.view'],
        'Viewer' => ['projects.view'],
    ];

    public function __construct(private readonly PermissionRegistry $registry) {}

    public function sync(): void
    {
        DB::transaction(function (): void {
            $names = $this->registry->names();

            foreach ($names as $name) {
                Permission::findOrCreate($name, 'web');
            }

            foreach (self::DEFAULT_ROLES as $roleName => $patterns) {
                $role = Role::findOrCreate($roleName, 'web');

                // Only seed permissions for roles that are new; never overwrite an administrator's edits.
                if ($role->wasRecentlyCreated) {
                    $role->syncPermissions($this->expand($patterns, $names));
                }
            }
        });

        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    /**
     * @param  list<string>  $patterns
     * @param  list<string>  $names
     * @return list<string>
     */
    private function expand(array $patterns, array $names): array
    {
        $granted = [];
        foreach ($patterns as $pattern) {
            foreach ($names as $name) {
                $match = $pattern === '*'
                    || $pattern === $name
                    || (str_ends_with($pattern, '.*') && str_starts_with($name, substr($pattern, 0, -1)));
                if ($match) {
                    $granted[] = $name;
                }
            }
        }

        return array_values(array_unique($granted));
    }
}
