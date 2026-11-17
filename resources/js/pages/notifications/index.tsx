import { Head, router } from '@inertiajs/react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { EmptyState } from '@/components/app/empty-state';
import { PageHeader } from '@/components/app/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tooltip } from '@/components/ui/tooltip';
import { timeAgo } from '@/lib/format';
import { routes } from '@/lib/routes';
import type { Paginated } from '@/types';

interface Item {
    id: string;
    title: string;
    body: string;
    read_at: string | null;
    created_at: string;
}

export default function NotificationsIndex({
    notifications,
    unread,
}: {
    notifications: Paginated<Item>;
    unread: number;
}) {
    const { meta } = notifications;
    const go = (page: number) =>
        router.get(routes.notifications.index, { page }, { preserveScroll: true });
    return (
        <>
            <Head title="Notifications" />
            <PageHeader
                title="Notifications"
                description={unread > 0 ? `${unread} unread` : 'You are all caught up.'}
                actions={
                    unread > 0 ? (
                        <Button
                            variant="outline"
                            onClick={() =>
                                router.post(
                                    routes.notifications.readAll,
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                        >
                            <Check />
                            Mark all as read
                        </Button>
                    ) : undefined
                }
            />
            <Card>
                {notifications.data.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="No notifications"
                        description="Account and system messages will appear here."
                    />
                ) : (
                    <ul className="divide-y">
                        {notifications.data.map((n) => (
                            <li key={n.id} className="flex items-start justify-between gap-4 p-4">
                                <div className="min-w-0">
                                    <p className="flex items-center gap-2 font-medium">
                                        {n.title}
                                        {!n.read_at && <Badge variant="primary">New</Badge>}
                                    </p>
                                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                                    <time
                                        dateTime={n.created_at}
                                        className="mt-1 block text-xs text-muted-foreground"
                                    >
                                        {timeAgo(n.created_at)}
                                    </time>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                    {!n.read_at && (
                                        <Tooltip label="Mark as read">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Mark ${n.title} as read`}
                                                onClick={() =>
                                                    router.post(
                                                        routes.notifications.read(n.id),
                                                        {},
                                                        { preserveScroll: true },
                                                    )
                                                }
                                            >
                                                <Check />
                                            </Button>
                                        </Tooltip>
                                    )}
                                    <Tooltip label="Delete notification">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label={`Delete ${n.title}`}
                                            onClick={() =>
                                                router.delete(routes.notifications.destroy(n.id), {
                                                    preserveScroll: true,
                                                })
                                            }
                                        >
                                            <Trash2 />
                                        </Button>
                                    </Tooltip>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </Card>
            {meta.last_page > 1 && (
                <div className="mt-4 flex items-center justify-end gap-2 text-sm text-muted-foreground">
                    <span className="tabular">
                        Page {meta.current_page} of {meta.last_page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={meta.current_page <= 1}
                        onClick={() => go(meta.current_page - 1)}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={meta.current_page >= meta.last_page}
                        onClick={() => go(meta.current_page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </>
    );
}
