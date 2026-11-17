<?php

namespace App\Modules\Projects\Models;

use App\Core\Audit\Auditable;
use App\Core\Authentication\Models\User;
use App\Modules\Projects\Enums\ProjectStatus;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property ProjectStatus $status
 * @property int|null $owner_id
 * @property Carbon|null $starts_on
 * @property Carbon|null $due_on
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[UseFactory(ProjectFactory::class)]
class Project extends Model
{
    use Auditable;
    use HasFactory;

    protected $fillable = ['code', 'name', 'description', 'status', 'owner_id', 'starts_on', 'due_on'];

    protected function casts(): array
    {
        return ['status' => ProjectStatus::class, 'starts_on' => 'date', 'due_on' => 'date'];
    }

    /** @return BelongsTo<User, $this> */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}
