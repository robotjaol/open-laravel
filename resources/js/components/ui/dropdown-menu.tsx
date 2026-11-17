import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { cn } from '@/lib/utils';

export const DropdownMenu = DropdownPrimitive.Root;
export const DropdownMenuTrigger = DropdownPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
    React.ComponentRef<typeof DropdownPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
    <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
            ref={ref}
            sideOffset={sideOffset}
            className={cn(
                'z-(--z-dropdown) min-w-48 rounded-card border bg-surface p-1 text-surface-foreground shadow-overlay',
                className,
            )}
            {...props}
        />
    </DropdownPrimitive.Portal>
));
DropdownMenuContent.displayName = 'DropdownMenuContent';

export const DropdownMenuItem = React.forwardRef<
    React.ComponentRef<typeof DropdownPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Item>
>(({ className, ...props }, ref) => (
    <DropdownPrimitive.Item
        ref={ref}
        className={cn(
            'flex cursor-default items-center gap-2 rounded-control px-2 py-1.5 text-sm outline-none select-none data-[disabled]:opacity-50 data-[highlighted]:bg-muted [&_svg]:size-4',
            className,
        )}
        {...props}
    />
));
DropdownMenuItem.displayName = 'DropdownMenuItem';

export const DropdownMenuCheckboxItem = React.forwardRef<
    React.ComponentRef<typeof DropdownPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof DropdownPrimitive.CheckboxItem>
>(({ className, children, ...props }, ref) => (
    <DropdownPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            'relative flex cursor-default items-center rounded-control py-1.5 pr-2 pl-8 text-sm outline-none select-none data-[highlighted]:bg-muted',
            className,
        )}
        {...props}
    >
        <span className="absolute left-2 flex size-4 items-center justify-center">
            <DropdownPrimitive.ItemIndicator>✓</DropdownPrimitive.ItemIndicator>
        </span>
        {children}
    </DropdownPrimitive.CheckboxItem>
));
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem';

export const DropdownMenuLabel = ({
    className,
    ...p
}: React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Label>) => (
    <DropdownPrimitive.Label
        className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', className)}
        {...p}
    />
);
export const DropdownMenuSeparator = ({
    className,
    ...p
}: React.ComponentPropsWithoutRef<typeof DropdownPrimitive.Separator>) => (
    <DropdownPrimitive.Separator className={cn('-mx-1 my-1 h-px bg-border', className)} {...p} />
);
