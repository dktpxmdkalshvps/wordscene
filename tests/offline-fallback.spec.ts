import { test, expect } from '@playwright/test';
import { blockSupabase, dismissOnboarding } from './helpers';

// If Supabase is unreachable (bad env vars, outage, network issue), the app
// must never hard-fail — contentService.ts is supposed to fall back to the
// bundled local catalog (mockData.ts) instead.
test('renders the local fallback catalog when Supabase is unreachable', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  await blockSupabase(page);
  await page.goto('/');
  await dismissOnboarding(page);

  // INITIAL_WORKS in mockData.ts always has "행복한 왕자" (Happy Prince) as
  // the first unlocked work, so it's what startDailyLesson would open.
  await expect(page.getByText('행복한 왕자').first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole('button', { name: /오늘의 학습 시작하기|이어서 학습하기|도전하기/ }).first()).toBeVisible();

  expect(pageErrors).toEqual([]);
});
