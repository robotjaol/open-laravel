import { Link, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input, Select, Textarea } from '@/components/ui/input';
import { routes } from '@/lib/routes';
import type { Option } from '@/types';

export interface ProjectFormData {
    id?: number;
    code: string;
    name: string;
    description: string | null;
    status: string;
    owner_id: number | null;
    starts_on: string | null;
    due_on: string | null;
}

export function ProjectForm({
    project,
    statuses,
    owners,
}: {
    project?: ProjectFormData;
    statuses: Option[];
    owners: Option[];
}) {
    const editing = Boolean(project?.id);
    const form = useForm({
        code: project?.code ?? '',
        name: project?.name ?? '',
        description: project?.description ?? '',
        status: project?.status ?? 'planned',
        owner_id: project?.owner_id ? String(project.owner_id) : '',
        starts_on: project?.starts_on ?? '',
        due_on: project?.due_on ?? '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing && project?.id) form.put(routes.projects.update(project.id));
        else form.post(routes.projects.index);
    };
    const bind = (key: keyof typeof form.data) => ({
        name: key,
        value: form.data[key],
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
        ) => form.setData(key, e.target.value),
    });

    return (
        <form onSubmit={submit} noValidate>
            <Card>
                <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                    <Field
                        id="code"
                        label="Code"
                        error={form.errors.code}
                        required
                        hint="Unique identifier, e.g. PRJ-001."
                    >
                        {(aria) => <Input {...aria} {...bind('code')} />}
                    </Field>
                    <Field id="name" label="Name" error={form.errors.name} required>
                        {(aria) => <Input {...aria} {...bind('name')} />}
                    </Field>
                    <Field id="status" label="Status" error={form.errors.status} required>
                        {(aria) => (
                            <Select {...aria} {...bind('status')}>
                                {statuses.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </Field>
                    <Field id="owner_id" label="Owner" error={form.errors.owner_id}>
                        {(aria) => (
                            <Select {...aria} {...bind('owner_id')}>
                                <option value="">Unassigned</option>
                                {owners.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </Field>
                    <Field id="starts_on" label="Start date" error={form.errors.starts_on}>
                        {(aria) => <Input {...aria} type="date" {...bind('starts_on')} />}
                    </Field>
                    <Field id="due_on" label="Due date" error={form.errors.due_on}>
                        {(aria) => <Input {...aria} type="date" {...bind('due_on')} />}
                    </Field>
                    <Field
                        id="description"
                        label="Description"
                        error={form.errors.description}
                        className="sm:col-span-2"
                    >
                        {(aria) => <Textarea {...aria} {...bind('description')} />}
                    </Field>
                </CardContent>
            </Card>
            <div className="mt-4 flex gap-2">
                <Button type="submit" loading={form.processing}>
                    {editing ? 'Save changes' : 'Create project'}
                </Button>
                <Button variant="outline" asChild>
                    <Link href={routes.projects.index}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
