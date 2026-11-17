import { Monitor, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip } from '@/components/ui/tooltip';
import { useAppearance, type Appearance } from '@/hooks/use-appearance';

const options: { value: Appearance; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
];

export function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();
    const Current = options.find((o) => o.value === appearance)?.icon ?? Monitor;
    return (
        <DropdownMenu>
            <Tooltip label="Change theme">
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Change theme">
                        <Current />
                    </Button>
                </DropdownMenuTrigger>
            </Tooltip>
            <DropdownMenuContent align="end">
                {options.map((o) => (
                    <DropdownMenuItem key={o.value} onSelect={() => updateAppearance(o.value)}>
                        <o.icon aria-hidden="true" />
                        {o.label}
                        {appearance === o.value && <span className="sr-only">(current)</span>}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
