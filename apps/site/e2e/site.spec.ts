import { expect, test } from '@playwright/test';

test.describe('landing', () => {
  test('renders the hero and navigates to the docs', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Free Joy design system')).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'A calm home for your interface.',
    );
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/\/docs\/introduction/);
    await expect(page.getByRole('heading', { name: 'Introduction' })).toBeVisible();
  });
});

test.describe('component docs', () => {
  test('playground controls drive the preview and the code tab', async ({ page }) => {
    await page.goto('/components/button');
    const stage = page.locator('.showcase-stage');
    await expect(stage.getByRole('button', { name: 'Start free' })).toBeVisible();

    await page.getByRole('button', { name: 'secondary', exact: true }).click();
    await page.getByRole('tab', { name: 'Code' }).click();
    await expect(page.locator('.showcase .codeblock')).toContainText('variant="secondary"');
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();
  });

  test('copies the snippet to the clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/components/badge');
    await page.getByRole('tab', { name: 'Code' }).click();
    await page.getByRole('button', { name: 'Copy code' }).first().click();
    await expect(page.getByRole('button', { name: 'Copied' }).first()).toBeVisible();
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain("import { Badge } from '@fj';");
  });

  test('catalog filters by family', async ({ page }) => {
    await page.goto('/components');
    await expect(page.getByRole('heading', { name: 'Components' })).toBeVisible();
    await page.getByRole('button', { name: 'Text effects', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'TextReveal' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Button', exact: true })).toHaveCount(0);
  });
});

test.describe('search', () => {
  test('⌘K opens, filters, and navigates on Enter', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('ControlOrMeta+k');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await page.keyboard.type('toast');
    await expect(dialog.getByText('Toast', { exact: true })).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/components\/toast/);
    await expect(dialog).toHaveCount(0);
  });
});

test.describe('states and small screens', () => {
  test('unknown routes get the 404 page', async ({ page }) => {
    await page.goto('/definitely-not-a-page');
    await expect(page.getByText('This page wandered off quietly.')).toBeVisible();
    await page.getByRole('link', { name: 'Back to Free Joy' }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test('mobile drawer opens, navigates, and closes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/components/button');
    await page.getByRole('button', { name: 'Browse docs' }).click();
    const drawer = page.getByRole('dialog', { name: 'Free Joy docs' });
    await expect(drawer).toBeVisible();
    await drawer.getByRole('link', { name: 'Colors' }).click();
    await expect(page).toHaveURL(/\/docs\/tokens\/colors/);
    await expect(drawer).not.toBeVisible();
  });
});
