<?php

return [
    // This template authenticates API clients with bearer tokens only, not SPA cookies.
    'stateful' => [],
    'guard' => [],
    // Tokens expire after 8 hours unless overridden (minutes). Null disables expiry.
    'expiration' => env('SANCTUM_TOKEN_EXPIRATION', 480),
    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),
];
