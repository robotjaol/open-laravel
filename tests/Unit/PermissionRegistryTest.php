<?php

namespace Tests\Unit;

use App\Core\Authorization\PermissionRegistry;
use PHPUnit\Framework\TestCase;

class PermissionRegistryTest extends TestCase
{
    public function test_registrations_for_the_same_group_are_merged(): void
    {
        $r = new PermissionRegistry;
        $r->register('x', 'X', ['x.view' => 'View']);
        $r->register('x', 'X', ['x.edit' => 'Edit']);

        $this->assertSame(['x.view', 'x.edit'], $r->names());
        $this->assertCount(1, $r->groups());
        $this->assertCount(2, $r->groups()[0]['permissions']);
    }
}
