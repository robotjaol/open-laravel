import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:8000';

export default defineConfig({
    testDir: 'tests/Browser',
    timeout: 30_000,
    retries: process.env.CI ? 1 : 0,
    reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
    use: { baseURL, trace: 'retain-on-failure' },
    webServer: process.env.E2E_BASE_URL
        ? undefined
        : { command: 'php artisan serve --host=127.0.0.1 --port=8000', url: `${baseURL}/up`, reuseExistingServer: !process.env.CI, timeout: 60_000 },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
