<?php

use App\Modules\Projects\Http\Controllers\ProjectApiController;
use Illuminate\Support\Facades\Route;

Route::apiResource('projects', ProjectApiController::class);
