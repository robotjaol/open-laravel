import { Head, Link, router } from '@inertiajs/react';
import { FolderKanban, Pencil, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import { DataTable, type Column } from '@/components/app/data-table';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useCan } from '@/hooks/use-can';
import { formatDate } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Option, Paginated, TableQuery } from '@/types';

interface ProjectRow {
    id: number;
    code: string;
    name: string;
    status: string;
    owner: { id: number; name: string } | null;
    starts_on: string | null;
    due_on: string | null;
    updated_at: string;
    can: { update: boolean; delete: boolean };
}

export default function ProjectsIndex({
    projects,
    query,
    filters,
}: {
    projects: Paginated<ProjectRow>;
    query: TableQuery;
    filters: { statuses: Option[] };
}) {
    const { can } = useCan();
    const [target, setTarget] = React.useState<ProjectRow | null>(null);

    const columns: Column<ProjectRow>[] = [
        {
            key: 'code',
            header: 'Code',
            sortable: true,
            cell: (p) => <span className="font-mono text-xs">{p.code}</span>,
        },
        {
            key: 'name',
            header: 'Project',
            sortable: true,
            required: true,
            cell: (p) => <span className="font-medium">{p.name}</span>,
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            cell: (p) => <StatusBadge status={p.status} />,
        },
        {
            key: 'owner',
            header: 'Owner',
            cell: (p) => p.owner?.name ?? <span className="text-muted-foreground">Unassigned</span>,
        },
        { key: 'due_on', header: 'Due', sortable: true, cell: (p) => formatDate(p.due_on) },
        {
            key: 'actions',
            header: 'Actions',
            required: true,
            className: 'w-28 text-right',
            cell: (p) => (
                <div className="flex justify-end gap-1">
                    {p.can.update && (
                        <Tooltip label={`Edit ${p.name}`}>
                            <Button variant="ghost" size="icon" asChild>
                                <Link
                                    href={routes.projects.edit(p.id)}
                                    aria-label={`Edit ${p.name}`}
                                >
                                    <Pencil />
                                </Link>
                            </Button>
                        </Tooltip>
                    )}
                    {p.can.delete && (
                        <Tooltip label={`Delete ${p.name}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Delete ${p.name}`}
                                onClick={() => setTarget(p)}
                            >
                                <Trash2 />
                            </Button>
                        </Tooltip>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Projects" />
            <PageHeader
                title="Projects"
                description="Example module: a complete CRUD slice you can copy for your own domain."
                breadcrumbs={[{ label: 'Workspace' }, { label: 'Projects' }]}
                actions={
                    can('projects.create') ? (
                        <Button asChild>
                            <Link href={routes.projects.create}>
                                <Plus />
                                New project
                            </Link>
                        </Button>
                    ) : undefined
                }
            />
            <DataTable
                path={routes.projects.index}
                columns={columns}
                rows={projects.data}
                meta={projects.meta}
                query={query}
                rowKey={(p) => p.id}
                storageKey="projects"
                searchLabel="Search projects by name or code"
                filters={[{ key: 'status', label: 'Status', options: filters.statuses }]}
                emptyTitle="No projects yet"
                emptyDescription="Projects you create will be listed here."
                emptyAction={
                    can('projects.create') ? (
                        <Button asChild>
                            <Link href={routes.projects.create}>
                                <FolderKanban />
                                New project
                            </Link>
                        </Button>
                    ) : undefined
                }
            />
            <ConfirmDialog
                open={target !== null}
                onOpenChange={(o) => !o && setTarget(null)}
                title={`Delete ${target?.name ?? 'project'}?`}
                description="The project is archived by soft delete and can be restored from the database."
                confirmLabel={`Delete ${target?.name ?? 'project'}`}
                onConfirm={() => {
                    if (!target) return;
                    router.delete(routes.projects.destroy(target.id), {
                        preserveScroll: true,
                        onFinish: () => setTarget(null),
                    });
                }}
            />
        </>
    );
}
