import { Head } from '@inertiajs/react';
import { ErrorView } from '@/components/app/error-view';

export default function PublicErrorPage({ status }: { status: number }) {
    return (
        <>
            <Head title={`Error ${status}`} />
            <ErrorView status={status} authenticated={false} />
        </>
    );
}
