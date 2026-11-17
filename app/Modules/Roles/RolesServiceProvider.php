<?php

namespace App\Modules\Roles;

use App\Core\Authorization\PermissionRegistry;
use App\Modules\Roles\Policies\RolePolicy;
use App\Shared\Support\ModuleServiceProvider;
use Spatie\Permission\Models\Role;

class RolesServiceProvider extends ModuleServiceProvider
{
    protected function modulePath(): string
    {
        return __DIR__;
    }

    protected function policies(): array
    {
        return [Role::class => RolePolicy::class];
    }

    public function boot(): void
    {
        $this->app->make(PermissionRegistry::class)->register('roles', 'Roles and permissions', [
            'roles.view' => 'View roles',
            'roles.create' => 'Create roles',
            'roles.update' => 'Edit roles',
            'roles.delete' => 'Delete roles',
            'permissions.view' => 'View permission matrix',
            'permissions.manage' => 'Change role permissions',
        ]);

        parent::boot();
    }
}
