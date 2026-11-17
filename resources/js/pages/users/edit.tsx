import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/app/page-header';
import { UserForm, type UserFormData } from '@/components/forms/user-form';
import { routes } from '@/lib/routes';
import type { Option } from '@/types';

export default function UserEdit({
    user,
    roles,
    statuses,
}: {
    user: UserFormData;
    roles: Option[];
    statuses: Option[];
}) {
    return (
        <>
            <Head title={`Edit ${user.name}`} />
            <PageHeader
                title={`Edit ${user.name}`}
                breadcrumbs={[
                    { label: 'Administration' },
                    { label: 'Users', href: routes.users.index },
                    { label: user.name },
                ]}
            />
            <div className="max-w-3xl">
                <UserForm user={user} roles={roles} statuses={statuses} />
            </div>
        </>
    );
}
