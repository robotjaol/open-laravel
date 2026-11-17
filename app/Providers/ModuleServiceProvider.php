<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

/**
 * Discovers feature modules: every app/Modules/<Name>/<Name>ServiceProvider.php is registered
 * unless <Name> is listed in config('modules.disabled').
 */
class ModuleServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $disabled = (array) config('modules.disabled', []);

        foreach (glob(app_path('Modules/*'), GLOB_ONLYDIR) ?: [] as $directory) {
            $name = basename($directory);

            if (in_array($name, $disabled, true)) {
                continue;
            }

            $provider = "App\\Modules\\{$name}\\{$name}ServiceProvider";

            if (class_exists($provider)) {
                $this->app->register($provider);
            }
        }
    }
}
