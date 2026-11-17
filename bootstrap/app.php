<?php

use App\Http\Middleware\EnsureUserIsActive;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SecurityHeaders;
use App\Shared\Exceptions\ApiExceptionRenderer;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            SecurityHeaders::class,
            EnsureUserIsActive::class,
            HandleInertiaRequests::class,
        ]);

        $middleware->api(append: [SecurityHeaders::class]);
        $middleware->throttleApi();

        $middleware->alias(['active' => EnsureUserIsActive::class]);

        // Behind a load balancer, trust forwarded headers so URLs and secure cookies are correct.
        $middleware->trustProxies(at: env('TRUSTED_PROXIES') === '*' ? '*' : array_filter(explode(',', (string) env('TRUSTED_PROXIES', ''))));
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Consistent JSON envelope for every API error.
        $exceptions->render(fn (Throwable $e, Request $request) => $request->is('api/*')
            ? ApiExceptionRenderer::render($e, $request)
            : null);

        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            if ($request->is('api/*') || $request->expectsJson()) {
                return $response;
            }

            $status = $response->getStatusCode();

            if ($status === 419) {
                return back()->with('error', 'Your session expired. Please try again.');
            }

            $debugging = app()->hasDebugModeEnabled() && $status === 500;

            if (in_array($status, [403, 404, 429, 500, 503], true) && ! $debugging) {
                $component = $request->user() ? 'errors/error' : 'errors/public';

                return Inertia::render($component, ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })->create();
