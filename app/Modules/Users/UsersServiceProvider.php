<?php

namespace App\Modules\Users;

use App\Core\Authentication\Models\User;
use App\Core\Authorization\PermissionRegistry;
use App\Modules\Users\Policies\UserPolicy;
use App\Shared\Support\ModuleServiceProvider;

class UsersServiceProvider extends ModuleServiceProvider
{
    protected function modulePath(): string
    {
        return __DIR__;
    }

    protected function policies(): array
    {
        return [User::class => UserPolicy::class];
    }

    public function boot(): void
    {
        $this->app->make(PermissionRegistry::class)->register('users', 'Users', [
            'users.view' => 'View users',
            'users.create' => 'Create users',
            'users.update' => 'Edit users',
            'users.delete' => 'Delete users',
        ]);

        parent::boot();
    }
}
