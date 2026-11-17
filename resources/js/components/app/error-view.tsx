import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/routes';

const copy: Record<number, { title: string; body: string }> = {
    403: {
        title: 'You do not have access',
        body: 'Your account lacks the permission needed for this page. Ask an administrator to grant it.',
    },
    404: {
        title: 'Page not found',
        body: 'The page may have moved, or the address may be mistyped.',
    },
    419: {
        title: 'Session expired',
        body: 'Your session timed out. Reload the page and try again.',
    },
    429: { title: 'Too many requests', body: 'Please wait a moment before trying again.' },
    500: {
        title: 'Something went wrong',
        body: 'The error has been logged. Try again, and contact support if it keeps happening.',
    },
    503: {
        title: 'Down for maintenance',
        body: 'The application is temporarily unavailable. Please check back shortly.',
    },
};

export function ErrorView({ status, authenticated }: { status: number; authenticated: boolean }) {
    const { title, body } = copy[status] ?? copy[500];
    return (
        <div
            className="flex flex-col items-center gap-3 py-16 text-center"
            data-testid="error-view"
        >
            <p className="text-sm font-semibold text-primary tabular">{status}</p>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <p className="max-w-md text-sm text-muted-foreground">{body}</p>
            <div className="mt-2 flex gap-2">
                <Button variant="outline" onClick={() => window.history.back()}>
                    Go back
                </Button>
                <Button asChild>
                    <Link href={authenticated ? routes.dashboard : routes.login}>
                        {authenticated ? 'Open dashboard' : 'Go to sign in'}
                    </Link>
                </Button>
            </div>
        </div>
    );
}
