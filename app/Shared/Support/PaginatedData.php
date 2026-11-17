<?php

namespace App\Shared\Support;

use Illuminate\Pagination\LengthAwarePaginator;

final class PaginatedData
{
    /**
     * Shape a paginator for the frontend `Paginated<T>` type.
     *
     * @template TModel
     *
     * @param  LengthAwarePaginator<int, TModel>  $paginator
     * @param  callable(TModel): array<string, mixed>  $map
     * @return array{data: list<array<string, mixed>>, meta: array<string, int|null>}
     */
    public static function make(LengthAwarePaginator $paginator, callable $map): array
    {
        return [
            'data' => array_values(array_map($map, $paginator->items())),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'from' => $paginator->firstItem(),
                'to' => $paginator->lastItem(),
            ],
        ];
    }
}
