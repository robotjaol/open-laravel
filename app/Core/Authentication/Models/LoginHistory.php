<?php

namespace App\Core\Authentication\Models;

use Illuminate\Database\Eloquent\Model;

class LoginHistory extends Model
{
    public const UPDATED_AT = null;

    public const EVENTS = ['login', 'failed', 'logout', 'lockout'];

    protected $table = 'login_histories';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['created_at' => 'datetime'];
    }
}
