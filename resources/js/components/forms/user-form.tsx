import { Link, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input, Select } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/lib/routes';
import type { Option } from '@/types';

export interface UserFormData {
    id?: number;
    name: string;
    email: string;
    status: string;
    roles: string[];
}

export function UserForm({
    user,
    roles,
    statuses,
}: {
    user?: UserFormData;
    roles: Option[];
    statuses: Option[];
}) {
    const editing = Boolean(user?.id);
    const form = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        password_confirmation: '',
        status: user?.status ?? 'active',
        roles: user?.roles ?? [],
    });

    const toggleRole = (role: string, on: boolean) =>
        form.setData(
            'roles',
            on ? [...form.data.roles, role] : form.data.roles.filter((r) => r !== role),
        );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing && user?.id) form.put(routes.users.update(user.id));
        else form.post(routes.users.index);
    };

    return (
        <form onSubmit={submit} noValidate>
            <Card>
                <CardContent className="grid gap-4 pt-5 sm:grid-cols-2">
                    <Field id="name" label="Full name" error={form.errors.name} required>
                        {(aria) => (
                            <Input
                                {...aria}
                                name="name"
                                autoComplete="off"
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                        )}
                    </Field>
                    <Field id="email" label="Email" error={form.errors.email} required>
                        {(aria) => (
                            <Input
                                {...aria}
                                type="email"
                                name="email"
                                autoComplete="off"
                                value={form.data.email}
                                onChange={(e) => form.setData('email', e.target.value)}
                            />
                        )}
                    </Field>
                    <Field
                        id="password"
                        label={editing ? 'New password' : 'Password'}
                        error={form.errors.password}
                        required={!editing}
                        hint={editing ? 'Leave blank to keep the current password.' : undefined}
                    >
                        {(aria) => (
                            <Input
                                {...aria}
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                value={form.data.password}
                                onChange={(e) => form.setData('password', e.target.value)}
                            />
                        )}
                    </Field>
                    <Field
                        id="password_confirmation"
                        label="Confirm password"
                        error={form.errors.password_confirmation}
                        required={!editing}
                    >
                        {(aria) => (
                            <Input
                                {...aria}
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                value={form.data.password_confirmation}
                                onChange={(e) =>
                                    form.setData('password_confirmation', e.target.value)
                                }
                            />
                        )}
                    </Field>
                    <Field id="status" label="Account status" error={form.errors.status} required>
                        {(aria) => (
                            <Select
                                {...aria}
                                name="status"
                                value={form.data.status}
                                onChange={(e) => form.setData('status', e.target.value)}
                            >
                                {statuses.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </Select>
                        )}
                    </Field>
                    <fieldset className="sm:col-span-2">
                        <legend className="mb-2 text-sm font-medium">Roles</legend>
                        <div className="flex flex-wrap gap-x-6 gap-y-2">
                            {roles.map((r) => (
                                <div key={r.value} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`role-${r.value}`}
                                        checked={form.data.roles.includes(r.value)}
                                        onChange={(e) => toggleRole(r.value, e.target.checked)}
                                    />
                                    <Label htmlFor={`role-${r.value}`} className="font-normal">
                                        {r.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        {form.errors.roles && (
                            <p role="alert" className="mt-1 text-xs text-destructive">
                                {form.errors.roles}
                            </p>
                        )}
                    </fieldset>
                </CardContent>
            </Card>
            <div className="mt-4 flex gap-2">
                <Button type="submit" loading={form.processing}>
                    {editing ? 'Save changes' : 'Create user'}
                </Button>
                <Button variant="outline" asChild>
                    <Link href={routes.users.index}>Cancel</Link>
                </Button>
            </div>
        </form>
    );
}
