import { Link, usePage } from '@inertiajs/react';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Brand, BrandMark } from '@/components/app/brand';
import { Tooltip } from '@/components/ui/tooltip';
import { useCan } from '@/hooks/use-can';
import { isActive, visibleNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SidebarNavProps {
    collapsed?: boolean;
    onNavigate?: () => void;
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
    const { url } = usePage();
    const { can } = useCan();
    const groups = visibleNavigation(can);

    return (
        <nav aria-label="Primary" className="flex-1 overflow-y-auto px-2 py-3">
            {groups.map((group) => (
                <div key={group.label} className="mb-4">
                    <p
                        className={cn(
                            'mb-1 px-3 text-xs font-medium text-muted-foreground',
                            collapsed && 'sr-only',
                        )}
                    >
                        {group.label}
                    </p>
                    <ul className="flex flex-col gap-0.5">
                        {group.items.map((item) => {
                            const active = isActive(url, item.href);
                            const link = (
                                <Link
                                    href={item.href}
                                    onClick={onNavigate}
                                    aria-current={active ? 'page' : undefined}
                                    className={cn(
                                        'flex h-9 items-center gap-3 rounded-control px-3 text-sm font-medium transition-colors duration-(--duration-fast)',
                                        active
                                            ? 'bg-accent text-accent-foreground'
                                            : 'text-foreground hover:bg-muted',
                                        collapsed && 'justify-center px-0',
                                    )}
                                >
                                    <item.icon className="size-4 shrink-0" aria-hidden="true" />
                                    <span className={cn(collapsed && 'sr-only')}>{item.label}</span>
                                </Link>
                            );
                            return (
                                <li key={item.href}>
                                    {collapsed ? (
                                        <Tooltip label={item.label}>{link}</Tooltip>
                                    ) : (
                                        link
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
}

interface DesktopSidebarProps {
    collapsed: boolean;
    onToggle: () => void;
}

export function DesktopSidebar({ collapsed, onToggle }: DesktopSidebarProps) {
    const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
    return (
        <aside
            className={cn(
                'sticky top-0 z-(--z-sidebar) hidden h-svh shrink-0 flex-col border-r bg-sidebar transition-[width] duration-(--duration-base) ease-(--ease-standard) lg:flex',
                collapsed ? 'w-16' : 'w-64',
            )}
        >
            <div
                className={cn(
                    'flex h-14 items-center border-b px-4',
                    collapsed && 'justify-center px-0',
                )}
            >
                {collapsed ? <BrandMark /> : <Brand />}
            </div>
            <SidebarNav collapsed={collapsed} />
            <div className={cn('border-t p-2', collapsed && 'flex justify-center')}>
                <Tooltip label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                    <button
                        type="button"
                        onClick={onToggle}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-expanded={!collapsed}
                        className="inline-flex size-9 items-center justify-center rounded-control text-muted-foreground hover:bg-muted"
                    >
                        <Icon className="size-4" aria-hidden="true" />
                    </button>
                </Tooltip>
            </div>
        </aside>
    );
}
