import '../css/app.css';
import { createInertiaApp, http } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings-layout';
import { pageFor } from '@/preview/fixtures';

/*
 * Static preview entry. It renders the real pages and layouts, but replaces the network layer with
 * an in-memory "server" backed by sample data, so the UI can be browsed without PHP or a database.
 * Changes are never saved. The current route is kept in the ?p= query so reloads and shared links work.
 */
const appName = 'Open Laravel';
const baseUrl = location.pathname;

const routeOf = (url: string): string => {
    const u = new URL(url, location.origin);
    return u.pathname.startsWith(baseUrl) && baseUrl !== '/' && u.pathname !== baseUrl
        ? u.pathname.slice(baseUrl.length - 1) + u.search
        : u.pathname + u.search;
};
const asUrl = (route: string) => `${baseUrl}?p=${encodeURIComponent(route)}`;
const requestedRoute = () => new URLSearchParams(location.search).get('p') ?? '/dashboard';

let current = requestedRoute();

http.setClient({
    request: async (config) => {
        const isGet = config.method.toLowerCase() === 'get';
        let route = routeOf(config.url);
        let flash: string | undefined;

        if (!isGet) {
            // Mutations are acknowledged but not stored. Sign-in and sign-out move between areas.
            if (route === '/login' || route === '/register') route = '/dashboard';
            else if (route === '/logout') route = '/login';
            else {
                route = current;
                flash = 'Preview mode: changes are not saved.';
            }
        }
        current = route;

        const page = { ...pageFor(route, flash), url: asUrl(route), version: 'preview' };
        return {
            status: 200,
            data: JSON.stringify(page),
            headers: { 'x-inertia': 'true', 'content-type': 'application/json' },
        };
    },
});

void createInertiaApp({
    page: { ...pageFor(current), url: asUrl(current), version: 'preview' } as never,
    title: (title) => (title ? `${title} - ${appName} preview` : `${appName} preview`),
    layout: (name) => {
        if (name.startsWith('auth/') || name === 'errors/public') return AuthLayout;
        if (name.startsWith('settings/')) return [AppLayout, SettingsLayout];
        return AppLayout;
    },
    withApp(app) {
        return (
            <TooltipProvider delayDuration={200}>
                {app}
                <Toaster />
                <div
                    role="note"
                    className="pointer-events-none fixed bottom-3 left-1/2 z-(--z-toast) -translate-x-1/2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground shadow-overlay"
                >
                    Static preview with sample data. Changes are not saved.
                </div>
            </TooltipProvider>
        );
    },
    progress: { color: '#0f766e' },
});

initializeTheme();
