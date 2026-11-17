import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import * as React from 'react';

export interface Crumb {
    label: string;
    href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
    if (items.length === 0) return null;
    return (
        <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                {items.map((item, index) => {
                    const last = index === items.length - 1;
                    return (
                        <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                            {item.href && !last ? (
                                <Link
                                    href={item.href}
                                    className="rounded-sm hover:text-foreground hover:underline"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span
                                    aria-current={last ? 'page' : undefined}
                                    className={last ? 'text-foreground' : ''}
                                >
                                    {item.label}
                                </span>
                            )}
                            {!last && <ChevronRight className="size-3" aria-hidden="true" />}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: Crumb[];
    actions?: React.ReactNode;
}

export function PageHeader({ title, description, breadcrumbs = [], actions }: PageHeaderProps) {
    return (
        <header className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
        </header>
    );
}
