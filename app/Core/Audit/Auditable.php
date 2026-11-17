<?php

namespace App\Core\Audit;

use Illuminate\Database\Eloquent\Model;

/**
 * Records created / updated / deleted events for a model in the audit trail.
 *
 * Define `protected array $auditExclude = [...]` on the model to ignore noisy attributes.
 *
 * @mixin Model
 */
trait Auditable
{
    public static function bootAuditable(): void
    {
        static::created(fn (Model $model) => $model->writeAudit('created', $model->getAttributes()));

        static::updated(function (Model $model): void {
            $changes = $model->getChanges();
            $old = array_intersect_key($model->getOriginal(), $changes);
            $model->writeAudit('updated', $changes, $old);
        });

        static::deleted(fn (Model $model) => $model->writeAudit('deleted', [], $model->getAttributes()));
    }

    /**
     * @param  array<string, mixed>  $new
     * @param  array<string, mixed>  $old
     */
    protected function writeAudit(string $action, array $new, array $old = []): void
    {
        $exclude = property_exists($this, 'auditExclude') ? $this->auditExclude : [];
        $ignored = array_merge(['updated_at', 'created_at', 'remember_token'], $exclude);

        $new = array_diff_key($new, array_flip($ignored));
        $old = array_diff_key($old, array_flip($ignored));

        if ($action === 'updated' && $new === []) {
            return;
        }

        $label = class_basename($this);
        $properties = array_filter(['attributes' => $new, 'old' => $old], fn (array $v): bool => $v !== []);

        app(AuditLogger::class)->log(
            event: strtolower($label).'.'.$action,
            description: $action.' '.strtolower($label).' '.$this->auditLabel(),
            subject: $this,
            properties: $properties,
        );
    }

    /** Human-readable identifier used in audit descriptions. */
    protected function auditLabel(): string
    {
        $raw = $this->getAttributes();

        return (string) ($raw['name'] ?? $raw['email'] ?? '#'.$this->getKey());
    }
}
