<?php

namespace App\Modules\Roles\Http\Controllers;

use App\Core\Audit\AuditLogger;
use App\Core\Authorization\PermissionRegistry;
use App\Core\Authorization\RoleRules;
use App\Shared\Http\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function __construct(
        private readonly PermissionRegistry $registry,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('permissions.view'), 403);

        return Inertia::render('permissions/index', [
            'groups' => $this->registry->groups(),
            'roles' => Role::query()->with('permissions:id,name')->orderBy('name')->get()
                ->map(fn (Role $r): array => [
                    'id' => $r->id,
                    'name' => $r->name,
                    'permissions' => $r->permissions->pluck('name')->values()->all(),
                    'is_locked' => RoleRules::isLocked($r),
                ])->all(),
            'canManage' => $request->user()->can('permissions.manage'),
        ]);
    }

    public function toggle(Request $request): RedirectResponse
    {
        abort_unless($request->user()->can('permissions.manage'), 403);

        $data = $request->validate([
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'permission' => ['required', 'string', Rule::in($this->registry->names())],
            'granted' => ['required', 'boolean'],
        ]);

        $role = Role::findOrFail($data['role_id']);
        abort_if(RoleRules::isLocked($role), 403, 'The Super Admin role cannot be modified.');

        $data['granted'] ? $role->givePermissionTo($data['permission']) : $role->revokePermissionTo($data['permission']);

        $this->audit->log('permissions.toggled', ($data['granted'] ? 'Granted ' : 'Revoked ').$data['permission']." for {$role->name}", $role, [
            'permission' => $data['permission'],
            'granted' => $data['granted'],
        ]);

        return back()->with('success', 'Permission updated.');
    }
}
