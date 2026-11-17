import { Link, usePage } from '@inertiajs/react';
import * as React from 'react';
import { PageHeader } from '@/components/app/page-header';
import { useCan } from '@/hooks/use-can';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const { url } = usePage();
    const { can } = useCan();
    const tabs = [
        { label: 'Profile', href: routes.settings.profile },
        { label: 'Password', href: routes.settings.password },
        { label: 'Sessions', href: routes.settings.sessions },
        ...(can('settings.view')
            ? [{ label: 'Application', href: routes.settings.application }]
            : []),
    ];
    return (
        <>
            <PageHeader
                title="Settings"
                description="Manage your account and application preferences."
            />
            <nav aria-label="Settings" className="mb-6 flex gap-1 overflow-x-auto border-b">
                {tabs.map((tab) => {
                    const active = url.split('?')[0] === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                '-mb-px border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap',
                                active
                                    ? 'border-primary text-foreground'
                                    : 'border-transparent text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="max-w-2xl">{children}</div>
        </>
    );
}
