import { describe, expect, it } from 'vitest';
import { formatDate, initials, timeAgo, titleCase } from '@/lib/format';
import { isActive, visibleNavigation } from '@/lib/navigation';

describe('format helpers', () => {
    it('returns an em dash for empty or invalid dates', () => {
        expect(formatDate(null)).toBe('—');
        expect(formatDate('not-a-date')).toBe('—');
    });

    it('formats a valid date', () => {
        expect(formatDate('2026-03-17T10:00:00Z')).toMatch(/2026/);
    });

    it('builds relative times from a fixed clock', () => {
        const now = new Date('2026-11-17T12:00:00Z');
        expect(timeAgo('2026-11-17T11:55:00Z', now)).toBe('5 minutes ago');
        expect(timeAgo('2026-11-15T12:00:00Z', now)).toBe('2 days ago');
        expect(timeAgo(null, now)).toBe('—');
    });

    it('derives initials and title case', () => {
        expect(initials('ada lovelace byron')).toBe('AL');
        expect(initials('')).toBe('');
        expect(titleCase('users.create')).toBe('Users Create');
    });
});

describe('navigation', () => {
    it('hides items the user lacks permission for and drops empty groups', () => {
        const groups = visibleNavigation(() => false);
        const labels = groups.flatMap((g) => g.items.map((i) => i.label));
        expect(labels).toEqual(['Dashboard', 'Settings']);
        expect(groups.map((g) => g.label)).not.toContain('Administration');
    });

    it('shows administration items when permitted', () => {
        const labels = visibleNavigation((p) => p === 'users.view').flatMap((g) =>
            g.items.map((i) => i.label),
        );
        expect(labels).toContain('Users');
        expect(labels).not.toContain('Roles');
    });

    it('matches active routes by prefix without false positives', () => {
        expect(isActive('/users/3/edit', '/users')).toBe(true);
        expect(isActive('/users-archive', '/users')).toBe(false);
        expect(isActive('/settings/password', '/settings/profile')).toBe(true);
    });
});
