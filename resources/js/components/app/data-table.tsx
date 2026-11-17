import { router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, ArrowUpDown, Columns3, Search } from 'lucide-react';
import * as React from 'react';
import { EmptyState } from '@/components/app/empty-state';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input, Select } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tooltip } from '@/components/ui/tooltip';
import { useDebounced } from '@/hooks/use-debounced';
import type { Option, Paginated, TableQuery } from '@/types';

export interface Column<T> {
    key: string;
    header: string;
    cell: (row: T) => React.ReactNode;
    sortable?: boolean;
    /** Required columns cannot be hidden. */
    required?: boolean;
    className?: string;
}

export interface FilterDef {
    key: string;
    label: string;
    options: Option[];
}

interface DataTableProps<T> {
    path: string;
    columns: Column<T>[];
    rows: T[];
    meta: Paginated<T>['meta'];
    query: TableQuery;
    rowKey: (row: T) => string | number;
    storageKey: string;
    searchLabel: string;
    filters?: FilterDef[];
    emptyTitle: string;
    emptyDescription?: string;
    emptyAction?: React.ReactNode;
    toolbar?: React.ReactNode;
}

const PER_PAGE = [10, 25, 50, 100];

function loadHidden(storageKey: string): string[] {
    try {
        return JSON.parse(localStorage.getItem(`dt:${storageKey}`) ?? '[]') as string[];
    } catch {
        return [];
    }
}

export function DataTable<T>({
    path,
    columns,
    rows,
    meta,
    query,
    rowKey,
    storageKey,
    searchLabel,
    filters = [],
    emptyTitle,
    emptyDescription,
    emptyAction,
    toolbar,
}: DataTableProps<T>) {
    const [search, setSearch] = React.useState(query.search);
    const [loading, setLoading] = React.useState(false);
    const [hidden, setHidden] = React.useState<string[]>(() => loadHidden(storageKey));
    const debouncedSearch = useDebounced(search, 300);

    const visit = React.useCallback(
        (next: Partial<TableQuery> & { page?: number }) => {
            const merged = { ...query, ...next };
            const params: Record<string, string | number> = {};
            if (merged.search) params.search = merged.search;
            if (merged.sort) params.sort = merged.sort;
            if (merged.direction) params.direction = merged.direction;
            if (merged.per_page) params.per_page = merged.per_page;
            Object.entries(merged.filters).forEach(([key, value]) => {
                if (value) params[`filter[${key}]`] = value;
            });
            if (next.page && next.page > 1) params.page = next.page;
            router.get(path, params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setLoading(true),
                onFinish: () => setLoading(false),
            });
        },
        [path, query],
    );

    React.useEffect(() => {
        if (debouncedSearch !== query.search) visit({ search: debouncedSearch, page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch]);

    const toggleColumn = (key: string, visible: boolean) => {
        const next = visible ? hidden.filter((k) => k !== key) : [...hidden, key];
        setHidden(next);
        try {
            localStorage.setItem(`dt:${storageKey}`, JSON.stringify(next));
        } catch {
            /* preference not persisted */
        }
    };

    const shown = columns.filter((c) => c.required || !hidden.includes(c.key));
    const sortBy = (key: string) => {
        const direction = query.sort === key && query.direction === 'asc' ? 'desc' : 'asc';
        visit({ sort: key, direction, page: 1 });
    };
    const hasActiveFilter = query.search !== '' || Object.values(query.filters).some(Boolean);

    return (
        <div className="rounded-card border bg-surface shadow-card">
            <div className="flex flex-wrap items-center gap-2 border-b p-3">
                <div className="relative min-w-52 flex-1 sm:max-w-xs">
                    <Search
                        className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground"
                        aria-hidden="true"
                    />
                    <Input
                        type="search"
                        aria-label={searchLabel}
                        placeholder="Search…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                {filters.map((filter) => (
                    <Select
                        key={filter.key}
                        aria-label={`Filter by ${filter.label.toLowerCase()}`}
                        value={query.filters[filter.key] ?? ''}
                        onChange={(e) =>
                            visit({
                                filters: { ...query.filters, [filter.key]: e.target.value },
                                page: 1,
                            })
                        }
                        className="w-auto min-w-36"
                    >
                        <option value="">{`All ${filter.label.toLowerCase()}`}</option>
                        {filter.options.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </Select>
                ))}
                <div className="ml-auto flex items-center gap-2">
                    {toolbar}
                    <DropdownMenu>
                        <Tooltip label="Show or hide columns">
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    aria-label="Show or hide columns"
                                >
                                    <Columns3 />
                                </Button>
                            </DropdownMenuTrigger>
                        </Tooltip>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {columns
                                .filter((c) => !c.required)
                                .map((c) => (
                                    <DropdownMenuCheckboxItem
                                        key={c.key}
                                        checked={!hidden.includes(c.key)}
                                        onCheckedChange={(v) => toggleColumn(c.key, v === true)}
                                        onSelect={(e) => e.preventDefault()}
                                    >
                                        {c.header}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div
                aria-busy={loading}
                className={loading ? 'opacity-70 transition-opacity' : 'transition-opacity'}
            >
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {shown.map((c) => {
                                const active = query.sort === c.key;
                                const Icon = !active
                                    ? ArrowUpDown
                                    : query.direction === 'asc'
                                      ? ArrowUp
                                      : ArrowDown;
                                return (
                                    <TableHead
                                        key={c.key}
                                        className={c.className}
                                        aria-sort={
                                            active
                                                ? query.direction === 'asc'
                                                    ? 'ascending'
                                                    : 'descending'
                                                : undefined
                                        }
                                    >
                                        {c.sortable ? (
                                            <button
                                                type="button"
                                                onClick={() => sortBy(c.key)}
                                                className="-ml-2 inline-flex items-center gap-1 rounded-control px-2 py-1 hover:bg-muted"
                                            >
                                                {c.header}
                                                <Icon className="size-3" aria-hidden="true" />
                                            </button>
                                        ) : (
                                            c.header
                                        )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading && rows.length === 0
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <TableRow key={i}>
                                      {shown.map((c) => (
                                          <TableCell key={c.key}>
                                              <Skeleton className="h-4 w-24" />
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              ))
                            : rows.map((row) => (
                                  <TableRow key={rowKey(row)}>
                                      {shown.map((c) => (
                                          <TableCell key={c.key} className={c.className}>
                                              {c.cell(row)}
                                          </TableCell>
                                      ))}
                                  </TableRow>
                              ))}
                    </TableBody>
                </Table>
                {rows.length === 0 && !loading && (
                    <EmptyState
                        icon={Search}
                        title={hasActiveFilter ? 'No results match your filters' : emptyTitle}
                        description={
                            hasActiveFilter
                                ? 'Try a different search term or clear the filters.'
                                : emptyDescription
                        }
                        action={
                            hasActiveFilter ? (
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearch('');
                                        visit({ search: '', filters: {}, page: 1 });
                                    }}
                                >
                                    Clear filters
                                </Button>
                            ) : (
                                emptyAction
                            )
                        }
                    />
                )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t p-3 text-sm text-muted-foreground">
                <p aria-live="polite">
                    {meta.total === 0
                        ? '0 results'
                        : `Showing ${meta.from}–${meta.to} of ${meta.total}`}
                </p>
                <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2">
                        Rows
                        <Select
                            value={query.per_page}
                            onChange={(e) => visit({ per_page: Number(e.target.value), page: 1 })}
                            className="h-8 w-auto"
                        >
                            {PER_PAGE.map((n) => (
                                <option key={n} value={n}>
                                    {n}
                                </option>
                            ))}
                        </Select>
                    </label>
                    <span className="tabular">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.current_page <= 1}
                            onClick={() => visit({ page: meta.current_page - 1 })}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={meta.current_page >= meta.last_page}
                            onClick={() => visit({ page: meta.current_page + 1 })}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
