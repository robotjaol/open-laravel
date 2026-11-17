import { Link, usePage } from '@inertiajs/react';
import { Bell, Menu } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import { Brand } from '@/components/app/brand';
import { DesktopSidebar, SidebarNav } from '@/components/app/sidebar';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { UserMenu } from '@/components/app/user-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Tooltip } from '@/components/ui/tooltip';
import { routes } from '@/lib/routes';
import type { SharedProps } from '@/types';

const COLLAPSE_KEY = 'sidebar:collapsed';

function readCollapsed(): boolean {
    try {
        return localStorage.getItem(COLLAPSE_KEY) === '1';
    } catch {
        return false;
    }
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { flash, notifications } = usePage<SharedProps>().props;
    const [collapsed, setCollapsed] = React.useState(readCollapsed);
    const [mobileOpen, setMobileOpen] = React.useState(false);

    React.useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash?.success, flash?.error]);

    const toggle = () => {
        const next = !collapsed;
        setCollapsed(next);
        try {
            localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
        } catch {
            /* preference not persisted */
        }
    };

    return (
        <div className="flex min-h-svh">
            <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-(--z-toast) focus:rounded-control focus:bg-surface focus:px-3 focus:py-2 focus:shadow-overlay"
            >
                Skip to main content
            </a>
            <DesktopSidebar collapsed={collapsed} onToggle={toggle} />

            <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
                <DialogContent side="left" className="flex flex-col bg-sidebar p-0">
                    <DialogTitle className="sr-only">Navigation</DialogTitle>
                    <DialogDescription className="sr-only">
                        Primary navigation links
                    </DialogDescription>
                    <div className="flex h-14 items-center border-b px-4">
                        <Brand />
                    </div>
                    <SidebarNav onNavigate={() => setMobileOpen(false)} />
                </DialogContent>
            </Dialog>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-(--z-sticky) flex h-14 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur lg:px-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label="Open navigation"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu />
                    </Button>
                    <div className="ml-auto flex items-center gap-1">
                        <ThemeToggle />
                        <Tooltip label="Notifications">
                            <Button variant="ghost" size="icon" asChild className="relative">
                                <Link
                                    href={routes.notifications.index}
                                    aria-label={`Notifications${notifications.unread > 0 ? `, ${notifications.unread} unread` : ''}`}
                                >
                                    <Bell />
                                    {notifications.unread > 0 && (
                                        <span
                                            aria-hidden="true"
                                            className="absolute top-1 right-1 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-4 font-semibold text-destructive-foreground"
                                        >
                                            {notifications.unread > 9 ? '9+' : notifications.unread}
                                        </span>
                                    )}
                                </Link>
                            </Button>
                        </Tooltip>
                        <UserMenu />
                    </div>
                </header>
                <main
                    id="main"
                    tabIndex={-1}
                    className="mx-auto w-full max-w-7xl flex-1 p-4 outline-none lg:p-8"
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
