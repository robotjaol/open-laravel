<?php

namespace App\Modules\Dashboard;

use App\Shared\Support\ModuleServiceProvider;

class DashboardServiceProvider extends ModuleServiceProvider
{
    protected function modulePath(): string
    {
        return __DIR__;
    }
}
