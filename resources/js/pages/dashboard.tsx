import { Head, Link } from '@inertiajs/react';
import { Activity, FolderKanban, ShieldCheck, ShieldAlert, UserCheck, Users } from 'lucide-react';
import { BarChart, type ChartPoint } from '@/components/app/bar-chart';
import { EmptyState } from '@/components/app/empty-state';
import { KpiCard } from '@/components/app/kpi-card';
import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCan } from '@/hooks/use-can';
import { timeAgo } from '@/lib/format';
import { routes } from '@/lib/routes';

interface Kpis {
    users_total: number;
    users_active: number;
    roles_total: number;
    logins_24h: number;
    failed_logins_24h: number;
}
interface RecentItem {
    id: number;
    description: string;
    user: string | null;
    created_at: string;
}
interface Props {
    kpis: Kpis | null;
    logins_chart: ChartPoint[];
    recent_activity: RecentItem[];
}

export default function Dashboard({ kpis, logins_chart, recent_activity }: Props) {
    const { can } = useCan();
    const actions = [
        { label: 'Add user', href: routes.users.create, show: can('users.create'), icon: Users },
        {
            label: 'Create role',
            href: routes.roles.create,
            show: can('roles.create'),
            icon: ShieldCheck,
        },
        {
            label: 'New project',
            href: routes.projects.create,
            show: can('projects.create'),
            icon: FolderKanban,
        },
    ].filter((a) => a.show);

    return (
        <>
            <Head title="Dashboard" />
            <PageHeader title="Dashboard" description="Workspace health and recent activity." />

            {kpis ? (
                <section
                    aria-label="Key metrics"
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    <KpiCard
                        label="Total users"
                        value={kpis.users_total}
                        hint={`${kpis.users_active} active`}
                        icon={Users}
                    />
                    <KpiCard
                        label="Active users"
                        value={kpis.users_active}
                        hint="Can sign in today"
                        icon={UserCheck}
                    />
                    <KpiCard
                        label="Sign-ins (24h)"
                        value={kpis.logins_24h}
                        hint="Successful"
                        icon={Activity}
                    />
                    <KpiCard
                        label="Failed sign-ins (24h)"
                        value={kpis.failed_logins_24h}
                        hint="Investigate spikes"
                        icon={ShieldAlert}
                    />
                </section>
            ) : null}

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {kpis && (
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Sign-ins, last 7 days</CardTitle>
                            <CardDescription>Successful sign-ins per day.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarChart
                                data={logins_chart}
                                title="Successful sign-ins per day, last 7 days"
                                valueLabel="sign-ins"
                            />
                        </CardContent>
                    </Card>
                )}
                <Card className={kpis ? '' : 'lg:col-span-3'}>
                    <CardHeader>
                        <CardTitle>Quick actions</CardTitle>
                        <CardDescription>Shortcuts based on your permissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        {actions.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No quick actions are available for your role.
                            </p>
                        ) : (
                            actions.map((a) => (
                                <Button
                                    key={a.href}
                                    variant="outline"
                                    asChild
                                    className="justify-start"
                                >
                                    <Link href={a.href}>
                                        <a.icon aria-hidden="true" />
                                        {a.label}
                                    </Link>
                                </Button>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {can('audit.view') && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Recent activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recent_activity.length === 0 ? (
                            <EmptyState
                                title="No activity yet"
                                description="Actions taken in the workspace appear here."
                            />
                        ) : (
                            <ul className="divide-y">
                                {recent_activity.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between gap-4 py-2.5"
                                    >
                                        <p className="min-w-0 truncate">
                                            <span className="font-medium">
                                                {item.user ?? 'System'}
                                            </span>{' '}
                                            <span className="text-muted-foreground">
                                                {item.description}
                                            </span>
                                        </p>
                                        <time
                                            dateTime={item.created_at}
                                            className="shrink-0 text-xs text-muted-foreground"
                                        >
                                            {timeAgo(item.created_at)}
                                        </time>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            )}
        </>
    );
}
