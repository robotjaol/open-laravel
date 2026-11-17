<?php

namespace App\Modules\Dashboard\Http\Controllers;

use App\Core\Audit\Models\AuditLog;
use App\Core\Authentication\Enums\UserStatus;
use App\Core\Authentication\Models\LoginHistory;
use App\Core\Authentication\Models\User;
use App\Shared\Http\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $actor = $request->user();
        $canUsers = $actor->can('users.view');

        return Inertia::render('dashboard', [
            'kpis' => $canUsers ? Cache::remember('dashboard.kpis', 60, fn (): array => $this->kpis()) : null,
            'logins_chart' => $canUsers ? Cache::remember('dashboard.logins', 60, fn (): array => $this->loginsPerDay()) : [],
            'recent_activity' => $actor->can('audit.view')
                ? AuditLog::query()->with('user:id,name')->latest('id')->limit(8)->get()
                    ->map(fn (AuditLog $l): array => [
                        'id' => $l->id,
                        'description' => $l->description,
                        'user' => $l->user?->name ?? $l->actor_name,
                        'created_at' => $l->created_at->toIso8601String(),
                    ])->all()
                : [],
        ]);
    }

    /**
     * @return array<string, int>
     */
    private function kpis(): array
    {
        $since = now()->subDay();

        return [
            'users_total' => User::query()->count(),
            'users_active' => User::query()->where('status', UserStatus::Active->value)->count(),
            'roles_total' => Role::query()->count(),
            'logins_24h' => LoginHistory::query()->where('event', 'login')->where('created_at', '>=', $since)->count(),
            'failed_logins_24h' => LoginHistory::query()->where('event', 'failed')->where('created_at', '>=', $since)->count(),
        ];
    }

    /**
     * Successful logins for each of the last 7 days (including days with zero).
     *
     * @return list<array{label: string, value: int}>
     */
    private function loginsPerDay(): array
    {
        $start = now()->subDays(6)->startOfDay();

        $counts = LoginHistory::query()
            ->where('event', 'login')
            ->where('created_at', '>=', $start)
            ->selectRaw('DATE(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day');

        $points = [];
        for ($i = 0; $i < 7; $i++) {
            $day = $start->copy()->addDays($i);
            $points[] = ['label' => $day->format('D'), 'value' => (int) ($counts[$day->toDateString()] ?? 0)];
        }

        return $points;
    }
}
