<?php

namespace App\Shared\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;

class MakeModule extends Command
{
    protected $signature = 'module:make {name : Module name in StudlyCase, e.g. Inventory}';

    protected $description = 'Scaffold a new feature module under app/Modules';

    public function handle(Filesystem $files): int
    {
        $name = Str::studly((string) $this->argument('name'));

        if (! preg_match('/^[A-Z][A-Za-z0-9]{1,40}$/', $name)) {
            $this->error('Module name must be alphanumeric and start with a letter.');

            return self::FAILURE;
        }

        $base = app_path("Modules/{$name}");

        if ($files->exists($base)) {
            $this->error("Module {$name} already exists.");

            return self::FAILURE;
        }

        $slug = Str::kebab($name);
        $files->ensureDirectoryExists("{$base}/Http/Controllers");
        $files->ensureDirectoryExists("{$base}/routes");
        $files->ensureDirectoryExists("{$base}/Database/Migrations");

        $files->put("{$base}/{$name}ServiceProvider.php", <<<PHP
        <?php

        namespace App\\Modules\\{$name};

        use App\\Core\\Authorization\\PermissionRegistry;
        use App\\Shared\\Support\\ModuleServiceProvider;

        class {$name}ServiceProvider extends ModuleServiceProvider
        {
            protected function modulePath(): string
            {
                return __DIR__;
            }

            public function boot(): void
            {
                app(PermissionRegistry::class)->register('{$slug}', '{$name}', [
                    '{$slug}.view' => 'View {$name}',
                ]);

                parent::boot();
            }
        }

        PHP);

        $files->put("{$base}/routes/web.php", <<<PHP
        <?php

        use App\\Modules\\{$name}\\Http\\Controllers\\{$name}Controller;
        use Illuminate\\Support\\Facades\\Route;

        Route::get('/{$slug}', [{$name}Controller::class, 'index'])
            ->middleware('can:{$slug}.view')
            ->name('{$slug}.index');

        PHP);

        $files->put("{$base}/Http/Controllers/{$name}Controller.php", <<<PHP
        <?php

        namespace App\\Modules\\{$name}\\Http\\Controllers;

        use App\\Shared\\Http\\Controller;
        use Inertia\\Inertia;
        use Inertia\\Response;

        class {$name}Controller extends Controller
        {
            public function index(): Response
            {
                return Inertia::render('{$slug}/index');
            }
        }

        PHP);

        $this->info("Module {$name} created in app/Modules/{$name}.");
        $this->line("Next: add resources/js/pages/{$slug}/index.tsx, then run `php artisan authorization:sync`.");

        return self::SUCCESS;
    }
}
