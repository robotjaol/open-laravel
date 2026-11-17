import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const styles = {
    info: { box: 'bg-accent text-accent-foreground', icon: Info },
    success: { box: 'bg-success-soft text-success', icon: CheckCircle2 },
    warning: { box: 'bg-warning-soft text-warning', icon: TriangleAlert },
    danger: { box: 'bg-danger-soft text-destructive', icon: AlertCircle },
} as const;

export function Alert({
    variant = 'info',
    title,
    children,
    className,
}: {
    variant?: keyof typeof styles;
    title?: string;
    children?: React.ReactNode;
    className?: string;
}) {
    const { box, icon: Icon } = styles[variant];
    return (
        <div
            role={variant === 'danger' ? 'alert' : 'status'}
            className={cn('flex gap-3 rounded-control p-3 text-sm', box, className)}
        >
            <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div>
                {title && <p className="font-medium">{title}</p>}
                {children && <div className={title ? 'mt-0.5' : ''}>{children}</div>}
            </div>
        </div>
    );
}
