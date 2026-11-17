import * as React from 'react';

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
            {Icon && (
                <span className="mb-1 flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Icon className="size-5" />
                </span>
            )}
            <h3 className="text-sm font-semibold">{title}</h3>
            {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
