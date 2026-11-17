import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import * as React from 'react';

export const TooltipProvider = TooltipPrimitive.Provider;

/** Wraps a single focusable child with a tooltip label. Icon-only controls must use this. */
export function Tooltip({ label, children }: { label: string; children: React.ReactElement }) {
    return (
        <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    sideOffset={6}
                    className="z-(--z-dropdown) rounded-control bg-foreground px-2 py-1 text-xs text-background shadow-overlay"
                >
                    {label}
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}
