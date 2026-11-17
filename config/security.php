<?php

return [
    'password' => [
        'min_length' => 12,
        // Have I Been Pwned k-anonymity lookup. Needs outbound HTTPS, so it is off in tests/CI by default.
        'check_breached' => (bool) env('SECURITY_CHECK_BREACHED_PASSWORDS', env('APP_ENV') === 'production'),
    ],

    'login' => [
        'max_attempts' => 5,
        'decay_seconds' => 60,
    ],

    'headers' => [
        'csp_enabled' => (bool) env('SECURITY_CSP_ENABLED', env('APP_ENV') === 'production'),
        'hsts' => (bool) env('SECURITY_HSTS', env('APP_ENV') === 'production'),
    ],

    'registration_enabled' => (bool) env('REGISTRATION_ENABLED', false),
    'require_email_verification' => (bool) env('REQUIRE_EMAIL_VERIFICATION', false),
];
