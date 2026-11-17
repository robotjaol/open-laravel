<?php

namespace App\Core\Authorization\Console;

use App\Core\Authorization\AuthorizationSynchronizer;
use Illuminate\Console\Command;

class SyncAuthorization extends Command
{
    protected $signature = 'authorization:sync';

    protected $description = 'Create any missing permissions and default roles from the code-defined catalogue';

    public function handle(AuthorizationSynchronizer $synchronizer): int
    {
        $synchronizer->sync();
        $this->info('Permissions and default roles are in sync.');

        return self::SUCCESS;
    }
}
