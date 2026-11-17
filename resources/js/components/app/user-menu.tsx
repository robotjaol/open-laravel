import { Link, router, usePage } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { routes } from '@/lib/routes';
import type { SharedProps } from '@/types';

export function UserMenu() {
    const { auth } = usePage<SharedProps>().props;
    const user = auth.user;
    if (!user) return null;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                aria-label="Open user menu"
                className="flex items-center gap-2 rounded-full p-0.5 hover:bg-muted"
            >
                <Avatar name={user.name} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{user.name}</span>
                    <span className="font-normal">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={routes.settings.profile}>
                        <Settings aria-hidden="true" />
                        Account settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => router.post(routes.logout)}>
                    <LogOut aria-hidden="true" />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
