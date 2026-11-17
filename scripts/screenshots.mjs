// Captures README screenshots from the static preview. Usage: npm run build:preview && npm run preview:screenshots
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { chromium } from 'playwright';

const root = join(import.meta.dirname, '..', 'docs', 'preview');
const types = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
};
const server = createServer(async (req, res) => {
    const path = new URL(req.url, 'http://x').pathname;
    try {
        const file = join(root, path === '/' ? 'index.html' : path);
        const body = await readFile(file);
        res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' });
        res.end(body);
    } catch {
        res.writeHead(404).end();
    }
});
await new Promise((r) => server.listen(0, r));
const origin = `http://127.0.0.1:${server.address().port}/`;

const shots = [
    ['login', '/login', 'light'],
    ['dashboard-light', '/dashboard', 'light'],
    ['dashboard-dark', '/dashboard', 'dark'],
    ['users', '/users', 'light'],
    ['roles-permissions', '/permissions', 'light'],
    ['projects', '/projects', 'light'],
    ['activity-log', '/activity', 'light'],
    ['settings', '/settings/application', 'light'],
    ['error-404', '/errors/404', 'light'],
];

const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    channel: process.env.CHROME_PATH ? undefined : 'chrome',
});
for (const [name, route, theme] of shots) {
    const ctx = await browser.newContext({
        viewport: { width: 1360, height: 860 },
        colorScheme: theme,
        deviceScaleFactor: 1,
    });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.addInitScript((t) => localStorage.setItem('appearance', t), theme);
    await page.goto(`${origin}?p=${encodeURIComponent(route)}`);
    await page.waitForSelector('main, form, [data-testid="error-view"]');
    await page.addStyleTag({ content: '[role="note"]{display:none}' });
    await page.waitForTimeout(400);
    await page.screenshot({
        path: join(import.meta.dirname, '..', 'docs', 'screenshots', `${name}.png`),
    });
    console.log(errors.length ? `WARN ${name}: ${errors.join('; ')}` : `ok ${name}`);
    await ctx.close();
}
await browser.close();
server.close();
