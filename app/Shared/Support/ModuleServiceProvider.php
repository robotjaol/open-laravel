<?php

namespace App\Shared\Support;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

/**
 * Base class for feature modules living in app/Modules/<Name>.
 *
 * A module may contain:
 *   routes/web.php      loaded with the web + auth middleware stack
 *   routes/api.php      loaded under /api/v1 with Sanctum auth
 *   Database/Migrations loaded automatically
 *
 * Subclass it as App\Modules\<Name>\<Name>ServiceProvider and it is discovered automatically.
 */
abstract class ModuleServiceProvider extends ServiceProvider
{
    /** Absolute path of the module directory (return __DIR__). */
    abstract protected function modulePath(): string;

    /**
     * @return array<class-string, class-string> Model => Policy
     */
    protected function policies(): array
    {
        return [];
    }

    public function boot(): void
    {
        $path = $this->modulePath();

        foreach ($this->policies() as $model => $policy) {
            Gate::policy($model, $policy);
        }

        if (is_dir($path.'/Database/Migrations')) {
            $this->loadMigrationsFrom($path.'/Database/Migrations');
        }

        // When routes are cached the cached collection already contains this module's routes.
        if ($this->app->routesAreCached()) {
            return;
        }

        if (is_file($path.'/routes/web.php')) {
            $middleware = ['web', 'auth', 'active'];
            if (config('security.require_email_verification')) {
                $middleware[] = 'verified';
            }
            Route::middleware($middleware)->group($path.'/routes/web.php');
        }

        if (is_file($path.'/routes/api.php')) {
            Route::middleware(['api', 'auth:sanctum', 'active'])
                ->prefix('api/v1')
                ->name('api.v1.')
                ->group($path.'/routes/api.php');
        }
    }
}
