import { expect, test } from '@playwright/test';

test.describe('reduced motion', () => {
  // Emulate "I prefer reduced motion" before each navigation.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('TextReveal renders plain text with no animated fragments', async ({ page }) => {
    await page.goto('/components/text-reveal');
    const stage = page.locator('.showcase-stage');
    await expect(stage).toContainText('Built for the making.');
    // The animated build wraps each word in an aria-hidden fragment; the reduced
    // path returns a single plain <span> with no such fragments.
    await expect(stage.locator('span[aria-hidden="true"]')).toHaveCount(0);
  });

  test('Sparkles renders no particle nodes', async ({ page }) => {
    await page.goto('/components/sparkles');
    const stage = page.locator('.showcase-stage');
    await expect(stage).toBeVisible();
    // Every particle is an aria-hidden span; under reduced motion there are none.
    await expect(stage.locator('span[aria-hidden="true"]')).toHaveCount(0);
  });

  test('the effects gallery still renders fully', async ({ page }) => {
    await page.goto('/effects');
    await expect(page.getByRole('heading', { name: 'Motion gallery' })).toBeVisible();
    expect(await page.locator('.effect-card').count()).toBeGreaterThan(20);
  });
});
