<?php

namespace App\Core\Settings;

use App\Core\Settings\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;
use Throwable;

/**
 * Runtime-editable settings: database values override config('settings.defaults').
 * Reads are cached; writes invalidate the cache.
 */
class SettingsService
{
    private const CACHE_KEY = 'settings.all';

    /** @var array<string, mixed>|null */
    private ?array $memo = null;

    /**
     * @return array<string, mixed>
     */
    public function all(): array
    {
        $defaults = (array) config('settings.defaults', []);

        return array_replace($defaults, $this->stored());
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->all()[$key] ?? $default;
    }

    /**
     * Persist several settings atomically. Unknown keys are rejected so typos cannot create junk.
     *
     * @param  array<string, mixed>  $values
     */
    public function set(array $values, ?int $userId = null): void
    {
        $known = array_keys((array) config('settings.defaults', []));

        foreach (array_keys($values) as $key) {
            if (! in_array($key, $known, true)) {
                throw new InvalidArgumentException("Unknown setting [{$key}].");
            }
        }

        DB::transaction(function () use ($values, $userId): void {
            foreach ($values as $key => $value) {
                Setting::updateOrCreate(['key' => $key], ['value' => $value, 'updated_by' => $userId]);
            }
        });

        $this->flush();
    }

    public function flush(): void
    {
        $this->memo = null;
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * Push database-backed values into runtime config. Safe before migrations have run.
     */
    public function applyToConfig(): void
    {
        $values = $this->all();

        config([
            'app.name' => $values['app_name'],
            'app.timezone' => $values['timezone'],
            'app.locale' => $values['locale'],
        ]);

        date_default_timezone_set((string) $values['timezone']);
        app()->setLocale((string) $values['locale']);
    }

    /**
     * @return array<string, mixed>
     */
    private function stored(): array
    {
        if ($this->memo !== null) {
            return $this->memo;
        }

        try {
            return $this->memo = Cache::remember(
                self::CACHE_KEY,
                3600,
                fn (): array => Setting::query()->pluck('value', 'key')->all(),
            );
        } catch (Throwable $e) {
            // Tables may not exist yet (fresh install, first migrate). Fall back to defaults, but say so.
            Log::warning('Settings unavailable, using defaults: '.$e->getMessage());

            return $this->memo = [];
        }
    }
}
