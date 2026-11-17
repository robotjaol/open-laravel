import { Head, Link, router } from '@inertiajs/react';
import { Lock, Pencil, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import { DataTable, type Column } from '@/components/app/data-table';
import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useCan } from '@/hooks/use-can';
import { routes } from '@/lib/routes';
import type { Paginated, TableQuery } from '@/types';

interface RoleRow {
    id: number;
    name: string;
    users_count: number;
    permissions_count: number;
    is_locked: boolean;
    can: { update: boolean; delete: boolean };
}

export default function RolesIndex({
    roles,
    query,
}: {
    roles: Paginated<RoleRow>;
    query: TableQuery;
}) {
    const { can } = useCan();
    const [target, setTarget] = React.useState<RoleRow | null>(null);

    const columns: Column<RoleRow>[] = [
        {
            key: 'name',
            header: 'Role',
            sortable: true,
            required: true,
            cell: (r) => (
                <span className="flex items-center gap-2 font-medium">
                    {r.name}
                    {r.is_locked && (
                        <Badge>
                            <Lock className="size-3" aria-hidden="true" />
                            System
                        </Badge>
                    )}
                </span>
            ),
        },
        {
            key: 'permissions_count',
            header: 'Permissions',
            sortable: true,
            cell: (r) => r.permissions_count,
        },
        { key: 'users_count', header: 'Users', sortable: true, cell: (r) => r.users_count },
        {
            key: 'actions',
            header: 'Actions',
            required: true,
            className: 'w-28 text-right',
            cell: (r) => (
                <div className="flex justify-end gap-1">
                    <Tooltip label={r.can.update ? `Edit ${r.name}` : `View ${r.name}`}>
                        <Button variant="ghost" size="icon" asChild>
                            <Link
                                href={routes.roles.edit(r.id)}
                                aria-label={r.can.update ? `Edit ${r.name}` : `View ${r.name}`}
                            >
                                <Pencil />
                            </Link>
                        </Button>
                    </Tooltip>
                    {r.can.delete && (
                        <Tooltip label={`Delete ${r.name}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Delete ${r.name}`}
                                onClick={() => setTarget(r)}
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
            <Head title="Roles" />
            <PageHeader
                title="Roles"
                description="Group permissions into roles and assign them to users."
                breadcrumbs={[{ label: 'Administration' }, { label: 'Roles' }]}
                actions={
                    can('roles.create') ? (
                        <Button asChild>
                            <Link href={routes.roles.create}>
                                <Plus />
                                Create role
                            </Link>
                        </Button>
                    ) : undefined
                }
            />
            <DataTable
                path={routes.roles.index}
                columns={columns}
                rows={roles.data}
                meta={roles.meta}
                query={query}
                rowKey={(r) => r.id}
                storageKey="roles"
                searchLabel="Search roles by name"
                emptyTitle="No roles yet"
                emptyDescription="Create a role to start granting permissions."
            />
            <ConfirmDialog
                open={target !== null}
                onOpenChange={(o) => !o && setTarget(null)}
                title={`Delete the ${target?.name ?? ''} role?`}
                description={
                    target && target.users_count > 0
                        ? `${target.users_count} user(s) hold this role and will lose its permissions.`
                        : 'No users hold this role.'
                }
                confirmLabel={`Delete ${target?.name ?? 'role'}`}
                onConfirm={() => {
                    if (!target) return;
                    router.delete(routes.roles.destroy(target.id), {
                        preserveScroll: true,
                        onFinish: () => setTarget(null),
                    });
                }}
            />
        </>
    );
}
