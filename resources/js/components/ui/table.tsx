import * as React from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
    return (
        <div className="relative w-full overflow-x-auto">
            <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
        </div>
    );
}
export const TableHeader = (p: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className={cn('border-b bg-muted/50', p.className)} {...p} />
);
export const TableBody = (p: React.HTMLAttributes<HTMLTableSectionElement>) => <tbody {...p} />;
export const TableRow = ({ className, ...p }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr
        className={cn('border-b transition-colors last:border-0 hover:bg-muted/40', className)}
        {...p}
    />
);
export const TableHead = ({ className, ...p }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
        scope="col"
        className={cn(
            'h-10 px-4 text-left align-middle text-xs font-medium text-muted-foreground',
            className,
        )}
        {...p}
    />
);
export const TableCell = ({ className, ...p }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td className={cn('px-4 py-3 align-middle', className)} {...p} />
);
