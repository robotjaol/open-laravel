import { Head } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import * as React from 'react';
import { DataTable, type Column } from '@/components/app/data-table';
import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { formatDate } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Option, Paginated, TableQuery } from '@/types';

interface LogRow {
    id: number;
    event: string;
    description: string;
    user: { id: number; name: string } | null;
    subject: string | null;
    ip_address: string | null;
    created_at: string;
    properties: Record<string, unknown> | null;
}

export default function ActivityIndex({
    logs,
    query,
    filters,
}: {
    logs: Paginated<LogRow>;
    query: TableQuery;
    filters: { events: Option[] };
}) {
    const [selected, setSelected] = React.useState<LogRow | null>(null);

    const columns: Column<LogRow>[] = [
        {
            key: 'created_at',
            header: 'When',
            sortable: true,
            required: true,
            cell: (l) => <time dateTime={l.created_at}>{formatDate(l.created_at, true)}</time>,
        },
        {
            key: 'event',
            header: 'Event',
            sortable: true,
            cell: (l) => <Badge variant="primary">{l.event}</Badge>,
        },
        { key: 'description', header: 'Description', cell: (l) => l.description },
        {
            key: 'user',
            header: 'Actor',
            cell: (l) => l.user?.name ?? <span className="text-muted-foreground">System</span>,
        },
        {
            key: 'ip_address',
            header: 'IP address',
            cell: (l) => <span className="font-mono text-xs">{l.ip_address ?? '—'}</span>,
        },
        {
            key: 'details',
            header: 'Details',
            required: true,
            className: 'w-16 text-right',
            cell: (l) => (
                <Tooltip label="View details">
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`View details for event ${l.id}`}
                        onClick={() => setSelected(l)}
                    >
                        <Eye />
                    </Button>
                </Tooltip>
            ),
        },
    ];

    return (
        <>
            <Head title="Activity logs" />
            <PageHeader
                title="Activity logs"
                description="Audit trail of sensitive actions. Secrets are never recorded."
                breadcrumbs={[{ label: 'Administration' }, { label: 'Activity logs' }]}
            />
            <DataTable
                path={routes.activity}
                columns={columns}
                rows={logs.data}
                meta={logs.meta}
                query={query}
                rowKey={(l) => l.id}
                storageKey="activity"
                searchLabel="Search activity by description"
                filters={[{ key: 'event', label: 'Event', options: filters.events }]}
                emptyTitle="No activity recorded"
                emptyDescription="Actions such as sign-ins and record changes will appear here."
            />
            <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
                <DialogContent className="max-w-xl">
                    <DialogTitle className="text-base font-semibold">{selected?.event}</DialogTitle>
                    <DialogDescription className="mt-1 text-sm text-muted-foreground">
                        {selected?.description}
                    </DialogDescription>
                    <dl className="mt-4 grid grid-cols-[7rem_1fr] gap-y-2 text-sm">
                        <dt className="text-muted-foreground">Actor</dt>
                        <dd>{selected?.user?.name ?? 'System'}</dd>
                        <dt className="text-muted-foreground">Subject</dt>
                        <dd>{selected?.subject ?? '—'}</dd>
                        <dt className="text-muted-foreground">IP address</dt>
                        <dd className="font-mono text-xs">{selected?.ip_address ?? '—'}</dd>
                        <dt className="text-muted-foreground">Time</dt>
                        <dd>{formatDate(selected?.created_at, true)}</dd>
                    </dl>
                    <CodeBlock label="Event properties" className="mt-4 max-h-60">
                        {JSON.stringify(selected?.properties ?? {}, null, 2)}
                    </CodeBlock>
                </DialogContent>
            </Dialog>
        </>
    );
}
