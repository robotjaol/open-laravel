import { Head, Link, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { routes } from '@/lib/routes';

export default function ForgotPassword({ status }: { status?: string }) {
    const form = useForm({ email: '' });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(routes.forgotPassword);
    };
    return (
        <>
            <Head title="Forgot password" />
            <Card>
                <CardHeader>
                    <CardTitle>Reset your password</CardTitle>
                    <CardDescription>
                        We will email you a link to choose a new password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status && (
                        <Alert variant="success" className="mb-4">
                            {status}
                        </Alert>
                    )}
                    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
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
                        <Button type="submit" loading={form.processing}>
                            Email reset link
                        </Button>
                    </form>
                    <p className="mt-4 text-center text-sm">
                        <Link href={routes.login} className="text-primary hover:underline">
                            Back to sign in
                        </Link>
                    </p>
                </CardContent>
            </Card>
        </>
    );
}
