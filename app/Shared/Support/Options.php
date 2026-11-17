<?php

namespace App\Shared\Support;

final class Options
{
    /**
     * Convert a backed enum class into [{value,label}] options for select inputs.
     *
     * @param  class-string<\BackedEnum&HasLabel>  $enum
     * @return list<array{value: string, label: string}>
     */
    public static function fromEnum(string $enum): array
    {
        return array_map(
            fn (\BackedEnum&HasLabel $case): array => ['value' => (string) $case->value, 'label' => $case->label()],
            $enum::cases(),
        );
    }
}
