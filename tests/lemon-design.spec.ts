import { test, expect } from '@playwright/test';
import { blockSupabase, dismissOnboarding } from './helpers';

for (const width of [360, 1280]) {
  test(`lemon landing and empty garden at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 850 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await blockSupabase(page);
    await page.goto('/');
    await expect(page.locator('#entry-title')).toBeVisible();
    await page.locator('#garden').scrollIntoViewIfNeeded();
    await expect(page.locator('#garden h2')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('#top').scrollIntoViewIfNeeded();
    await dismissOnboarding(page);
    await expect(page.getByText('첫 문장을 심어주세요')).toBeVisible();
    await expect(page.locator('.lemon-flower')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect.poll(() => page.locator('.lemon-lumi').first().evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  });
}
