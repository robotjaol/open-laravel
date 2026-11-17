import { usePage } from '@inertiajs/react';
import type { SharedProps } from '@/types';

/** Permission helper backed by the server-shared permission list. UI hint only: the server enforces access. */
export function useCan() {
    const { auth } = usePage<SharedProps>().props;
    const set = new Set(auth.permissions);
    return {
        can: (permission: string) => set.has('*') || set.has(permission),
        canAny: (...permissions: string[]) => permissions.some((p) => set.has('*') || set.has(p)),
    };
}
