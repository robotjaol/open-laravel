import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/app/page-header';
import { ProjectForm } from '@/components/forms/project-form';
import { routes } from '@/lib/routes';
import type { Option } from '@/types';

export default function ProjectCreate({
    statuses,
    owners,
}: {
    statuses: Option[];
    owners: Option[];
}) {
    return (
        <>
            <Head title="New project" />
            <PageHeader
                title="New project"
                breadcrumbs={[
                    { label: 'Workspace' },
                    { label: 'Projects', href: routes.projects.index },
                    { label: 'New project' },
                ]}
            />
            <div className="max-w-3xl">
                <ProjectForm statuses={statuses} owners={owners} />
            </div>
        </>
    );
}
