<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Route as RouteFacade;
use Inertia\Inertia;
use Inertia\Response;

class ApiOverviewController extends Controller
{
    public function __invoke(Request $request): Response
    {
        abort_unless($request->user()->can('api.view'), 403);

        $endpoints = collect(RouteFacade::getRoutes()->getRoutes())
            ->filter(fn (Route $r): bool => str_starts_with($r->uri(), 'api/v1'))
            ->flatMap(fn (Route $r) => collect($r->methods())
                ->reject(fn (string $m): bool => in_array($m, ['HEAD', 'OPTIONS'], true))
                ->map(fn (string $m): array => [
                    'method' => $m,
                    'uri' => '/'.$r->uri(),
                    'auth' => in_array('auth:sanctum', $r->gatherMiddleware(), true),
                    'middleware' => array_values(array_filter($r->gatherMiddleware(), 'is_string')),
                ]))
            ->sortBy(['uri', 'method'])
            ->values()
            ->all();

        return Inertia::render('api/overview', [
            'baseUrl' => rtrim((string) config('app.url'), '/').'/api/v1',
            'version' => 'v1',
            'endpoints' => $endpoints,
        ]);
    }
}
