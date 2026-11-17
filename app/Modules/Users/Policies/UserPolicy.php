<?php

namespace App\Modules\Users\Policies;

use App\Core\Authentication\Models\User;

class UserPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can('users.view');
    }

    public function create(User $actor): bool
    {
        return $actor->can('users.create');
    }

    public function update(User $actor, User $target): bool
    {
        return $actor->can('users.update') && $this->mayManage($actor, $target);
    }

    /** Deleting yourself is never allowed; Super Admin accounts can only be removed by a Super Admin. */
    public function delete(User $actor, User $target): bool
    {
        return $actor->can('users.delete')
            && $actor->isNot($target)
            && $this->mayManage($actor, $target);
    }

    private function mayManage(User $actor, User $target): bool
    {
        return ! $target->hasRole(User::SUPER_ADMIN_ROLE) || $actor->hasRole(User::SUPER_ADMIN_ROLE);
    }
}
