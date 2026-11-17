import {
    Activity,
    BookOpenText,
    FolderKanban,
    KeyRound,
    LayoutDashboard,
    Settings,
    ShieldCheck,
    Users,
    type LucideIcon,
} from 'lucide-react';
import { routes } from '@/lib/routes';

export interface NavItem {
    label: string;
    href: string;
    icon: LucideIcon;
    /** Permission required to see this item. Omit for always visible. */
    permission?: string;
}

export interface NavGroup {
    label: string;
    items: NavItem[];
}

export const navigation: NavGroup[] = [
    {
        label: 'Overview',
        items: [{ label: 'Dashboard', href: routes.dashboard, icon: LayoutDashboard }],
    },
    {
        label: 'Workspace',
        items: [
            {
                label: 'Projects',
                href: routes.projects.index,
                icon: FolderKanban,
                permission: 'projects.view',
            },
        ],
    },
    {
        label: 'Administration',
        items: [
            { label: 'Users', href: routes.users.index, icon: Users, permission: 'users.view' },
            {
                label: 'Roles',
                href: routes.roles.index,
                icon: ShieldCheck,
                permission: 'roles.view',
            },
            {
                label: 'Permissions',
                href: routes.permissions.index,
                icon: KeyRound,
                permission: 'permissions.view',
            },
            {
                label: 'Activity logs',
                href: routes.activity,
                icon: Activity,
                permission: 'audit.view',
            },
        ],
    },
    {
        label: 'System',
        items: [
            { label: 'API overview', href: routes.api, icon: BookOpenText, permission: 'api.view' },
            { label: 'Settings', href: routes.settings.profile, icon: Settings },
        ],
    },
];

/** Keep only the items the current user may see, dropping empty groups. */
export function visibleNavigation(can: (permission: string) => boolean): NavGroup[] {
    return navigation
        .map((group) => ({
            ...group,
            items: group.items.filter((item) => !item.permission || can(item.permission)),
        }))
        .filter((group) => group.items.length > 0);
}

export function isActive(currentUrl: string, href: string): boolean {
    const path = currentUrl.split('?')[0];
    if (href === routes.settings.profile) return path.startsWith('/settings');
    return path === href || path.startsWith(`${href}/`);
}
