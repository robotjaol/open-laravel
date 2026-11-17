import { Link, usePage } from '@inertiajs/react';
import { routes } from '@/lib/routes';
import type { SharedProps } from '@/types';

export function BrandMark({ className = 'size-8' }: { className?: string }) {
    return (
        <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="var(--primary)" />
            <path
                d="M9 22V10h6.5a4.5 4.5 0 0 1 0 9H13"
                fill="none"
                stroke="var(--primary-foreground)"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="22" cy="22" r="2" fill="var(--primary-foreground)" />
        </svg>
    );
}

export function Brand() {
    const { name } = usePage<SharedProps>().props;
    return (
        <Link
            href={routes.dashboard}
            className="flex items-center gap-2 rounded-control font-semibold"
        >
            <BrandMark />
            <span className="truncate text-base">{name}</span>
        </Link>
    );
}
