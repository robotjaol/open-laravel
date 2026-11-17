<?php

namespace App\Modules\Users\Services;

use App\Core\Audit\AuditLogger;
use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Models\User;
use App\Shared\Exceptions\BusinessRuleViolation;
use Illuminate\Support\Facades\DB;

/**
 * Business rules for managing users. Controllers stay thin and call this class.
 */
class UserService
{
    public function __construct(private readonly AuditLogger $audit) {}

    /**
     * @param  array{name: string, email: string, password: string, status: string, roles?: list<string>}  $data
     */
    public function create(array $data, User $actor): User
    {
        $roles = $data['roles'] ?? [];
        $this->guardSuperAdminAssignment($roles, $actor);

        return DB::transaction(function () use ($data, $roles): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $data['password'],
                'status' => $data['status'],
            ]);
            $user->forceFill(['email_verified_at' => now()])->save();
            $user->syncRoles($roles);

            return $user;
        });
    }

    /**
     * @param  array{name: string, email: string, password?: string|null, status: string, roles?: list<string>}  $data
     */
    public function update(User $user, array $data, User $actor): User
    {
        $roles = $data['roles'] ?? [];
        $this->guardSuperAdminAssignment($roles, $actor);

        return DB::transaction(function () use ($user, $data, $roles, $actor): User {
            $newStatus = UserStatus::from($data['status']);
            $keepsSuperAdmin = in_array(User::SUPER_ADMIN_ROLE, $roles, true);

            if ($user->is($actor) && $newStatus !== UserStatus::Active) {
                throw new BusinessRuleViolation('You cannot deactivate your own account.');
            }

            if (! $keepsSuperAdmin || $newStatus !== UserStatus::Active) {
                $this->guardLastSuperAdmin($user);
            }

            $user->fill(['name' => $data['name'], 'email' => $data['email'], 'status' => $newStatus]);
            if (! empty($data['password'])) {
                $user->password = $data['password'];
            }
            $user->save();

            $before = $user->getRoleNames()->sort()->values()->all();
            $user->syncRoles($roles);
            $after = $user->getRoleNames()->sort()->values()->all();

            if ($before !== $after) {
                $this->audit->log('users.roles_changed', "Roles changed for {$user->email}", $user, ['from' => $before, 'to' => $after]);
            }

            return $user;
        });
    }

    public function setStatus(User $user, UserStatus $status, User $actor): User
    {
        if ($user->is($actor) && $status !== UserStatus::Active) {
            throw new BusinessRuleViolation('You cannot deactivate your own account.');
        }

        if ($status !== UserStatus::Active) {
            $this->guardLastSuperAdmin($user);
        }

        $user->forceFill(['status' => $status])->save();

        return $user;
    }

    public function delete(User $user, User $actor): void
    {
        if ($user->is($actor)) {
            throw new BusinessRuleViolation('You cannot delete your own account.');
        }

        $this->guardLastSuperAdmin($user);

        $user->tokens()->delete();
        $user->delete();
    }

    /**
     * @param  list<string>  $roles
     */
    private function guardSuperAdminAssignment(array $roles, User $actor): void
    {
        if (in_array(User::SUPER_ADMIN_ROLE, $roles, true) && ! $actor->hasRole(User::SUPER_ADMIN_ROLE)) {
            throw new BusinessRuleViolation('Only a Super Admin can grant the Super Admin role.');
        }
    }

    /** The system must always keep at least one active Super Admin. */
    private function guardLastSuperAdmin(User $user): void
    {
        if (! $user->hasRole(User::SUPER_ADMIN_ROLE) || ! $user->isActive()) {
            return;
        }

        $others = User::role(User::SUPER_ADMIN_ROLE)
            ->where('status', UserStatus::Active->value)
            ->whereKeyNot($user->getKey())
            ->count();

        if ($others === 0) {
            throw new BusinessRuleViolation('At least one active Super Admin must remain.');
        }
    }
}
