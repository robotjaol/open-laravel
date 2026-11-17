<?php

namespace App\Modules\Projects\Enums;

use App\Shared\Support\HasLabel;

enum ProjectStatus: string implements HasLabel
{
    case Planned = 'planned';
    case Active = 'active';
    case OnHold = 'on_hold';
    case Completed = 'completed';

    public function label(): string
    {
        return match ($this) {
            self::Planned => 'Planned',
            self::Active => 'Active',
            self::OnHold => 'On hold',
            self::Completed => 'Completed',
        };
    }
}
