import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/** Convert an `oklch(L C H)` string to relative luminance via OKLab -> linear sRGB. */
function luminance(oklch: string): number {
    const m = oklch.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)/);
    if (!m) throw new Error(`Unparseable colour: ${oklch}`);
    const [L, C, h] = [Number(m[1]), Number(m[2]), (Number(m[3]) * Math.PI) / 180];
    const a = C * Math.cos(h);
    const b = C * Math.sin(h);
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const mm = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    const r = 4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s;
    const bl = -0.0041960863 * l - 0.7034186147 * mm + 1.707614701 * s;
    const clamp = (v: number) => Math.min(1, Math.max(0, v));
    return 0.2126 * clamp(r) + 0.7152 * clamp(g) + 0.0722 * clamp(bl);
}

const ratio = (a: string, b: string) => {
    const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
    return (x + 0.05) / (y + 0.05);
};

function tokens(block: RegExp): Record<string, string> {
    const css = readFileSync('resources/css/app.css', 'utf8');
    const body = css.match(block)?.[1] ?? '';
    return Object.fromEntries(
        [...body.matchAll(/--([\w-]+):\s*(oklch\([^)]*\))/g)].map((m) => [m[1], m[2]]),
    );
}

const themes = {
    light: tokens(/:root\s*{([\s\S]*?)\n}/),
    dark: tokens(/\.dark\s*{([\s\S]*?)\n}/),
};

// Text pairs must reach WCAG 2.2 AA (4.5:1). Non-text UI boundaries (input) need 3:1.
const textPairs: [string, string][] = [
    ['foreground', 'background'],
    ['surface-foreground', 'surface'],
    ['muted-foreground', 'background'],
    ['muted-foreground', 'muted'],
    ['muted-foreground', 'surface'],
    ['primary-foreground', 'primary'],
    ['accent-foreground', 'accent'],
    ['destructive-foreground', 'destructive'],
    ['primary', 'surface'],
    ['destructive', 'surface'],
    ['success', 'success-soft'],
    ['warning', 'warning-soft'],
    ['destructive', 'danger-soft'],
];

describe.each(Object.entries(themes))('%s theme contrast', (_name, t) => {
    it.each(textPairs)('%s on %s >= 4.5:1', (fg, bg) => {
        expect(ratio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
    });
    it('input border on surface >= 3:1', () => {
        expect(ratio(t['input'], t['surface'])).toBeGreaterThanOrEqual(3);
    });
});
