import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/app/page-header';
import { RoleForm, type PermissionGroup, type RoleFormData } from '@/components/forms/role-form';
import { routes } from '@/lib/routes';

export default function RoleEdit({
    role,
    groups,
}: {
    role: RoleFormData;
    groups: PermissionGroup[];
}) {
    return (
        <>
            <Head title={`Edit ${role.name}`} />
            <PageHeader
                title={`Edit ${role.name}`}
                breadcrumbs={[
                    { label: 'Administration' },
                    { label: 'Roles', href: routes.roles.index },
                    { label: role.name },
                ]}
            />
            <div className="max-w-3xl">
                <RoleForm role={role} groups={groups} />
            </div>
        </>
    );
}
