import { expect, test } from '@playwright/test';

test.describe('implementation code switcher', () => {
  test('defaults to TypeScript + CSS and switches combinations', async ({ page }) => {
    await page.goto('/components/button');
    const impl = page.locator('.impl-block');
    await expect(impl).toBeVisible();

    // Default is TypeScript + CSS — the typed port plus its stylesheet.
    await expect(impl.locator('.impl-file-name').first()).toHaveText('Button.tsx');
    await expect(impl.locator('.impl-file-name').nth(1)).toHaveText('Button.css');
    await expect(impl.locator('.codeblock').first()).toContainText('ButtonProps');
    await expect(impl.locator('.codeblock').nth(1)).toContainText('.fj-btn');

    // JavaScript keeps the stylesheet pairing and drops the types.
    await impl.getByRole('button', { name: 'JavaScript' }).click();
    await expect(impl.locator('.impl-file-name').first()).toHaveText('Button.jsx');
    await expect(impl.locator('.codeblock').first()).toContainText('export function Button');
    await expect(impl.locator('.codeblock').first()).not.toContainText('ButtonProps');
    await expect(impl.locator('.codeblock').first()).toContainText('import "./Button.css"');

    // Tailwind collapses to a single utility-styled file.
    await impl.getByRole('button', { name: 'Tailwind CSS' }).click();
    await expect(impl.locator('.impl-file')).toHaveCount(1);
    await expect(impl.locator('.codeblock')).toContainText('bg-[var(--fj-btn-accent)]');

    // Back to TypeScript: the Tailwind port gains its types.
    await impl.getByRole('button', { name: 'TypeScript' }).click();
    await expect(impl.locator('.impl-file-name')).toHaveText('Button.tsx');
    await expect(impl.locator('.codeblock')).toContainText('interface ButtonProps');
  });

  test('copies the shown file and persists the combo across pages', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/components/button');
    const impl = page.locator('.impl-block');

    await impl.getByRole('button', { name: 'Tailwind CSS' }).click();
    await expect(impl.locator('.codeblock')).toContainText('bg-[var(--fj-btn-accent)]');
    await impl.getByRole('button', { name: 'Copy code' }).first().click();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain('bg-[var(--fj-btn-accent)]');

    // Both selections persist: Card opens already on TypeScript + Tailwind.
    await page.goto('/components/card');
    const cardImpl = page.locator('.impl-block');
    await expect(cardImpl.locator('.impl-file-name')).toHaveText('Card.tsx');
    await expect(cardImpl.locator('.codeblock')).toContainText('rounded-[var(--radius-lg)]');
  });

  test('styling-neutral effects serve one source with an inert Style picker', async ({ page }) => {
    await page.goto('/components/count-up');
    const impl = page.locator('.impl-block');
    await expect(impl.locator('.impl-note')).toContainText('Counting runs in JavaScript');
    await expect(impl.locator('.impl-picker--inert')).toBeVisible();

    // The language axis still works: TS shows the typed source, JS the synced .jsx.
    await expect(impl.locator('.impl-file-name')).toHaveText('CountUp.tsx');
    await impl.getByRole('button', { name: 'JavaScript' }).click();
    await expect(impl.locator('.impl-file-name')).toHaveText('CountUp.jsx');
  });
});
