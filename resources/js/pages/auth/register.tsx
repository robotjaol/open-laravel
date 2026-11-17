import { Head, Link, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { routes } from '@/lib/routes';

export default function Register() {
    const form = useForm({ name: '', email: '', password: '', password_confirmation: '' });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(routes.register, {
            onFinish: () => form.reset('password', 'password_confirmation'),
        });
    };
    return (
        <>
            <Head title="Create account" />
            <Card>
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Use at least 12 characters with mixed case, a number and a symbol.
                    </CardDescription>
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
                        <Field id="password" label="Password" error={form.errors.password} required>
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
                        <Button type="submit" loading={form.processing}>
                            Create account
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm text-muted-foreground">
                        Already registered?{' '}
                        <Link href={routes.login} className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </>
    );
}
