import { expect, test } from '@playwright/test';

// Uses the local-only seed account from .env.example (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD).
const email = process.env.E2E_EMAIL ?? 'admin@example.com';
const password = process.env.E2E_PASSWORD ?? 'ChangeMe-Local-Only-123!';

async function signIn(page: import('@playwright/test').Page) {
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill(password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
}

test('guests are redirected to the login page', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
});

test('wrong password shows an error and stays on login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password', { exact: true }).fill('not-the-password');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/do not match|credentials/i)).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
});

test('admin can sign in, browse the main pages and sign out', async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    for (const [link, heading] of [
        ['Users', 'Users'],
        ['Roles', 'Roles'],
        ['Activity logs', 'Activity logs'],
    ] as const) {
        await page.getByRole('link', { name: link, exact: true }).first().click();
        await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
    }
});

test('unknown route renders the 404 page', async ({ page }) => {
    await signIn(page);
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByTestId('error-view')).toContainText('404');
});

test('theme can be switched and persists across reloads', async ({ page }) => {
    await signIn(page);
    await page.evaluate(() => localStorage.setItem('appearance', 'dark'));
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
});
