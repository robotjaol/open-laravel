<?php

namespace App\Providers;

use App\Core\Audit\AuditLogger;
use App\Core\Audit\Console\PruneAuditLogs;
use App\Core\Authentication\Listeners\RecordAuthEvents;
use App\Core\Authentication\Models\User;
use App\Core\Authorization\Console\SyncAuthorization;
use App\Core\Authorization\PermissionRegistry;
use App\Core\Settings\SettingsService;
use App\Shared\Console\MakeModule;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(PermissionRegistry::class);
        $this->app->singleton(SettingsService::class);
        $this->app->singleton(AuditLogger::class);
    }

    public function boot(): void
    {
        $this->configureDefaults();
        $this->registerCorePermissions();
        $this->configureAuthorization();
        $this->configureRateLimiting();

        Event::subscribe(RecordAuthEvents::class);

        if ($this->app->runningInConsole()) {
            $this->commands([PruneAuditLogs::class, SyncAuthorization::class, MakeModule::class]);
        }

        if (! $this->app->runningInConsole() || $this->app->runningUnitTests()) {
            app(SettingsService::class)->applyToConfig();
        }
    }

    private function configureDefaults(): void
    {
        Date::use(Carbon::class);

        // Fail loudly in development and tests: lazy loading (N+1), silently discarded attributes
        // and reads of missing attributes become exceptions. Production keeps running.
        Model::shouldBeStrict(! $this->app->isProduction());

        DB::prohibitDestructiveCommands($this->app->isProduction());

        Password::defaults(function (): Password {
            $rule = Password::min((int) config('security.password.min_length', 12))
                ->letters()->mixedCase()->numbers()->symbols();

            return config('security.password.check_breached') ? $rule->uncompromised() : $rule;
        });

        if ($this->app->isProduction() && str_starts_with((string) config('app.url'), 'https://')) {
            URL::forceScheme('https');
        }
    }

    private function registerCorePermissions(): void
    {
        $registry = $this->app->make(PermissionRegistry::class);

        $registry->register('audit', 'Activity logs', ['audit.view' => 'View activity logs']);
        $registry->register('settings', 'Application settings', [
            'settings.view' => 'View application settings',
            'settings.update' => 'Change application settings',
        ]);
        $registry->register('api', 'API', ['api.view' => 'View API overview']);
    }

    private function configureAuthorization(): void
    {
        // Super Admin passes every permission check (e.g. can:users.view). Ability checks that carry
        // a model (policies) are NOT bypassed, so invariants such as "cannot delete yourself" hold.
        Gate::before(function (User $user, string $ability, array $arguments = []) {
            return $arguments === [] && $user->isSuperAdmin() ? true : null;
        });
    }

    private function configureRateLimiting(): void
    {
        RateLimiter::for('api', fn (Request $request) => Limit::perMinute(60)->by($request->user()?->getAuthIdentifier() ?: $request->ip()));

        RateLimiter::for('web-login', fn (Request $request) => Limit::perMinute(10)->by($request->ip()));

        RateLimiter::for('api-login', fn (Request $request) => Limit::perMinute(5)->by(strtolower((string) $request->input('email')).'|'.$request->ip()));
    }
}
