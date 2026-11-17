import * as React from 'react';
import { BrandMark } from '@/components/app/brand';
import { ThemeToggle } from '@/components/app/theme-toggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-background p-4">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <main id="main" className="w-full max-w-sm">
                <div className="mb-6 flex flex-col items-center gap-3">
                    <BrandMark className="size-10" />
                </div>
                {children}
            </main>
        </div>
    );
}
