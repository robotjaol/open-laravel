import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { useAppearance } from '@/hooks/use-appearance';

export function Toaster(props: ToasterProps) {
    const { appearance } = useAppearance();
    return (
        <Sonner
            theme={appearance}
            position="bottom-right"
            richColors
            closeButton
            style={{ zIndex: 'var(--z-toast)' } as React.CSSProperties}
            {...props}
        />
    );
}
