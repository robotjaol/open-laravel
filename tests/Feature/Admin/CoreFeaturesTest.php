<?php

namespace Tests\Feature\Admin;

use App\Core\Audit\AuditLogger;
use App\Core\Audit\Models\AuditLog;
use App\Core\Authentication\Models\User;
use App\Core\Notifications\SystemNotification;
use App\Core\Settings\SettingsService;
use Tests\TestCase;

class CoreFeaturesTest extends TestCase
{
    public function test_dashboard_renders_for_each_default_role(): void
    {
        foreach (['Super Admin', 'Admin', 'Manager', 'Viewer'] as $role) {
            $this->actingAs($this->userWithRole($role))->get('/dashboard')->assertOk()
                ->assertInertia(fn ($p) => $p->component('dashboard'));
        }
    }

    public function test_viewer_dashboard_has_no_kpis(): void
    {
        $this->actingAs($this->userWithRole('Viewer'))->get('/dashboard')
            ->assertInertia(fn ($p) => $p->where('kpis', null));
    }

    public function test_activity_log_requires_permission(): void
    {
        $this->actingAs($this->userWithRole('Viewer'))->get('/activity')->assertForbidden();
        $this->actingAs($this->userWithRole('Admin'))->get('/activity')->assertOk();
    }

    public function test_audit_logger_redacts_secrets(): void
    {
        app(AuditLogger::class)->log('test.event', 'Redaction check', null, ['password' => 'hunter2', 'nested' => ['token' => 'abc'], 'ok' => 'visible']);

        $log = AuditLog::query()->where('event', 'test.event')->firstOrFail();
        $this->assertStringNotContainsString('hunter2', json_encode($log->properties));
        $this->assertStringNotContainsString('abc', json_encode($log->properties));
        $this->assertSame('visible', $log->properties['ok']);
    }

    public function test_audit_log_entries_are_immutable(): void
    {
        app(AuditLogger::class)->log('test.immutable', 'x');
        $log = AuditLog::query()->firstOrFail();

        $this->expectException(\LogicException::class);
        $log->update(['description' => 'tampered']);
    }

    public function test_settings_update_requires_permission_and_validates(): void
    {
        $payload = ['app_name' => 'Acme', 'timezone' => 'UTC', 'locale' => 'en', 'registration_enabled' => false, 'audit_retention_days' => 90];

        $this->actingAs($this->userWithRole('Manager'))->put('/settings/application', $payload)->assertForbidden();

        $admin = $this->userWithRole('Admin');
        $this->actingAs($admin)->put('/settings/application', $payload)->assertSessionHasNoErrors();
        $this->assertSame('Acme', app(SettingsService::class)->get('app_name'));

        $this->actingAs($admin)->put('/settings/application', [...$payload, 'audit_retention_days' => 5])
            ->assertSessionHasErrors('audit_retention_days');
        $this->actingAs($admin)->put('/settings/application', [...$payload, 'timezone' => 'Mars/Base'])
            ->assertSessionHasErrors('timezone');
    }

    public function test_notifications_can_be_read_and_deleted_only_by_owner(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $owner->notify(new SystemNotification('Hello', 'Body'));
        $id = $owner->notifications()->firstOrFail()->id;

        $this->actingAs($other)->post("/notifications/{$id}/read")->assertNotFound();

        $this->actingAs($owner)->get('/notifications')->assertOk()
            ->assertInertia(fn ($p) => $p->where('unread', 1));
        $this->actingAs($owner)->post("/notifications/{$id}/read");
        $this->assertSame(0, $owner->unreadNotifications()->count());
        $this->actingAs($owner)->delete("/notifications/{$id}");
        $this->assertSame(0, $owner->notifications()->count());
    }

    public function test_profile_update_and_password_change(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->patch('/settings/profile', ['name' => 'Renamed', 'email' => 'renamed@example.com'])
            ->assertSessionHasNoErrors();
        $this->assertSame('Renamed', $user->fresh()->name);

        $this->actingAs($user)->put('/settings/password', [
            'current_password' => 'wrong', 'password' => 'Another-Pass-77!', 'password_confirmation' => 'Another-Pass-77!',
        ])->assertSessionHasErrors('current_password');

        $this->actingAs($user)->put('/settings/password', [
            'current_password' => 'Password-12345!', 'password' => 'Another-Pass-77!', 'password_confirmation' => 'Another-Pass-77!',
        ])->assertSessionHasNoErrors();
    }

    public function test_all_required_pages_render(): void
    {
        $admin = $this->superAdmin();
        foreach (['/dashboard', '/users', '/users/create', '/roles', '/roles/create', '/permissions', '/settings/profile',
            '/settings/password', '/settings/sessions', '/settings/application', '/activity', '/notifications',
            '/api-overview', '/projects', '/projects/create'] as $url) {
            $this->actingAs($admin)->get($url)->assertOk();
        }
    }

    public function test_missing_page_renders_error_component(): void
    {
        $this->get('/does-not-exist')->assertNotFound()->assertInertia(fn ($p) => $p->component('errors/public'));
        $this->actingAs($this->userWithRole('Viewer'))->get('/does-not-exist')->assertNotFound()
            ->assertInertia(fn ($p) => $p->component('errors/error'));
    }

    public function test_inactive_user_session_is_terminated(): void
    {
        $user = User::factory()->inactive()->create();

        $this->actingAs($user)->get('/dashboard')->assertRedirect('/login');
        $this->assertGuest();
    }

    public function test_security_headers_are_present(): void
    {
        $this->get('/login')
            ->assertHeader('X-Content-Type-Options', 'nosniff')
            ->assertHeader('X-Frame-Options');
    }
}
