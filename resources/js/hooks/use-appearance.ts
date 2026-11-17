import { useCallback, useSyncExternalStore } from 'react';

export type Appearance = 'light' | 'dark' | 'system';
const KEY = 'appearance';
const listeners = new Set<() => void>();

function stored(): Appearance {
    try {
        const value = localStorage.getItem(KEY);
        return value === 'light' || value === 'dark' ? value : 'system';
    } catch {
        return 'system';
    }
}

export function applyAppearance(mode: Appearance): void {
    const dark =
        mode === 'dark' ||
        (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
}

export function initializeTheme(): void {
    applyAppearance(stored());
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (stored() === 'system') applyAppearance('system');
    });
}

function subscribe(cb: () => void): () => void {
    listeners.add(cb);
    return () => listeners.delete(cb);
}

export function useAppearance() {
    const appearance = useSyncExternalStore(subscribe, stored, () => 'system' as Appearance);
    const update = useCallback((mode: Appearance) => {
        try {
            if (mode === 'system') localStorage.removeItem(KEY);
            else localStorage.setItem(KEY, mode);
        } catch {
            /* storage unavailable: theme applies for this page view only */
        }
        applyAppearance(mode);
        listeners.forEach((l) => l());
    }, []);
    return { appearance, updateAppearance: update } as const;
}
