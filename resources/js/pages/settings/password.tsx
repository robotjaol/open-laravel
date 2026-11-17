import { Head, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { routes } from '@/lib/routes';

export default function PasswordSettings() {
    const form = useForm({ current_password: '', password: '', password_confirmation: '' });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(routes.settings.password, { preserveScroll: true, onSuccess: () => form.reset() });
    };
    return (
        <>
            <Head title="Password settings" />
            <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                    <CardDescription>
                        Other browser sessions are signed out when you change your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                        <Field
                            id="current_password"
                            label="Current password"
                            error={form.errors.current_password}
                            required
                        >
                            {(aria) => (
                                <Input
                                    {...aria}
                                    type="password"
                                    name="current_password"
                                    autoComplete="current-password"
                                    value={form.data.current_password}
                                    onChange={(e) =>
                                        form.setData('current_password', e.target.value)
                                    }
                                />
                            )}
                        </Field>
                        <Field
                            id="password"
                            label="New password"
                            error={form.errors.password}
                            required
                            hint="At least 12 characters with mixed case, a number and a symbol."
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
                        <div>
                            <Button type="submit" loading={form.processing}>
                                Update password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}
