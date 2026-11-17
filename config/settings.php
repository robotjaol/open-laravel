<?php

/*
 | Defaults for runtime-editable settings. Values saved in the `settings` table override these.
 | Add a key here, then expose it in App\Core\Settings\Http\SettingsController to make it editable.
 */
return [
    'defaults' => [
        'app_name' => env('APP_NAME', 'Open Laravel'),
        'timezone' => env('APP_TIMEZONE', 'UTC'),
        'locale' => env('APP_LOCALE', 'en'),
        'registration_enabled' => (bool) env('REGISTRATION_ENABLED', false),
        'audit_retention_days' => (int) env('AUDIT_RETENTION_DAYS', 365),
    ],

    'locales' => ['en' => 'English', 'id' => 'Bahasa Indonesia'],
];
