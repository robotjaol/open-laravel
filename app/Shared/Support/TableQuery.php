<?php

namespace App\Shared\Support;

use Illuminate\Contracts\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Http\Request;

/**
 * Parses and sanitises list-page query parameters (search, sort, filters, page size).
 *
 * Sorting is restricted to a whitelist so user input can never reach ORDER BY unchecked.
 */
final class TableQuery
{
    public const PER_PAGE_OPTIONS = [10, 25, 50, 100];

    /**
     * @param  array<string, string>  $filters
     */
    private function __construct(
        public readonly string $search,
        public readonly string $sort,
        public readonly string $direction,
        public readonly int $perPage,
        public readonly array $filters,
    ) {}

    /**
     * @param  list<string>  $sortable  Columns clients may sort by.
     * @param  list<string>  $filterable  Filter keys clients may use, read from filter[key].
     */
    public static function fromRequest(
        Request $request,
        array $sortable,
        string $defaultSort,
        string $defaultDirection = 'asc',
        array $filterable = [],
    ): self {
        $sort = (string) $request->query('sort', $defaultSort);
        if (! in_array($sort, $sortable, true)) {
            $sort = $defaultSort;
        }

        $direction = strtolower((string) $request->query('direction', $defaultDirection));
        if (! in_array($direction, ['asc', 'desc'], true)) {
            $direction = $defaultDirection;
        }

        $perPage = (int) $request->query('per_page', self::PER_PAGE_OPTIONS[0]);
        if (! in_array($perPage, self::PER_PAGE_OPTIONS, true)) {
            $perPage = self::PER_PAGE_OPTIONS[0];
        }

        $rawFilters = $request->query('filter', []);
        $filters = [];
        foreach ($filterable as $key) {
            $value = is_array($rawFilters) ? ($rawFilters[$key] ?? '') : '';
            $filters[$key] = is_string($value) ? mb_substr(trim($value), 0, 100) : '';
        }

        $search = $request->query('search', '');

        return new self(
            search: is_string($search) ? mb_substr(trim($search), 0, 100) : '',
            sort: $sort,
            direction: $direction,
            perPage: $perPage,
            filters: $filters,
        );
    }

    public function filter(string $key): ?string
    {
        $value = $this->filters[$key] ?? '';

        return $value === '' ? null : $value;
    }

    /**
     * Apply a LIKE search across columns with wildcard characters in the input escaped.
     *
     * @param  EloquentBuilder<*>|QueryBuilder  $query
     * @param  list<string>  $columns
     */
    public function applySearch(EloquentBuilder|QueryBuilder $query, array $columns): void
    {
        if ($this->search === '') {
            return;
        }

        // "!" is the escape character: portable across SQLite, MySQL and PostgreSQL (backslash is not).
        $term = '%'.str_replace(['!', '%', '_'], ['!!', '!%', '!_'], $this->search).'%';

        $query->where(function ($inner) use ($columns, $term): void {
            foreach ($columns as $column) {
                $inner->orWhereRaw('LOWER('.$column.") LIKE LOWER(?) ESCAPE '!'", [$term]);
            }
        });
    }

    /**
     * @return array{search: string, sort: string, direction: string, per_page: int, filters: array<string, string>}
     */
    public function toArray(): array
    {
        return [
            'search' => $this->search,
            'sort' => $this->sort,
            'direction' => $this->direction,
            'per_page' => $this->perPage,
            'filters' => $this->filters,
        ];
    }
}
