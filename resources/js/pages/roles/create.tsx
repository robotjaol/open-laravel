import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/app/page-header';
import { RoleForm, type PermissionGroup } from '@/components/forms/role-form';
import { routes } from '@/lib/routes';

export default function RoleCreate({ groups }: { groups: PermissionGroup[] }) {
    return (
        <>
            <Head title="Create role" />
            <PageHeader
                title="Create role"
                breadcrumbs={[
                    { label: 'Administration' },
                    { label: 'Roles', href: routes.roles.index },
                    { label: 'Create role' },
                ]}
            />
            <div className="max-w-3xl">
                <RoleForm groups={groups} />
            </div>
        </>
    );
}
