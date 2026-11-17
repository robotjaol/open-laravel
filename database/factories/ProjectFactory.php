<?php

namespace Database\Factories;

use App\Modules\Projects\Enums\ProjectStatus;
use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    protected $model = Project::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'code' => strtoupper(fake()->unique()->bothify('PRJ-####')),
            'name' => fake()->unique()->catchPhrase(),
            'description' => fake()->sentence(),
            'status' => fake()->randomElement(ProjectStatus::cases()),
            'owner_id' => null,
            'starts_on' => null,
            'due_on' => null,
        ];
    }
}
