import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export const DialogContent = React.forwardRef<
    React.ComponentRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { side?: 'center' | 'left' }
>(({ className, children, side = 'center', ...props }, ref) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-(--z-overlay) bg-black/50" />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed z-(--z-modal) bg-surface text-surface-foreground shadow-overlay focus:outline-none',
                side === 'center' &&
                    'top-1/2 left-1/2 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-card border p-6',
                side === 'left' && 'inset-y-0 left-0 w-72 border-r',
                className,
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close
                className="absolute top-3 right-3 rounded-control p-1 text-muted-foreground hover:bg-muted"
                aria-label="Close dialog"
            >
                <X className="size-4" aria-hidden="true" />
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';
