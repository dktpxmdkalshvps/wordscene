import { test, expect } from '@playwright/test';
import { answerCurrentQuestion, blockSupabase, dismissOnboarding, isInLearningSession } from './helpers';

// The happy path: onboarding -> start a lesson -> answer every question type
// (fill_blank, word_order, translation_match, source_guess all appear in the
// local fallback deck) -> result screen -> navigate back out. The last step
// is a direct regression test for a real bug found this session: the result
// screen's "홈으로 돌아가기" button called setActiveTab() without clearing
// `lastResult`, so AppShell kept rendering the result screen forever.
test('onboarding through a full lesson to the result screen, then navigates home', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  await blockSupabase(page); // deterministic local content, not whatever's live
  await page.goto('/');
  await dismissOnboarding(page);

  await page.getByRole('button', { name: /오늘의 학습 시작하기|이어서 학습하기|도전하기/ }).first().click();
  await expect.poll(() => isInLearningSession(page)).toBe(true);

  for (let i = 0; i < 10 && (await isInLearningSession(page)); i += 1) {
    await answerCurrentQuestion(page);
  }

  await expect(page.getByText('학습을 완주했어요')).toBeVisible({ timeout: 10000 });

  await page.getByRole('button', { name: /홈으로 돌아가기/ }).click();
  await expect(page.getByText('학습을 완주했어요')).not.toBeVisible();
  await expect(page.getByText('행복한 왕자').first()).toBeVisible();

  expect(pageErrors).toEqual([]);
});
