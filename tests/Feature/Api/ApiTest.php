<?php

namespace Tests\Feature\Api;

use App\Core\Authentication\Models\User;
use App\Modules\Projects\Models\Project;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiTest extends TestCase
{
    public function test_token_issue_and_me_endpoint(): void
    {
        $user = User::factory()->create();
        $user->assignRole('Viewer');

        $token = $this->postJson('/api/v1/auth/token', ['email' => $user->email, 'password' => 'Password-12345!'])
            ->assertCreated()->json('data.token');

        $this->withToken($token)->getJson('/api/v1/me')->assertOk()->assertJsonPath('data.email', $user->email);
    }

    public function test_bad_credentials_return_422_envelope(): void
    {
        $this->postJson('/api/v1/auth/token', ['email' => 'x@example.com', 'password' => 'nope'])
            ->assertStatus(422)->assertJsonPath('code', 'validation_failed');
    }

    public function test_unauthenticated_request_returns_401_json(): void
    {
        $this->getJson('/api/v1/projects')->assertUnauthorized()->assertJsonPath('code', 'unauthenticated');
    }

    public function test_inactive_account_token_is_rejected(): void
    {
        Sanctum::actingAs(User::factory()->inactive()->create());

        $this->getJson('/api/v1/me')->assertForbidden()->assertJsonPath('code', 'account_inactive');
    }

    public function test_project_crud_with_permissions(): void
    {
        Sanctum::actingAs($this->userWithRole('Manager'));

        $id = $this->postJson('/api/v1/projects', ['code' => 'api-1', 'name' => 'API project', 'status' => 'planned'])
            ->assertCreated()->assertJsonPath('data.code', 'API-1')->json('data.id');

        $this->getJson("/api/v1/projects/{$id}")->assertOk();
        $this->putJson("/api/v1/projects/{$id}", ['code' => 'API-1', 'name' => 'Renamed', 'status' => 'active'])
            ->assertOk()->assertJsonPath('data.name', 'Renamed');
        $this->deleteJson("/api/v1/projects/{$id}")->assertNoContent();
    }

    public function test_viewer_can_read_but_not_write_projects(): void
    {
        Project::factory()->create();
        Sanctum::actingAs($this->userWithRole('Viewer'));

        $this->getJson('/api/v1/projects')->assertOk()->assertJsonStructure(['data', 'meta', 'links']);
        $this->postJson('/api/v1/projects', ['code' => 'X', 'name' => 'N', 'status' => 'planned'])
            ->assertForbidden()->assertJsonPath('code', 'forbidden');
    }

    public function test_validation_errors_use_envelope(): void
    {
        Sanctum::actingAs($this->userWithRole('Manager'));

        $this->postJson('/api/v1/projects', ['code' => '!!', 'status' => 'bogus'])
            ->assertStatus(422)->assertJsonStructure(['message', 'code', 'errors' => ['code', 'name', 'status']]);
    }

    public function test_missing_resource_returns_404_envelope(): void
    {
        Sanctum::actingAs($this->userWithRole('Manager'));

        $this->getJson('/api/v1/projects/999999')->assertNotFound()->assertJsonPath('code', 'not_found');
    }
}
