import { Head } from '@inertiajs/react';
import { PageHeader } from '@/components/app/page-header';
import { ProjectForm, type ProjectFormData } from '@/components/forms/project-form';
import { routes } from '@/lib/routes';
import type { Option } from '@/types';

export default function ProjectEdit({
    project,
    statuses,
    owners,
}: {
    project: ProjectFormData;
    statuses: Option[];
    owners: Option[];
}) {
    return (
        <>
            <Head title={`Edit ${project.name}`} />
            <PageHeader
                title={`Edit ${project.name}`}
                breadcrumbs={[
                    { label: 'Workspace' },
                    { label: 'Projects', href: routes.projects.index },
                    { label: project.name },
                ]}
            />
            <div className="max-w-3xl">
                <ProjectForm project={project} statuses={statuses} owners={owners} />
            </div>
        </>
    );
}
