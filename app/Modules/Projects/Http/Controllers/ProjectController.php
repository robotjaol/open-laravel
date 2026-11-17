<?php

namespace App\Modules\Projects\Http\Controllers;

use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Models\User;
use App\Modules\Projects\Enums\ProjectStatus;
use App\Modules\Projects\Http\Requests\ProjectRequest;
use App\Modules\Projects\Models\Project;
use App\Shared\Http\Controller;
use App\Shared\Support\Options;
use App\Shared\Support\PaginatedData;
use App\Shared\Support\TableQuery;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Project::class);

        $query = TableQuery::fromRequest($request, ['code', 'name', 'status', 'due_on', 'updated_at'], 'updated_at', 'desc', ['status']);

        $projects = Project::query()->with('owner:id,name');
        $query->applySearch($projects, ['code', 'name']);
        if (($status = $query->filter('status')) && ProjectStatus::tryFrom($status)) {
            $projects->where('status', $status);
        }
        $projects->orderBy($query->sort, $query->direction)->orderByDesc('id');
        $actor = $request->user();

        return Inertia::render('projects/index', [
            'projects' => PaginatedData::make($projects->paginate($query->perPage)->withQueryString(), fn (Project $p): array => [
                'id' => $p->id,
                'code' => $p->code,
                'name' => $p->name,
                'status' => $p->status->value,
                'owner' => $p->owner ? ['id' => $p->owner->id, 'name' => $p->owner->name] : null,
                'starts_on' => $p->starts_on?->toDateString(),
                'due_on' => $p->due_on?->toDateString(),
                'updated_at' => $p->updated_at->toIso8601String(),
                'can' => ['update' => $actor->can('update', $p), 'delete' => $actor->can('delete', $p)],
            ]),
            'query' => $query->toArray(),
            'filters' => ['statuses' => Options::fromEnum(ProjectStatus::class)],
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Project::class);

        return Inertia::render('projects/create', ['statuses' => Options::fromEnum(ProjectStatus::class), 'owners' => $this->owners()]);
    }

    public function store(ProjectRequest $request): RedirectResponse
    {
        $this->authorize('create', Project::class);

        Project::create($request->validated());

        return redirect()->route('projects.index')->with('success', 'Project created.');
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        return Inertia::render('projects/edit', [
            'project' => [
                'id' => $project->id,
                'code' => $project->code,
                'name' => $project->name,
                'description' => $project->description,
                'status' => $project->status->value,
                'owner_id' => $project->owner_id,
                'starts_on' => $project->starts_on?->toDateString(),
                'due_on' => $project->due_on?->toDateString(),
            ],
            'statuses' => Options::fromEnum(ProjectStatus::class),
            'owners' => $this->owners(),
        ]);
    }

    public function update(ProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->route('projects.index')->with('success', 'Project updated.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Project deleted.');
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function owners(): array
    {
        return User::query()->where('status', UserStatus::Active->value)->orderBy('name')->get(['id', 'name'])
            ->map(fn (User $u): array => ['value' => (string) $u->id, 'label' => $u->name])->all();
    }
}
