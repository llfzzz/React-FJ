import { expect, test } from '@playwright/test';

test.describe('implementation code switcher', () => {
  test('defaults to TypeScript and switches formats', async ({ page }) => {
    await page.goto('/components/button');
    const impl = page.locator('.impl-block');
    await expect(impl).toBeVisible();

    // Default is TypeScript — the typed props interface shows.
    await expect(impl.locator('.codeblock')).toContainText('ButtonProps');

    // Switch to JavaScript — the actual synced .jsx source (no TS types).
    await impl.getByRole('button', { name: 'JavaScript' }).click();
    await expect(impl.locator('.codeblock')).toContainText('export function Button');
    await expect(impl.locator('.codeblock')).not.toContainText('ButtonProps');

    // Switch to CSS — the no-framework reproduction.
    await impl.getByRole('button', { name: 'CSS' }).click();
    await expect(impl.locator('.codeblock')).toContainText('.fj-btn');
  });

  test('copies the selected format and persists it across pages', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/components/button');
    const impl = page.locator('.impl-block');

    await impl.getByRole('button', { name: 'Tailwind' }).click();
    await expect(impl.locator('.codeblock')).toContainText('bg-[var(--accent)]');
    await impl.getByRole('button', { name: 'Copy code' }).first().click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain('bg-[var(--accent)]');

    // The global selection persists: Card opens already showing its Tailwind code.
    await page.goto('/components/card');
    await expect(page.locator('.impl-block .codeblock')).toContainText('rounded-[var(--radius-lg)]');
  });

  test('shows a reason when a format is not applicable', async ({ page }) => {
    await page.goto('/components/count-up');
    const impl = page.locator('.impl-block');
    await impl.getByRole('button', { name: 'CSS' }).click();
    await expect(impl.locator('.impl-unavailable')).toContainText('Counting numbers');
  });
});
