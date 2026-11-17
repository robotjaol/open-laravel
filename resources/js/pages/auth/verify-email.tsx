import { Head, router, useForm } from '@inertiajs/react';
import * as React from 'react';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { routes } from '@/lib/routes';

export default function VerifyEmail({ status }: { status?: string }) {
    const form = useForm({});
    const resend = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(routes.verifySend);
    };
    return (
        <>
            <Head title="Verify email" />
            <Card>
                <CardHeader>
                    <CardTitle>Verify your email</CardTitle>
                    <CardDescription>
                        Follow the link we emailed you to activate your account.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    {status && <Alert variant="success">{status}</Alert>}
                    <form onSubmit={resend}>
                        <Button type="submit" loading={form.processing} className="w-full">
                            Resend verification email
                        </Button>
                    </form>
                    <Button variant="ghost" onClick={() => router.post(routes.logout)}>
                        Sign out
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
