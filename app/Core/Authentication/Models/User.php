<?php

namespace App\Core\Authentication\Models;

use App\Core\Audit\Auditable;
use App\Core\Authentication\Enums\UserStatus;
use Database\Factories\UserFactory;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

#[UseFactory(UserFactory::class)]
class User extends Authenticatable implements MustVerifyEmail
{
    use Auditable;
    use HasApiTokens;
    use HasFactory;
    use HasRoles;
    use Notifiable;

    public const SUPER_ADMIN_ROLE = 'Super Admin';

    protected $guard_name = 'web';

    /** Attributes that never appear in the audit trail. */
    protected array $auditExclude = ['last_login_at', 'last_login_ip'];

    protected $fillable = ['name', 'email', 'password', 'status'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
            'status' => UserStatus::class,
        ];
    }

    public function isActive(): bool
    {
        return $this->status === UserStatus::Active;
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRole(self::SUPER_ADMIN_ROLE);
    }

    /** @return HasMany<LoginHistory, $this> */
    public function loginHistories(): HasMany
    {
        return $this->hasMany(LoginHistory::class);
    }
}
