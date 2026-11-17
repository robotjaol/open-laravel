<?php

namespace Tests\Feature\Admin;

use App\Core\Authentication\Models\User;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    private function payload(array $over = []): array
    {
        return array_merge([
            'name' => 'Created User',
            'email' => 'created@example.com',
            'password' => 'Sufficient-Pass-1!',
            'password_confirmation' => 'Sufficient-Pass-1!',
            'status' => 'active',
            'roles' => ['Viewer'],
        ], $over);
    }

    public function test_viewer_cannot_list_users(): void
    {
        $this->actingAs($this->userWithRole('Viewer'))->get('/users')->assertForbidden();
    }

    public function test_admin_can_list_search_and_filter_users(): void
    {
        $admin = $this->userWithRole('Admin');
        User::factory()->create(['name' => 'Zed Findable']);

        $this->actingAs($admin)->get('/users?search=findable')
            ->assertOk()
            ->assertInertia(fn ($p) => $p->component('users/index')->has('users.data', 1));
    }

    public function test_sorting_ignores_non_whitelisted_columns(): void
    {
        $this->actingAs($this->superAdmin())->get('/users?sort=password&direction=desc')->assertOk();
    }

    public function test_admin_can_create_user_with_role(): void
    {
        $this->actingAs($this->userWithRole('Admin'))->post('/users', $this->payload())->assertRedirect('/users');

        $created = User::query()->where('email', 'created@example.com')->firstOrFail();
        $this->assertTrue($created->hasRole('Viewer'));
        $this->assertDatabaseHas('audit_logs', ['event' => 'created', 'subject_type' => User::class]);
    }

    public function test_duplicate_email_is_rejected(): void
    {
        $admin = $this->userWithRole('Admin');
        User::factory()->create(['email' => 'created@example.com']);

        $this->actingAs($admin)->post('/users', $this->payload())->assertSessionHasErrors('email');
    }

    public function test_admin_cannot_grant_super_admin(): void
    {
        $admin = $this->userWithRole('Admin');

        $this->actingAs($admin)->post('/users', $this->payload(['roles' => [User::SUPER_ADMIN_ROLE]]))
            ->assertSessionHas('error');

        $this->assertDatabaseMissing('users', ['email' => 'created@example.com']);
    }

    public function test_admin_cannot_edit_a_super_admin(): void
    {
        $this->actingAs($this->userWithRole('Admin'))->get('/users/'.$this->superAdmin()->id.'/edit')->assertForbidden();
    }

    public function test_user_cannot_delete_self(): void
    {
        $admin = $this->userWithRole('Admin');

        $this->actingAs($admin)->delete('/users/'.$admin->id)->assertForbidden();
        $this->assertModelExists($admin);
    }

    public function test_last_active_super_admin_cannot_be_deactivated_or_deleted(): void
    {
        $root = $this->superAdmin();
        $other = $this->superAdmin();
        $this->actingAs($root);

        $this->patch('/users/'.$other->id.'/status', ['status' => 'inactive'])->assertSessionDoesntHaveErrors();
        $this->assertSame('inactive', $other->fresh()->status->value);

        $third = $this->superAdmin();
        $other->forceFill(['status' => 'inactive'])->save();
        $third->forceFill(['status' => 'inactive'])->save();
        $this->actingAs($this->userWithRole('Admin'));
        $this->assertModelExists($root);
    }

    public function test_cannot_deactivate_only_remaining_super_admin(): void
    {
        $root = $this->superAdmin();
        $actor = $this->superAdmin();
        $root->forceFill(['status' => 'inactive'])->save();

        $this->actingAs($actor)->patch('/users/'.$actor->id.'/status', ['status' => 'inactive'])
            ->assertSessionHas('error');
        $this->assertSame('active', $actor->fresh()->status->value);
    }

    public function test_admin_can_delete_regular_user(): void
    {
        $victim = User::factory()->create();

        $this->actingAs($this->userWithRole('Admin'))->delete('/users/'.$victim->id)->assertRedirect('/users');
        $this->assertModelMissing($victim);
    }

    public function test_role_change_is_audited(): void
    {
        $target = $this->userWithRole('Viewer');

        $this->actingAs($this->userWithRole('Admin'))->put('/users/'.$target->id, [
            'name' => $target->name,
            'email' => $target->email,
            'status' => 'active',
            'roles' => ['Manager'],
        ])->assertRedirect('/users');

        $this->assertTrue($target->fresh()->hasRole('Manager'));
        $this->assertDatabaseHas('audit_logs', ['event' => 'users.roles_changed']);
    }
}
