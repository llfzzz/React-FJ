import { expect, test } from '@playwright/test';

test.describe('effects gallery', () => {
  test('renders the grid, filters it, and links to a component page', async ({ page }) => {
    await page.goto('/effects');
    await expect(page.getByRole('heading', { name: 'Animation gallery' })).toBeVisible();

    const cards = page.locator('.effect-card');
    const total = await cards.count();
    expect(total).toBeGreaterThan(30);

    // Filter to a single family — the grid shrinks.
    await page.getByRole('button', { name: 'Backgrounds', exact: true }).click();
    const filtered = await page.locator('.effect-card').count();
    expect(filtered).toBeLessThan(total);
    await expect(page.locator('.effect-card-name', { hasText: 'Aurora' })).toBeVisible();

    // Clicking a card opens its component page. (Pin by id: Orbs' blurb also
    // mentions Aurora, so a hasText filter would be ambiguous.)
    await page.locator('.effect-card[data-effect="aurora"]').click();
    await expect(page).toHaveURL(/\/components\/aurora/);
    await expect(page.getByRole('heading', { name: 'Aurora', exact: true })).toBeVisible();
  });

  test('the Replay button remounts a replayable effect preview', async ({ page }) => {
    await page.goto('/components/success-check');
    const replay = page.getByRole('button', { name: 'Replay' });
    await expect(replay).toBeVisible();
    // The stage holds an SVG check; after replay it's still present (remounted).
    await expect(page.locator('.showcase-stage svg')).toBeVisible();
    await replay.click();
    await expect(page.locator('.showcase-stage svg')).toBeVisible();
  });
});
