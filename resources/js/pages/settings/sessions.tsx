import { Head, useForm } from '@inertiajs/react';
import { Monitor } from 'lucide-react';
import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { timeAgo } from '@/lib/format';
import { routes } from '@/lib/routes';

interface SessionRow {
    id: string;
    ip_address: string | null;
    user_agent: string | null;
    last_active: string;
    current: boolean;
}

export default function Sessions({
    supported,
    sessions,
}: {
    supported: boolean;
    sessions: SessionRow[];
}) {
    const form = useForm({ password: '' });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.delete(routes.settings.sessions, {
            preserveScroll: true,
            onSuccess: () => form.reset(),
            onError: () => form.reset('password'),
        });
    };
    return (
        <>
            <Head title="Sessions" />
            <Card>
                <CardHeader>
                    <CardTitle>Browser sessions</CardTitle>
                    <CardDescription>
                        Where your account is signed in. Sign out anything you do not recognise.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {!supported ? (
                        <Alert variant="info">
                            Session listing needs the database session driver
                            (SESSION_DRIVER=database).
                        </Alert>
                    ) : (
                        <>
                            <ul className="divide-y">
                                {sessions.map((s) => (
                                    <li key={s.id} className="flex items-center gap-3 py-3">
                                        <Monitor
                                            className="size-5 shrink-0 text-muted-foreground"
                                            aria-hidden="true"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p
                                                className="truncate text-sm"
                                                title={s.user_agent ?? ''}
                                            >
                                                {s.user_agent ?? 'Unknown device'}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-mono">
                                                    {s.ip_address ?? 'unknown IP'}
                                                </span>{' '}
                                                ·{' '}
                                                {s.current
                                                    ? 'This device'
                                                    : `Active ${timeAgo(s.last_active)}`}
                                            </p>
                                        </div>
                                        {s.current && <Badge variant="success">Current</Badge>}
                                    </li>
                                ))}
                            </ul>
                            {sessions.length > 1 && (
                                <form
                                    onSubmit={submit}
                                    className="flex flex-col gap-3 border-t pt-4"
                                    noValidate
                                >
                                    <Field
                                        id="password"
                                        label="Confirm your password to sign out other sessions"
                                        error={form.errors.password}
                                    >
                                        {(aria) => (
                                            <Input
                                                {...aria}
                                                type="password"
                                                name="password"
                                                autoComplete="current-password"
                                                value={form.data.password}
                                                onChange={(e) =>
                                                    form.setData('password', e.target.value)
                                                }
                                            />
                                        )}
                                    </Field>
                                    <div>
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            loading={form.processing}
                                        >
                                            Sign out other sessions
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
