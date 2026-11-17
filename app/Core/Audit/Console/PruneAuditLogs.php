<?php

namespace App\Core\Audit\Console;

use App\Core\Audit\Models\AuditLog;
use App\Core\Authentication\Models\LoginHistory;
use App\Core\Settings\SettingsService;
use Illuminate\Console\Command;

class PruneAuditLogs extends Command
{
    protected $signature = 'audit:prune {--days= : Override the configured retention period}';

    protected $description = 'Delete audit and login history rows older than the retention period';

    public function handle(SettingsService $settings): int
    {
        $days = (int) ($this->option('days') ?: $settings->get('audit_retention_days'));

        if ($days < 30) {
            $this->error('Retention below 30 days is refused to protect the audit trail.');

            return self::FAILURE;
        }

        $cutoff = now()->subDays($days);
        $audit = AuditLog::query()->where('created_at', '<', $cutoff)->delete();
        $logins = LoginHistory::query()->where('created_at', '<', $cutoff)->delete();

        $this->info("Pruned {$audit} audit rows and {$logins} login history rows older than {$days} days.");

        return self::SUCCESS;
    }
}
