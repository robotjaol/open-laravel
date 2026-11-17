import { Badge } from '@/components/ui/badge';

const variants: Record<string, 'success' | 'warning' | 'danger' | 'neutral' | 'primary'> = {
    active: 'success',
    inactive: 'neutral',
    suspended: 'danger',
    planned: 'neutral',
    on_hold: 'warning',
    completed: 'primary',
    archived: 'neutral',
};

export function StatusBadge({ status }: { status: string }) {
    return <Badge variant={variants[status] ?? 'neutral'}>{status.replace('_', ' ')}</Badge>;
}
