<?php

namespace App\Shared\Exceptions;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Throwable;

/**
 * Turns any exception into the API error envelope:
 * {"message": string, "code": string, "errors"?: {field: [messages]}}
 */
final class ApiExceptionRenderer
{
    public static function render(Throwable $e, Request $request): JsonResponse
    {
        return match (true) {
            $e instanceof ValidationException => self::json('validation_failed', $e->getMessage(), 422, ['errors' => $e->errors()]),
            $e instanceof AuthenticationException => self::json('unauthenticated', 'Authentication is required.', 401),
            $e instanceof AuthorizationException => self::json('forbidden', 'You are not allowed to perform this action.', 403),
            $e instanceof ModelNotFoundException => self::json('not_found', 'The requested resource was not found.', 404),
            $e instanceof BusinessRuleViolation => self::json('business_rule_violation', $e->getMessage(), 422),
            $e instanceof HttpExceptionInterface => self::fromHttp($e),
            default => self::json(
                'server_error',
                config('app.debug') ? $e->getMessage() : 'An unexpected error occurred.',
                500,
            ),
        };
    }

    private static function fromHttp(HttpExceptionInterface $e): JsonResponse
    {
        $status = $e->getStatusCode();
        [$code, $message] = match ($status) {
            403 => ['forbidden', 'You are not allowed to perform this action.'],
            404 => ['not_found', 'The requested resource was not found.'],
            405 => ['method_not_allowed', 'This HTTP method is not allowed for the endpoint.'],
            419 => ['session_expired', 'The request could not be verified. Please retry.'],
            429 => ['too_many_requests', 'Too many requests. Please slow down.'],
            default => ['http_error', $e->getMessage() !== '' ? $e->getMessage() : 'The request failed.'],
        };

        return self::json($code, $message, $status, [], $e->getHeaders());
    }

    /**
     * @param  array<string, mixed>  $extra
     * @param  array<string, string>  $headers
     */
    private static function json(string $code, string $message, int $status, array $extra = [], array $headers = []): JsonResponse
    {
        return response()->json(['message' => $message, 'code' => $code, ...$extra], $status, $headers);
    }
}
