import * as React from 'react';
import { cn } from '@/lib/utils';

export const Checkbox = React.forwardRef<
    HTMLInputElement,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>
>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        type="checkbox"
        className={cn(
            'size-4 shrink-0 rounded-sm border-input accent-primary disabled:opacity-50',
            className,
        )}
        {...props}
    />
));
Checkbox.displayName = 'Checkbox';

interface SwitchProps {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    id?: string;
    disabled?: boolean;
    'aria-label'?: string;
    'aria-labelledby'?: string;
}

/** Accessible toggle switch (role="switch") using a native button. */
export function Switch({ checked, onCheckedChange, ...props }: SwitchProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent transition-colors duration-(--duration-fast) disabled:cursor-not-allowed disabled:opacity-50',
                checked ? 'bg-primary' : 'bg-input',
            )}
            {...props}
        >
            <span
                className={cn(
                    'pointer-events-none block size-4 rounded-full bg-surface shadow transition-transform duration-(--duration-fast)',
                    checked ? 'translate-x-4' : 'translate-x-0.5',
                )}
            />
        </button>
    );
}
