<?php

namespace App\Core\Audit\Http;

use App\Core\Audit\Models\AuditLog;
use App\Shared\Support\PaginatedData;
use App\Shared\Support\TableQuery;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(Request $request): Response
    {
        abort_unless($request->user()->can('audit.view'), 403);

        $query = TableQuery::fromRequest($request, ['created_at', 'event'], 'created_at', 'desc', ['event']);

        $logs = AuditLog::query()->with('user:id,name');
        $query->applySearch($logs, ['description', 'actor_name', 'event']);

        if ($event = $query->filter('event')) {
            $logs->where('event', $event);
        }

        $logs->orderBy($query->sort, $query->direction)->orderByDesc('id');

        return Inertia::render('activity/index', [
            'logs' => PaginatedData::make($logs->paginate($query->perPage)->withQueryString(), fn (AuditLog $l): array => [
                'id' => $l->id,
                'event' => $l->event,
                'description' => $l->description,
                'user' => $l->user ? ['id' => $l->user->id, 'name' => $l->user->name] : ($l->actor_name ? ['id' => 0, 'name' => $l->actor_name] : null),
                'subject' => $l->subject_type ? class_basename($l->subject_type).'#'.$l->subject_id : null,
                'ip_address' => $l->ip_address,
                'created_at' => $l->created_at->toIso8601String(),
                'properties' => $l->properties,
            ]),
            'query' => $query->toArray(),
            'filters' => [
                'events' => AuditLog::query()->distinct()->orderBy('event')->pluck('event')
                    ->map(fn (string $e): array => ['value' => $e, 'label' => $e])->all(),
            ],
        ]);
    }
}
