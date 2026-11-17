<?php

namespace App\Shared\Exceptions;

use RuntimeException;

/**
 * Thrown when an action is valid input but breaks a domain invariant
 * (for example deleting the last Super Admin). Rendered as a 422 for the API
 * and as a flash error for web requests.
 */
class BusinessRuleViolation extends RuntimeException {}
