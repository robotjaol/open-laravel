import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/app/page-header';
import { UserForm } from '@/components/forms/user-form';
import { routes } from '@/lib/routes';
import type { Option } from '@/types';

export default function UserCreate({ roles, statuses }: { roles: Option[]; statuses: Option[] }) {
    return (
        <>
            <Head title="Add user" />
            <PageHeader
                title="Add user"
                breadcrumbs={[
                    { label: 'Administration' },
                    { label: 'Users', href: routes.users.index },
                    { label: 'Add user' },
                ]}
            />
            <div className="max-w-3xl">
                <UserForm roles={roles} statuses={statuses} />
            </div>
        </>
    );
}
