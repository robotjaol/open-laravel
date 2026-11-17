/* eslint-disable jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be keyboard reachable (WCAG 2.1.1) */
import { cn } from '@/lib/utils';

/** Scrollable preformatted text. Focusable so keyboard users can scroll it. */
export function CodeBlock({
    children,
    label,
    className,
}: {
    children: string;
    label: string;
    className?: string;
}) {
    return (
        <pre
            tabIndex={0}
            aria-label={label}
            className={cn(
                'overflow-auto rounded-control bg-muted p-3 font-mono text-xs',
                className,
            )}
        >
            {children}
        </pre>
    );
}
