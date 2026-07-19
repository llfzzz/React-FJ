import { expect, test } from '@playwright/test';

test.describe('index', () => {
  test('stacks every item newest-first and links to its page', async ({ page }) => {
    await page.goto('/animation');
    await expect(page.getByRole('heading', { name: 'Index', exact: true })).toBeVisible();

    // Components and animations alike are one flat stack — nothing behind tabs.
    const entries = page.locator('.index-entry');
    expect(await entries.count()).toBeGreaterThan(70);

    // Newest first: the top entry comes from the latest batch and carries the
    // "New" badge, its category, its added date, and a copyable import line.
    const first = entries.first();
    await expect(first.getByRole('link', { name: 'CardStack' })).toBeVisible();
    await expect(first.getByText('New', { exact: true })).toBeVisible();
    await expect(first.getByText('Added Jul 17, 2026')).toBeVisible();
    await expect(first.locator('code')).toContainText("import { CardStack } from '@fj-effects';");
    // The text body is the click target — clicking body whitespace (not the
    // name link itself) lands on the stretched overlay and opens the page.
    await first.click({ position: { x: 400, y: 170 } });
    await expect(page).toHaveURL(/\/animation\/card-stack/);
    await expect(page.getByRole('heading', { name: 'CardStack', exact: true })).toBeVisible();

    // The preview is a live demo, not a link: clicking inside it interacts
    // with the animation and stays on the index (no navigation).
    await page.goBack();
    await expect(page).toHaveURL(/\/animation$/);
    await entries.first().locator('.index-entry-preview').click({ position: { x: 30, y: 30 } });
    await expect(page).toHaveURL(/\/animation$/);
  });

  test('category chips filter without breaking newest-first order', async ({ page }) => {
    await page.goto('/animation');
    await page.getByRole('button', { name: 'Entrance & scroll', exact: true }).click();
    const entries = page.locator('.index-entry');
    await expect(entries).toHaveCount(3);
    // 07-04 batch (Reveal is 07-03) — StaggerList before ScrollProgress by name.
    await expect(entries.nth(0).getByRole('heading', { name: 'ScrollProgress' })).toBeVisible();
    await expect(entries.nth(1).getByRole('heading', { name: 'StaggerList' })).toBeVisible();
    await expect(entries.nth(2).getByRole('heading', { name: 'Reveal' })).toBeVisible();

    // A component category filters to components — the Index spans both modules.
    await page.getByRole('button', { name: 'Navigation', exact: true }).click();
    await expect(entries).toHaveCount(2);
    await expect(entries.nth(0).getByRole('heading', { name: 'SegmentedControl' })).toBeVisible();
    await expect(entries.nth(1).getByRole('heading', { name: 'Tabs' })).toBeVisible();
  });

  test('retired gallery and guide routes redirect to the index', async ({ page }) => {
    await page.goto('/effects');
    await expect(page).toHaveURL(/\/animation$/);
    await page.goto('/docs/effects-guide');
    await expect(page).toHaveURL(/\/animation$/);
    await page.goto('/components/aurora');
    await expect(page).toHaveURL(/\/animation\/aurora/);
    await expect(page.getByRole('heading', { name: 'Aurora', exact: true })).toBeVisible();
  });

  test('the Replay button remounts a replayable effect preview', async ({ page }) => {
    await page.goto('/animation/success-check');
    const replay = page.getByRole('button', { name: 'Replay' });
    await expect(replay).toBeVisible();
    // The stage holds an SVG check; after replay it's still present (remounted).
    await expect(page.locator('.showcase-stage svg')).toBeVisible();
    await replay.click();
    await expect(page.locator('.showcase-stage svg')).toBeVisible();
  });
});
