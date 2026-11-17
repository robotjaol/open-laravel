<?php

namespace App\Shared\Http;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;

/** Base class for module controllers: adds $this->authorize() for policy checks. */
abstract class Controller extends BaseController
{
    use AuthorizesRequests;
}
