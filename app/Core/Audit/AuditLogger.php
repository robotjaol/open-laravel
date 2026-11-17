<?php

namespace App\Core\Audit;

use App\Core\Audit\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Throwable;

/**
 * Writes audit entries. Secrets are redacted by key name before anything is stored.
 */
class AuditLogger
{
    public const REDACTED = '[redacted]';

    /**
     * @param  array<string, mixed>  $properties
     */
    public function log(string $event, string $description, ?Model $subject = null, array $properties = [], ?Model $actor = null): ?AuditLog
    {
        try {
            $actor ??= request()->user() ?? Auth::user();
            $request = app()->runningInConsole() && ! app()->runningUnitTests() ? null : request();

            return AuditLog::create([
                'user_id' => $actor?->getKey(),
                'actor_name' => $actor?->getAttribute('name'),
                'event' => Str::limit($event, 64, ''),
                'description' => Str::limit($description, 500, ''),
                'subject_type' => $subject?->getMorphClass(),
                'subject_id' => $subject?->getKey(),
                'properties' => $properties === [] ? null : $this->redact($properties),
                'ip_address' => $request?->ip(),
                'user_agent' => $request ? Str::limit((string) $request->userAgent(), 255, '') : null,
            ]);
        } catch (Throwable $e) {
            // Auditing must never break the user's action, but a failure must be visible.
            report($e);

            return null;
        }
    }

    /**
     * Replace the value of any sensitive key, at any depth.
     *
     * @param  array<array-key, mixed>  $data
     * @return array<array-key, mixed>
     */
    public function redact(array $data): array
    {
        $sensitive = array_map('strtolower', (array) config('audit.redact', []));

        foreach ($data as $key => $value) {
            $name = strtolower((string) $key);

            if (in_array($name, $sensitive, true) || str_contains($name, 'password') || str_contains($name, 'secret')) {
                $data[$key] = self::REDACTED;
            } elseif (is_array($value)) {
                $data[$key] = $this->redact($value);
            }
        }

        return $data;
    }
}
