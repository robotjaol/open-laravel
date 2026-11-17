import { Head, Link, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { routes } from '@/lib/routes';

export default function Login({ status, canRegister }: { status?: string; canRegister: boolean }) {
    const form = useForm({ email: '', password: '', remember: false });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(routes.login, { onFinish: () => form.reset('password') });
    };

    return (
        <>
            <Head title="Sign in" />
            <Card>
                <CardHeader>
                    <CardTitle>Sign in</CardTitle>
                    <CardDescription>
                        Enter your credentials to access your workspace.
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
                        <Field id="password" label="Password" error={form.errors.password} required>
                            {(aria) => (
                                <Input
                                    {...aria}
                                    type="password"
                                    name="password"
                                    autoComplete="current-password"
                                    value={form.data.password}
                                    onChange={(e) => form.setData('password', e.target.value)}
                                />
                            )}
                        </Field>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="remember"
                                    checked={form.data.remember}
                                    onChange={(e) => form.setData('remember', e.target.checked)}
                                />
                                <Label htmlFor="remember" className="font-normal">
                                    Keep me signed in
                                </Label>
                            </div>
                            <Link
                                href={routes.forgotPassword}
                                className="text-sm text-primary hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Button type="submit" loading={form.processing}>
                            Sign in
                        </Button>
                    </form>
                    {canRegister && (
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            No account yet?{' '}
                            <Link href={routes.register} className="text-primary hover:underline">
                                Create an account
                            </Link>
                        </p>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
