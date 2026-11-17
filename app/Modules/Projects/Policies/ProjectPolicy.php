<?php

namespace App\Modules\Projects\Policies;

use App\Core\Authentication\Models\User;
use App\Modules\Projects\Models\Project;

class ProjectPolicy
{
    public function viewAny(User $actor): bool
    {
        return $actor->can('projects.view');
    }

    public function view(User $actor, Project $project): bool
    {
        return $actor->can('projects.view');
    }

    public function create(User $actor): bool
    {
        return $actor->can('projects.create');
    }

    public function update(User $actor, Project $project): bool
    {
        return $actor->can('projects.update');
    }

    public function delete(User $actor, Project $project): bool
    {
        return $actor->can('projects.delete');
    }
}
