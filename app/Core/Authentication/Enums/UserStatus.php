<?php

namespace App\Core\Authentication\Enums;

use App\Shared\Support\HasLabel;

enum UserStatus: string implements HasLabel
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Suspended = 'suspended';

    public function label(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Inactive => 'Inactive',
            self::Suspended => 'Suspended',
        };
    }
}
