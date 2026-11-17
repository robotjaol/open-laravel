import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BarChart } from '@/components/app/bar-chart';
import { ConfirmDialog } from '@/components/app/confirm-dialog';
import { StatusBadge } from '@/components/app/status-badge';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/checkbox';

describe('Button', () => {
    it('is disabled and busy while loading', () => {
        render(<Button loading>Save</Button>);
        const button = screen.getByRole('button', { name: 'Save' });
        expect(button).toBeDisabled();
        expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('fires onClick when enabled', async () => {
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Go</Button>);
        await userEvent.click(screen.getByRole('button', { name: 'Go' }));
        expect(onClick).toHaveBeenCalledOnce();
    });
});

describe('Field', () => {
    it('links label, control and error message for assistive technology', () => {
        render(
            <Field id="email" label="Email" error="Email is required" required>
                {(aria) => <Input {...aria} />}
            </Field>,
        );
        const input = screen.getByLabelText(/Email/);
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', 'email-error');
        expect(screen.getByRole('alert')).toHaveTextContent('Email is required');
    });

    it('shows the hint only when there is no error', () => {
        render(
            <Field id="code" label="Code" hint="Unique identifier">
                {(aria) => <Input {...aria} />}
            </Field>,
        );
        expect(screen.getByText('Unique identifier')).toBeInTheDocument();
        expect(screen.getByLabelText('Code')).toHaveAttribute('aria-describedby', 'code-hint');
    });
});

describe('Switch', () => {
    it('toggles through the keyboard-accessible switch role', async () => {
        const onChange = vi.fn();
        render(<Switch checked={false} onCheckedChange={onChange} aria-label="Registration" />);
        const toggle = screen.getByRole('switch', { name: 'Registration' });
        expect(toggle).toHaveAttribute('aria-checked', 'false');
        await userEvent.click(toggle);
        expect(onChange).toHaveBeenCalledWith(true);
    });
});

describe('StatusBadge', () => {
    it('renders human readable status text', () => {
        render(<StatusBadge status="on_hold" />);
        expect(screen.getByText('on hold')).toBeInTheDocument();
    });
});

describe('BarChart', () => {
    it('exposes the data as an accessible table', () => {
        render(
            <BarChart
                title="Sign-ins per day"
                valueLabel="sign-ins"
                data={[
                    { label: 'Mon', value: 3 },
                    { label: 'Tue', value: 7 },
                ]}
            />,
        );
        expect(screen.getByRole('img', { name: 'Sign-ins per day' })).toBeInTheDocument();
        expect(screen.getByRole('table', { name: 'Sign-ins per day' })).toBeInTheDocument();
        expect(screen.getByRole('cell', { name: '7' })).toBeInTheDocument();
    });

    it('handles empty data without crashing', () => {
        render(<BarChart title="Empty" valueLabel="x" data={[]} />);
        expect(screen.getByRole('img', { name: 'Empty' })).toBeInTheDocument();
    });
});

describe('ConfirmDialog', () => {
    it('requires an explicit named confirmation and can be cancelled', async () => {
        const onConfirm = vi.fn();
        const onOpenChange = vi.fn();
        render(
            <ConfirmDialog
                open
                onOpenChange={onOpenChange}
                title="Delete Ada?"
                description="This cannot be undone."
                confirmLabel="Delete Ada"
                onConfirm={onConfirm}
            />,
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        await userEvent.click(screen.getByRole('button', { name: 'Delete Ada' }));
        expect(onConfirm).toHaveBeenCalledOnce();
        await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
});
