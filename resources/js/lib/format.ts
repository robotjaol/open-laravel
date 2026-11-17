/** Format an ISO date string for display; returns an em dash for empty values. */
export function formatDate(value: string | null | undefined, withTime = false): string {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return new Intl.DateTimeFormat(undefined, {
        dateStyle: 'medium',
        ...(withTime ? { timeStyle: 'short' } : {}),
    }).format(date);
}

/** Relative time such as "3 minutes ago". */
export function timeAgo(value: string | null | undefined, now: Date = new Date()): string {
    if (!value) return '—';
    const seconds = Math.round((new Date(value).getTime() - now.getTime()) / 1000);
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ['year', 31_536_000],
        ['month', 2_592_000],
        ['day', 86_400],
        ['hour', 3_600],
        ['minute', 60],
    ];
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });
    for (const [unit, size] of units) {
        if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
    }
    return rtf.format(seconds, 'second');
}

export function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export function titleCase(value: string): string {
    return value.replace(/[._-]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
