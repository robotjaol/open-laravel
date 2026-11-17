import { cn } from '@/lib/utils';
import { initials } from '@/lib/format';

export function Avatar({ name, className }: { name: string; className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground',
                className,
            )}
        >
            {initials(name)}
        </span>
    );
}
