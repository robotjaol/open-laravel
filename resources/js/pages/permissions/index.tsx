import { Head, router } from '@inertiajs/react';
import { Lock } from 'lucide-react';
import { PageHeader } from '@/components/app/page-header';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { routes } from '@/lib/routes';
import type { PermissionGroup } from '@/components/forms/role-form';

interface RoleCol {
    id: number;
    name: string;
    permissions: string[];
    is_locked: boolean;
}

export default function PermissionsIndex({
    groups,
    roles,
    canManage,
}: {
    groups: PermissionGroup[];
    roles: RoleCol[];
    canManage: boolean;
}) {
    const toggle = (role: RoleCol, permission: string, granted: boolean) =>
        router.put(
            routes.permissions.toggle,
            { role_id: role.id, permission, granted },
            { preserveScroll: true },
        );

    return (
        <>
            <Head title="Permissions" />
            <PageHeader
                title="Permissions"
                description="See which roles hold each permission. Changes apply immediately."
                breadcrumbs={[{ label: 'Administration' }, { label: 'Permissions' }]}
            />
            <div className="rounded-card border bg-surface shadow-card">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Permission</TableHead>
                            {roles.map((r) => (
                                <TableHead key={r.id} className="text-center">
                                    <span className="inline-flex items-center gap-1">
                                        {r.name}
                                        {r.is_locked && (
                                            <Lock
                                                className="size-3"
                                                aria-label="System role, locked"
                                            />
                                        )}
                                    </span>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {groups.map((group) => (
                            <GroupRows
                                key={group.key}
                                group={group}
                                roles={roles}
                                canManage={canManage}
                                onToggle={toggle}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

function GroupRows({
    group,
    roles,
    canManage,
    onToggle,
}: {
    group: PermissionGroup;
    roles: RoleCol[];
    canManage: boolean;
    onToggle: (r: RoleCol, p: string, g: boolean) => void;
}) {
    return (
        <>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableCell
                    colSpan={roles.length + 1}
                    className="py-2 text-xs font-semibold text-muted-foreground"
                >
                    {group.label}
                </TableCell>
            </TableRow>
            {group.permissions.map((p) => (
                <TableRow key={p.name}>
                    <TableCell>
                        <p className="font-medium">{p.label}</p>
                        <p className="font-mono text-xs text-muted-foreground">{p.name}</p>
                    </TableCell>
                    {roles.map((r) => (
                        <TableCell key={r.id} className="text-center">
                            <Checkbox
                                aria-label={`${r.name} can ${p.label.toLowerCase()}`}
                                checked={r.permissions.includes(p.name)}
                                disabled={!canManage || r.is_locked}
                                onChange={(e) => onToggle(r, p.name, e.target.checked)}
                            />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
}
