<?php

namespace App\Modules\Roles\Policies;

use App\Core\Authentication\Models\User;
use App\Core\Authorization\RoleRules;
use Spatie\Permission\Models\Role;

class RolePolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can('roles.view');
    }

    public function create(User $actor): bool
    {
        return $actor->can('roles.create');
    }

    public function update(User $actor, Role $role): bool
    {
        return $actor->can('roles.update') && ! RoleRules::isLocked($role);
    }

    public function delete(User $actor, Role $role): bool
    {
        return $actor->can('roles.delete') && ! RoleRules::isLocked($role);
    }
}
