import { expect, test } from '@playwright/test';

test.describe('reduced motion', () => {
  // Emulate "I prefer reduced motion" before each navigation.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('TextReveal renders plain text with no animated fragments', async ({ page }) => {
    await page.goto('/animation/text-reveal');
    const stage = page.locator('.showcase-stage');
    await expect(stage).toContainText('Built for the making.');
    // The animated build wraps each word in an aria-hidden fragment; the reduced
    // path returns a single plain <span> with no such fragments.
    await expect(stage.locator('span[aria-hidden="true"]')).toHaveCount(0);
  });

  test('Sparkles renders no particle nodes', async ({ page }) => {
    await page.goto('/animation/sparkles');
    const stage = page.locator('.showcase-stage');
    await expect(stage).toBeVisible();
    // Every particle is an aria-hidden span; under reduced motion there are none.
    await expect(stage.locator('span[aria-hidden="true"]')).toHaveCount(0);
  });

  test('Typewriter shows the finished line immediately', async ({ page }) => {
    await page.goto('/animation/typewriter');
    // No typing under reduced motion: the full string is present at once.
    await expect(page.locator('.showcase-stage')).toContainText('Made with joy, typed live.');
  });

  test('Marquee renders a single row with no clone', async ({ page }) => {
    await page.goto('/animation/marquee');
    const stage = page.locator('.showcase-stage');
    // The animated track duplicates the strip; the reduced path renders each item once.
    await expect(stage.getByText('Design tokens')).toHaveCount(1);
  });

  test('the effects gallery still renders fully', async ({ page }) => {
    await page.goto('/animation');
    await expect(page.getByRole('heading', { name: 'Animation index' })).toBeVisible();
    expect(await page.locator('.anim-entry').count()).toBeGreaterThan(40);
  });
});
