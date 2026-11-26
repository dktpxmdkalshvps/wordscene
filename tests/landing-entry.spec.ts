import { test, expect } from '@playwright/test';
import { blockSupabase, dismissOnboarding } from './helpers';

for (const returning of [false, true]) {
  test(`${returning ? 'returning' : 'new'} learner sees landing before learning home`, async ({ page }) => {
    await blockSupabase(page);
    if (returning) {
      await page.addInitScript(() => {
        localStorage.setItem('ws_onboarding_complete', 'true');
        localStorage.setItem('ws_user', JSON.stringify({ name: '기존 학습자', totalXp: 120, streakDays: 3, selectedLanguage: '영어' }));
      });
    }
    await page.goto('/');
    await expect(page.locator('#entry-title')).toBeVisible();
    const lesson = page.getByRole('button', { name: /오늘의 학습 시작하기|이어서 학습하기|도전하기/ }).first();
    await expect(lesson).toHaveCount(0);
    await dismissOnboarding(page);
    await expect(page.locator('#entry-title')).toHaveCount(0);
    await expect(lesson).toBeVisible();
    if (returning) {
      await expect(page.getByRole('button', { name: /120 XP/ })).toBeVisible();
    }
    await page.reload();
    await expect(page.locator('#entry-title')).toBeVisible();
    await expect(lesson).toHaveCount(0);
  });
}

test('landing library CTA opens exploration', async ({ page }) => {
  await blockSupabase(page);
  await page.goto('/');
  await page.getByRole('button', { name: /작품 둘러보기/ }).click();
  await expect(page.locator('#entry-title')).toHaveCount(0);
  await expect(page.locator('main')).toContainText('행복한 왕자');
});
