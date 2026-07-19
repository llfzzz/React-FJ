import { expect, test } from '@playwright/test';

test.describe('animation gallery', () => {
  test('renders every animation type and links to its page', async ({ page }) => {
    await page.goto('/animation');
    await expect(page.getByRole('heading', { name: 'Animation gallery' })).toBeVisible();

    // One broad category: every animation type renders in the single grid.
    const cards = page.locator('.effect-card');
    expect(await cards.count()).toBeGreaterThan(40);

    // Clicking a card opens its animation page. (Pin by id: Orbs' blurb also
    // mentions Aurora, so a hasText filter would be ambiguous.)
    await page.locator('.effect-card[data-effect="aurora"]').click();
    await expect(page).toHaveURL(/\/animation\/aurora/);
    await expect(page.getByRole('heading', { name: 'Aurora', exact: true })).toBeVisible();
  });

  test('old effect URLs redirect into the animation module', async ({ page }) => {
    await page.goto('/effects');
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
