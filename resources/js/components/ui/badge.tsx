import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
    {
        variants: {
            variant: {
                neutral: 'bg-muted text-foreground',
                primary: 'bg-accent text-accent-foreground',
                success: 'bg-success-soft text-success',
                warning: 'bg-warning-soft text-warning',
                danger: 'bg-danger-soft text-destructive',
            },
        },
        defaultVariants: { variant: 'neutral' },
    },
);

export function Badge({
    className,
    variant,
    ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
    return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
