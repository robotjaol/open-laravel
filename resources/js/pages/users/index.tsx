import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, UserCheck, UserX } from 'lucide-react';
import * as React from 'react';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import { DataTable, type Column } from '@/components/app/data-table';
import { PageHeader } from '@/components/app/page-header';
import { StatusBadge } from '@/components/app/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';
import { useCan } from '@/hooks/use-can';
import { formatDate, timeAgo } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Option, Paginated, TableQuery } from '@/types';

interface UserRow {
    id: number;
    name: string;
    email: string;
    status: string;
    roles: string[];
    last_login_at: string | null;
    created_at: string;
    can: { update: boolean; delete: boolean };
}
interface Props {
    users: Paginated<UserRow>;
    query: TableQuery;
    filters: { roles: Option[]; statuses: Option[] };
}

export default function UsersIndex({ users, query, filters }: Props) {
    const { can } = useCan();
    const [target, setTarget] = React.useState<UserRow | null>(null);
    const [deleting, setDeleting] = React.useState(false);

    const columns: Column<UserRow>[] = [
        {
            key: 'name',
            header: 'Name',
            sortable: true,
            required: true,
            cell: (u) => (
                <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
            ),
        },
        {
            key: 'roles',
            header: 'Roles',
            cell: (u) => (
                <div className="flex flex-wrap gap-1">
                    {u.roles.length ? (
                        u.roles.map((r) => (
                            <Badge key={r} variant="primary">
                                {r}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-muted-foreground">None</span>
                    )}
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            sortable: true,
            cell: (u) => <StatusBadge status={u.status} />,
        },
        {
            key: 'last_login_at',
            header: 'Last sign-in',
            sortable: true,
            cell: (u) => (
                <span title={formatDate(u.last_login_at, true)}>
                    {u.last_login_at ? timeAgo(u.last_login_at) : 'Never'}
                </span>
            ),
        },
        {
            key: 'created_at',
            header: 'Created',
            sortable: true,
            cell: (u) => formatDate(u.created_at),
        },
        {
            key: 'actions',
            header: 'Actions',
            required: true,
            className: 'w-32 text-right',
            cell: (u) => (
                <div className="flex justify-end gap-1">
                    {u.can.update && (
                        <>
                            <Tooltip label={`Edit ${u.name}`}>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        href={routes.users.edit(u.id)}
                                        aria-label={`Edit ${u.name}`}
                                    >
                                        <Pencil />
                                    </Link>
                                </Button>
                            </Tooltip>
                            <Tooltip
                                label={
                                    u.status === 'active'
                                        ? `Deactivate ${u.name}`
                                        : `Activate ${u.name}`
                                }
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label={
                                        u.status === 'active'
                                            ? `Deactivate ${u.name}`
                                            : `Activate ${u.name}`
                                    }
                                    onClick={() =>
                                        router.patch(
                                            routes.users.status(u.id),
                                            {
                                                status:
                                                    u.status === 'active' ? 'inactive' : 'active',
                                            },
                                            { preserveScroll: true },
                                        )
                                    }
                                >
                                    {u.status === 'active' ? <UserX /> : <UserCheck />}
                                </Button>
                            </Tooltip>
                        </>
                    )}
                    {u.can.delete && (
                        <Tooltip label={`Delete ${u.name}`}>
                            <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Delete ${u.name}`}
                                onClick={() => setTarget(u)}
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
            <Head title="Users" />
            <PageHeader
                title="Users"
                description="Manage who can access the workspace."
                breadcrumbs={[{ label: 'Administration' }, { label: 'Users' }]}
                actions={
                    can('users.create') ? (
                        <Button asChild>
                            <Link href={routes.users.create}>
                                <Plus />
                                Add user
                            </Link>
                        </Button>
                    ) : undefined
                }
            />
            <DataTable
                path={routes.users.index}
                columns={columns}
                rows={users.data}
                meta={users.meta}
                query={query}
                rowKey={(u) => u.id}
                storageKey="users"
                searchLabel="Search users by name or email"
                filters={[
                    { key: 'status', label: 'Status', options: filters.statuses },
                    { key: 'role', label: 'Role', options: filters.roles },
                ]}
                emptyTitle="No users yet"
                emptyDescription="Create the first user to get started."
                emptyAction={
                    can('users.create') ? (
                        <Button asChild>
                            <Link href={routes.users.create}>Add user</Link>
                        </Button>
                    ) : undefined
                }
            />
            <ConfirmDialog
                open={target !== null}
                onOpenChange={(o) => !o && setTarget(null)}
                title={`Delete ${target?.name ?? 'user'}?`}
                description="The account is removed and the user can no longer sign in. This action is recorded in the activity log."
                confirmLabel={`Delete ${target?.name ?? 'user'}`}
                loading={deleting}
                onConfirm={() => {
                    if (!target) return;
                    router.delete(routes.users.destroy(target.id), {
                        preserveScroll: true,
                        onStart: () => setDeleting(true),
                        onFinish: () => {
                            setDeleting(false);
                            setTarget(null);
                        },
                    });
                }}
            />
        </>
    );
}
