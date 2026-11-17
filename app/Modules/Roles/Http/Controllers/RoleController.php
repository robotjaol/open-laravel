<?php

namespace App\Modules\Roles\Http\Controllers;

use App\Core\Audit\AuditLogger;
use App\Core\Authorization\PermissionRegistry;
use App\Core\Authorization\RoleRules;
use App\Shared\Http\Controller;
use App\Shared\Support\PaginatedData;
use App\Shared\Support\TableQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct(
        private readonly PermissionRegistry $registry,
        private readonly AuditLogger $audit,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Role::class);

        $query = TableQuery::fromRequest($request, ['name', 'users_count', 'permissions_count'], 'name');

        $roles = Role::query()->withCount(['users', 'permissions']);
        $query->applySearch($roles, ['name']);
        $roles->orderBy($query->sort, $query->direction)->orderBy('id');
        $actor = $request->user();

        return Inertia::render('roles/index', [
            'roles' => PaginatedData::make($roles->paginate($query->perPage)->withQueryString(), fn (Role $r): array => [
                'id' => $r->id,
                'name' => $r->name,
                'users_count' => (int) $r->users_count,
                'permissions_count' => (int) $r->permissions_count,
                'is_locked' => RoleRules::isLocked($r),
                'can' => ['update' => $actor->can('update', $r), 'delete' => $actor->can('delete', $r)],
            ]),
            'query' => $query->toArray(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Role::class);

        return Inertia::render('roles/create', ['groups' => $this->registry->groups()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Role::class);

        $data = $this->validated($request);

        /** @var Role $role */
        $role = Role::create(['name' => $data['name'], 'guard_name' => 'web']);
        $role->syncPermissions($data['permissions'] ?? []);
        $this->audit->log('roles.created', "Role {$role->name} created", $role, ['permissions' => $data['permissions'] ?? []]);

        return redirect()->route('roles.index')->with('success', 'Role created.');
    }

    public function edit(Role $role): Response
    {
        $this->authorize('viewAny', Role::class);

        return Inertia::render('roles/edit', [
            'role' => [
                'id' => $role->id,
                'name' => $role->name,
                'permissions' => $role->permissions()->pluck('name')->values()->all(),
                'is_locked' => RoleRules::isLocked($role),
            ],
            'groups' => $this->registry->groups(),
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        $this->authorize('update', $role);

        $data = $this->validated($request, $role);
        $before = $role->permissions()->pluck('name')->sort()->values()->all();

        $role->update(['name' => $data['name']]);
        $role->syncPermissions($data['permissions'] ?? []);

        $after = collect($data['permissions'] ?? [])->sort()->values()->all();
        $this->audit->log('roles.updated', "Role {$role->name} updated", $role, [
            'added' => array_values(array_diff($after, $before)),
            'removed' => array_values(array_diff($before, $after)),
        ]);

        return redirect()->route('roles.index')->with('success', 'Role updated.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->authorize('delete', $role);

        if ($role->users()->exists()) {
            return back()->with('error', 'This role is assigned to users. Reassign them before deleting it.');
        }

        $name = $role->name;
        $role->delete();
        $this->audit->log('roles.deleted', "Role {$name} deleted");

        return redirect()->route('roles.index')->with('success', 'Role deleted.');
    }

    /**
     * @return array{name: string, permissions?: list<string>}
     */
    private function validated(Request $request, ?Role $role = null): array
    {
        /** @var array{name: string, permissions?: list<string>} */
        return $request->validate([
            'name' => ['required', 'string', 'max:64', Rule::unique('roles', 'name')->ignore($role?->id)],
            'permissions' => ['array'],
            'permissions.*' => ['string', Rule::in($this->registry->names())],
        ]);
    }
}
