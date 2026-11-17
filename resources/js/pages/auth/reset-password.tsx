import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function ResetPassword({ token, email }: { token: string; email: string }) {
    const form = useForm({ token, email, password: '', password_confirmation: '' });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/reset-password', {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };
    return (
        <>
            <Head title="Choose a new password" />
            <Card>
                <CardHeader>
                    <CardTitle>Choose a new password</CardTitle>
                    <CardDescription>
                        Use at least 12 characters with mixed case, a number and a symbol.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                        <Field id="email" label="Email" error={form.errors.email}>
                            {(aria) => (
                                <Input
                                    {...aria}
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    readOnly
                                    value={form.data.email}
                                />
                            )}
                        </Field>
                        <Field
                            id="password"
                            label="New password"
                            error={form.errors.password}
                            required
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
                            label="Confirm new password"
                            error={form.errors.password_confirmation}
                            required
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
                        {form.errors.token && (
                            <p role="alert" className="text-xs text-destructive">
                                {form.errors.token}
                            </p>
                        )}
                        <Button type="submit" loading={form.processing}>
                            Reset password
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
