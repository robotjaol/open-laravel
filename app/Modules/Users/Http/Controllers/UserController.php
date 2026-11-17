<?php

namespace App\Modules\Users\Http\Controllers;

use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Models\User;
use App\Modules\Users\Http\Requests\UserRequest;
use App\Modules\Users\Services\UserService;
use App\Shared\Exceptions\BusinessRuleViolation;
use App\Shared\Http\Controller;
use App\Shared\Support\Options;
use App\Shared\Support\PaginatedData;
use App\Shared\Support\TableQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', User::class);

        $query = TableQuery::fromRequest($request, ['name', 'email', 'status', 'created_at', 'last_login_at'], 'name', 'asc', ['role', 'status']);

        $users = User::query()->with('roles:id,name');
        $query->applySearch($users, ['name', 'email']);

        if ($role = $query->filter('role')) {
            $users->whereHas('roles', fn ($q) => $q->where('name', $role));
        }
        if (($status = $query->filter('status')) && UserStatus::tryFrom($status)) {
            $users->where('status', $status);
        }

        $users->orderBy($query->sort, $query->direction)->orderBy('id');
        $actor = $request->user();

        return Inertia::render('users/index', [
            'users' => PaginatedData::make($users->paginate($query->perPage)->withQueryString(), fn (User $u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'status' => $u->status->value,
                'roles' => $u->roles->pluck('name')->values()->all(),
                'last_login_at' => $u->last_login_at?->toIso8601String(),
                'created_at' => $u->created_at->toIso8601String(),
                'can' => ['update' => $actor->can('update', $u), 'delete' => $actor->can('delete', $u)],
            ]),
            'query' => $query->toArray(),
            'filters' => ['roles' => $this->roleOptions(), 'statuses' => Options::fromEnum(UserStatus::class)],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', User::class);

        return Inertia::render('users/create', ['roles' => $this->roleOptions(), 'statuses' => Options::fromEnum(UserStatus::class)]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $this->authorize('create', User::class);

        try {
            $this->users->create($request->validated(), $request->user());
        } catch (BusinessRuleViolation $e) {
            return back()->withInput()->with('error', $e->getMessage());
        }

        return redirect()->route('users.index')->with('success', 'User created.');
    }

    public function edit(User $user): Response
    {
        $this->authorize('update', $user);

        return Inertia::render('users/edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'status' => $user->status->value,
                'roles' => $user->getRoleNames()->values()->all(),
            ],
            'roles' => $this->roleOptions(),
            'statuses' => Options::fromEnum(UserStatus::class),
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        try {
            $this->users->update($user, $request->validated(), $request->user());
        } catch (BusinessRuleViolation $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('users.index')->with('success', 'User updated.');
    }

    public function status(Request $request, User $user): RedirectResponse
    {
        $this->authorize('update', $user);

        $data = $request->validate(['status' => ['required', Rule::enum(UserStatus::class)]]);

        try {
            $this->users->setStatus($user, UserStatus::from($data['status']), $request->user());
        } catch (BusinessRuleViolation $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Status updated.');
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        $this->authorize('delete', $user);

        try {
            $this->users->delete($user, $request->user());
        } catch (BusinessRuleViolation $e) {
            return back()->with('error', $e->getMessage());
        }

        return redirect()->route('users.index')->with('success', 'User deleted.');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function roleOptions(): array
    {
        return Role::query()->orderBy('name')->pluck('name')
            ->map(fn (string $n): array => ['value' => $n, 'label' => $n])->all();
    }
}
