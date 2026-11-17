<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('audit:prune')->daily()->onOneServer()->withoutOverlapping();
Schedule::command('queue:prune-failed --hours=168')->daily()->onOneServer();
Schedule::command('queue:prune-batches --hours=48')->daily()->onOneServer();
Schedule::command('auth:clear-resets')->daily()->onOneServer();
