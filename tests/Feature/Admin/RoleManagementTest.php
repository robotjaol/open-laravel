<?php

namespace Tests\Feature\Admin;

use App\Core\Authentication\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleManagementTest extends TestCase
{
    public function test_viewer_cannot_see_roles(): void
    {
        $this->actingAs($this->userWithRole('Viewer'))->get('/roles')->assertForbidden();
    }

    public function test_admin_can_create_role_with_permissions(): void
    {
        $this->actingAs($this->userWithRole('Admin'))
            ->post('/roles', ['name' => 'Auditor', 'permissions' => ['audit.view']])
            ->assertRedirect('/roles');

        $this->assertTrue(Role::findByName('Auditor')->hasPermissionTo('audit.view'));
    }

    public function test_unknown_permission_is_rejected(): void
    {
        $this->actingAs($this->userWithRole('Admin'))
            ->post('/roles', ['name' => 'Bad', 'permissions' => ['made.up']])
            ->assertSessionHasErrors('permissions.0');
    }

    public function test_super_admin_role_is_locked(): void
    {
        $role = Role::findByName(User::SUPER_ADMIN_ROLE);
        $actor = $this->superAdmin();

        $this->actingAs($actor)->put('/roles/'.$role->id, ['name' => 'Renamed', 'permissions' => []])->assertForbidden();
        $this->actingAs($actor)->delete('/roles/'.$role->id)->assertForbidden();
        $this->assertSame(User::SUPER_ADMIN_ROLE, $role->fresh()->name);
    }

    public function test_role_with_users_cannot_be_deleted(): void
    {
        $this->userWithRole('Manager');
        $role = Role::findByName('Manager');

        $this->actingAs($this->userWithRole('Admin'))->delete('/roles/'.$role->id)->assertSessionHas('error');
        $this->assertModelExists($role);
    }

    public function test_permission_matrix_toggle_grants_and_revokes(): void
    {
        $role = Role::findByName('Viewer');
        $admin = $this->userWithRole('Admin');

        $this->actingAs($admin)->put('/permissions/toggle', ['role_id' => $role->id, 'permission' => 'audit.view', 'granted' => true]);
        $this->assertTrue($role->fresh()->hasPermissionTo('audit.view'));

        $this->actingAs($admin)->put('/permissions/toggle', ['role_id' => $role->id, 'permission' => 'audit.view', 'granted' => false]);
        $this->assertFalse($role->fresh()->hasPermissionTo('audit.view'));
    }

    public function test_matrix_cannot_modify_super_admin(): void
    {
        $role = Role::findByName(User::SUPER_ADMIN_ROLE);

        $this->actingAs($this->superAdmin())
            ->put('/permissions/toggle', ['role_id' => $role->id, 'permission' => 'audit.view', 'granted' => false])
            ->assertForbidden();
    }
}
