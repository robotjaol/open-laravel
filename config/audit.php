<?php

return [
    'retention_days' => (int) env('AUDIT_RETENTION_DAYS', 365),

    // Attribute names whose values are always replaced before they reach the audit trail.
    'redact' => [
        'password', 'password_confirmation', 'current_password', 'remember_token', 'token',
        'api_token', 'secret', 'authorization', 'cookie', 'two_factor_secret',
    ],
];
