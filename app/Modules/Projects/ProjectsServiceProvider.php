<?php

namespace App\Modules\Projects;

use App\Core\Authorization\PermissionRegistry;
use App\Modules\Projects\Models\Project;
use App\Modules\Projects\Policies\ProjectPolicy;
use App\Shared\Support\ModuleServiceProvider;

/**
 * Example module. Copy this folder (or run `php artisan module:make`) to start a new feature.
 */
class ProjectsServiceProvider extends ModuleServiceProvider
{
    protected function modulePath(): string
    {
        return __DIR__;
    }

    protected function policies(): array
    {
        return [Project::class => ProjectPolicy::class];
    }

    public function boot(): void
    {
        $this->app->make(PermissionRegistry::class)->register('projects', 'Projects', [
            'projects.view' => 'View projects',
            'projects.create' => 'Create projects',
            'projects.update' => 'Edit projects',
            'projects.delete' => 'Delete projects',
        ]);

        parent::boot();
    }
}
