<?php

namespace App\Core\Authorization;

use App\Core\Authentication\Models\User;
use Spatie\Permission\Models\Role;

final class RoleRules
{
    /** The Super Admin role is immutable: it cannot be renamed, edited or deleted. */
    public static function isLocked(Role $role): bool
    {
        return $role->name === User::SUPER_ADMIN_ROLE;
    }
}
