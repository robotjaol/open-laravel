<?php

namespace App\Core\Authorization;

/**
 * Catalogue of every permission the application defines, grouped for display.
 * Core and each module register their own permissions in their service provider.
 */
class PermissionRegistry
{
    /** @var array<string, array{label: string, permissions: array<string, string>}> */
    private array $groups = [];

    /**
     * @param  array<string, string>  $permissions  Permission name => human label
     */
    public function register(string $group, string $label, array $permissions): void
    {
        $this->groups[$group] = [
            'label' => $label,
            'permissions' => array_merge($this->groups[$group]['permissions'] ?? [], $permissions),
        ];
    }

    /**
     * @return list<array{key: string, label: string, permissions: list<array{name: string, label: string}>}>
     */
    public function groups(): array
    {
        $out = [];
        foreach ($this->groups as $key => $group) {
            $out[] = [
                'key' => $key,
                'label' => $group['label'],
                'permissions' => array_map(
                    fn (string $name, string $label): array => ['name' => $name, 'label' => $label],
                    array_keys($group['permissions']),
                    array_values($group['permissions']),
                ),
            ];
        }

        return $out;
    }

    /**
     * @return list<string>
     */
    public function names(): array
    {
        $names = [];
        foreach ($this->groups as $group) {
            array_push($names, ...array_keys($group['permissions']));
        }

        return $names;
    }
}
