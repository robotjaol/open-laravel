import { Link, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/lib/routes';

export interface PermissionGroup {
    key: string;
    label: string;
    permissions: { name: string; label: string }[];
}
export interface RoleFormData {
    id?: number;
    name: string;
    permissions: string[];
    is_locked?: boolean;
}

export function RoleForm({ role, groups }: { role?: RoleFormData; groups: PermissionGroup[] }) {
    const editing = Boolean(role?.id);
    const form = useForm({ name: role?.name ?? '', permissions: role?.permissions ?? [] });
    const locked = role?.is_locked ?? false;

    const toggle = (name: string, on: boolean) =>
        form.setData(
            'permissions',
            on ? [...form.data.permissions, name] : form.data.permissions.filter((p) => p !== name),
        );

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing && role?.id) form.put(routes.roles.update(role.id));
        else form.post(routes.roles.index);
    };

    return (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <Card>
                <CardContent className="pt-5">
                    <Field
                        id="name"
                        label="Role name"
                        error={form.errors.name}
                        required
                        hint={locked ? 'System roles cannot be renamed.' : undefined}
                    >
                        {(aria) => (
                            <Input
                                {...aria}
                                name="name"
                                disabled={locked}
                                value={form.data.name}
                                onChange={(e) => form.setData('name', e.target.value)}
                            />
                        )}
                    </Field>
                </CardContent>
            </Card>
            {groups.map((group) => (
                <Card key={group.key}>
                    <CardHeader>
                        <CardTitle>{group.label}</CardTitle>
                        <CardDescription>{`${group.permissions.filter((p) => form.data.permissions.includes(p.name)).length} of ${group.permissions.length} granted`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 sm:grid-cols-2">
                            {group.permissions.map((p) => (
                                <div key={p.name} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`perm-${p.name}`}
                                        disabled={locked}
                                        checked={form.data.permissions.includes(p.name)}
                                        onChange={(e) => toggle(p.name, e.target.checked)}
                                    />
                                    <Label htmlFor={`perm-${p.name}`} className="font-normal">
                                        {p.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
            {form.errors.permissions && (
                <p role="alert" className="text-xs text-destructive">
                    {form.errors.permissions}
                </p>
            )}
            <div className="flex gap-2">
                {!locked && (
                    <Button type="submit" loading={form.processing}>
                        {editing ? 'Save changes' : 'Create role'}
                    </Button>
                )}
                <Button variant="outline" asChild>
                    <Link href={routes.roles.index}>{locked ? 'Back to roles' : 'Cancel'}</Link>
                </Button>
            </div>
        </form>
    );
}
