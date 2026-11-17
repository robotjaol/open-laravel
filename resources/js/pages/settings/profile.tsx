import { Head, useForm, usePage } from '@inertiajs/react';
import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { formatDate } from '@/lib/format';
import { routes } from '@/lib/routes';

interface LoginRow {
    id: number;
    event: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
}
interface Props {
    profile: { name: string; email: string; email_verified_at: string | null };
    mustVerifyEmail: boolean;
    loginHistory: LoginRow[];
}

export default function Profile({ profile, mustVerifyEmail, loginHistory }: Props) {
    const form = useForm({ name: profile.name, email: profile.email });
    const verifyForm = useForm({});
    const { status } = usePage<{ status?: string }>().props as { status?: string };
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.patch(routes.settings.profile, { preserveScroll: true });
    };
    return (
        <>
            <Head title="Profile settings" />
            <div className="flex flex-col gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Your name and email address.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                            <Field id="name" label="Full name" error={form.errors.name} required>
                                {(aria) => (
                                    <Input
                                        {...aria}
                                        name="name"
                                        autoComplete="name"
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
                                        autoComplete="username"
                                        value={form.data.email}
                                        onChange={(e) => form.setData('email', e.target.value)}
                                    />
                                )}
                            </Field>
                            {mustVerifyEmail && !profile.email_verified_at && (
                                <Alert variant="warning" title="Email not verified">
                                    <Button
                                        type="button"
                                        variant="link"
                                        className="h-auto p-0"
                                        loading={verifyForm.processing}
                                        onClick={() =>
                                            verifyForm.post(routes.verifySend, {
                                                preserveScroll: true,
                                            })
                                        }
                                    >
                                        Resend verification email
                                    </Button>
                                    {status === 'verification-link-sent' && (
                                        <p className="mt-1">
                                            A new verification link has been sent.
                                        </p>
                                    )}
                                </Alert>
                            )}
                            <div>
                                <Button type="submit" loading={form.processing}>
                                    Save profile
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent sign-in activity</CardTitle>
                        <CardDescription>
                            Review sign-ins to your account. Contact an administrator if something
                            looks wrong.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loginHistory.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No sign-in activity recorded yet.
                            </p>
                        ) : (
                            <ul className="divide-y">
                                {loginHistory.map((l) => (
                                    <li
                                        key={l.id}
                                        className="flex flex-wrap items-center justify-between gap-2 py-2.5"
                                    >
                                        <div className="min-w-0">
                                            <p className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        l.event === 'login'
                                                            ? 'success'
                                                            : l.event === 'failed'
                                                              ? 'danger'
                                                              : 'neutral'
                                                    }
                                                >
                                                    {l.event}
                                                </Badge>
                                                <span className="font-mono text-xs">
                                                    {l.ip_address ?? 'unknown IP'}
                                                </span>
                                            </p>
                                            <p
                                                className="mt-0.5 max-w-md truncate text-xs text-muted-foreground"
                                                title={l.user_agent ?? ''}
                                            >
                                                {l.user_agent ?? 'Unknown device'}
                                            </p>
                                        </div>
                                        <time
                                            dateTime={l.created_at}
                                            className="text-xs text-muted-foreground"
                                        >
                                            {formatDate(l.created_at, true)}
                                        </time>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
