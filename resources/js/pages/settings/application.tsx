import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input, Select } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/lib/routes';
import type { Option } from '@/types';

interface AppSettings {
    app_name: string;
    timezone: string;
    locale: string;
    registration_enabled: boolean;
    audit_retention_days: number;
}

export default function ApplicationSettings({
    settings,
    timezones,
    locales,
    canUpdate,
}: {
    settings: AppSettings;
    timezones: Option[];
    locales: Option[];
    canUpdate: boolean;
}) {
    const form = useForm<AppSettings>({ ...settings });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(routes.settings.application, { preserveScroll: true });
    };
    return (
        <>
            <Head title="Application settings" />
            <form onSubmit={submit} noValidate>
                <Card>
                    <CardHeader>
                        <CardTitle>Application</CardTitle>
                        <CardDescription>
                            {canUpdate
                                ? 'Values saved here override environment defaults.'
                                : 'You can view these settings but not change them.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Field
                            id="app_name"
                            label="Application name"
                            error={form.errors.app_name}
                            required
                        >
                            {(aria) => (
                                <Input
                                    {...aria}
                                    disabled={!canUpdate}
                                    value={form.data.app_name}
                                    onChange={(e) => form.setData('app_name', e.target.value)}
                                />
                            )}
                        </Field>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Field
                                id="timezone"
                                label="Timezone"
                                error={form.errors.timezone}
                                required
                            >
                                {(aria) => (
                                    <Select
                                        {...aria}
                                        disabled={!canUpdate}
                                        value={form.data.timezone}
                                        onChange={(e) => form.setData('timezone', e.target.value)}
                                    >
                                        {timezones.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>
                            <Field id="locale" label="Language" error={form.errors.locale} required>
                                {(aria) => (
                                    <Select
                                        {...aria}
                                        disabled={!canUpdate}
                                        value={form.data.locale}
                                        onChange={(e) => form.setData('locale', e.target.value)}
                                    >
                                        {locales.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </Select>
                                )}
                            </Field>
                        </div>
                        <Field
                            id="audit_retention_days"
                            label="Audit log retention (days)"
                            error={form.errors.audit_retention_days}
                            required
                            hint="Older entries are pruned daily. Minimum 30 days."
                        >
                            {(aria) => (
                                <Input
                                    {...aria}
                                    type="number"
                                    min={30}
                                    max={3650}
                                    disabled={!canUpdate}
                                    value={form.data.audit_retention_days}
                                    onChange={(e) =>
                                        form.setData('audit_retention_days', Number(e.target.value))
                                    }
                                />
                            )}
                        </Field>
                        <div className="flex items-center justify-between gap-4 rounded-control border p-3">
                            <div>
                                <Label id="registration-label">Allow public registration</Label>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    When off, only administrators can create accounts.
                                </p>
                            </div>
                            <Switch
                                aria-labelledby="registration-label"
                                disabled={!canUpdate}
                                checked={form.data.registration_enabled}
                                onCheckedChange={(v) => form.setData('registration_enabled', v)}
                            />
                        </div>
                    </CardContent>
                </Card>
                {canUpdate && (
                    <div className="mt-4">
                        <Button type="submit" loading={form.processing}>
                            Save settings
                        </Button>
                    </div>
                )}
            </form>
        </>
    );
}
