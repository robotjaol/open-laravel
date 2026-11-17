import * as React from 'react';
import { Card } from '@/components/ui/card';

export function KpiCard({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label: string;
    value: string | number;
    hint?: string;
    icon: React.ComponentType<{ className?: string }>;
}) {
    return (
        <Card className="p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight tabular">{value}</p>
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </Card>
    );
}
