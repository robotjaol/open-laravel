<?php

namespace App\Modules\Projects\Http\Controllers;

use App\Modules\Projects\Http\Requests\ProjectRequest;
use App\Modules\Projects\Http\Resources\ProjectResource;
use App\Modules\Projects\Models\Project;
use App\Shared\Http\Controller;
use App\Shared\Support\TableQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProjectApiController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $this->authorize('viewAny', Project::class);

        $query = TableQuery::fromRequest($request, ['code', 'name', 'status', 'due_on', 'updated_at'], 'updated_at', 'desc', ['status']);

        $projects = Project::query()->with('owner:id,name');
        $query->applySearch($projects, ['code', 'name']);
        if ($status = $query->filter('status')) {
            $projects->where('status', $status);
        }

        return ProjectResource::collection(
            $projects->orderBy($query->sort, $query->direction)->orderByDesc('id')->paginate($query->perPage)->withQueryString(),
        );
    }

    public function show(Project $project): ProjectResource
    {
        $this->authorize('view', $project);

        return new ProjectResource($project->load('owner:id,name'));
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $this->authorize('create', Project::class);

        $project = Project::create($request->validated());

        return (new ProjectResource($project->load('owner:id,name')))->response()->setStatusCode(201);
    }

    public function update(ProjectRequest $request, Project $project): ProjectResource
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return new ProjectResource($project->load('owner:id,name'));
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return response()->json(status: 204);
    }
}
