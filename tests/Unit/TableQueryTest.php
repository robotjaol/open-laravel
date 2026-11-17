<?php

namespace Tests\Unit;

use App\Shared\Support\TableQuery;
use Illuminate\Http\Request;
use PHPUnit\Framework\TestCase;

class TableQueryTest extends TestCase
{
    public function test_unknown_sort_falls_back_to_default(): void
    {
        $q = TableQuery::fromRequest(Request::create('/', 'GET', ['sort' => 'password; DROP TABLE users']), ['name'], 'name');

        $this->assertSame('name', $q->sort);
    }

    public function test_invalid_direction_falls_back(): void
    {
        $q = TableQuery::fromRequest(Request::create('/', 'GET', ['direction' => 'sideways']), ['name'], 'name', 'desc');

        $this->assertSame('desc', $q->direction);
    }

    public function test_per_page_is_restricted_to_allowed_values(): void
    {
        $q = TableQuery::fromRequest(Request::create('/', 'GET', ['per_page' => 100000]), ['name'], 'name');

        $this->assertContains($q->perPage, TableQuery::PER_PAGE_OPTIONS);
    }

    public function test_only_declared_filters_are_exposed(): void
    {
        $q = TableQuery::fromRequest(Request::create('/', 'GET', ['filter' => ['role' => 'Admin', 'evil' => 'x']]), ['name'], 'name', 'asc', ['role']);

        $this->assertSame('Admin', $q->filter('role'));
        $this->assertNull($q->filter('evil'));
    }
}
