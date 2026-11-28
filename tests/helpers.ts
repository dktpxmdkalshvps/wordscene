import { expect, Page } from '@playwright/test';

export const dismissOnboarding = async (page: Page) => {
  const cta = page.getByRole('button', { name: '무료로 시작하기', exact: true });
  await cta.click();
};

// Blocking every Supabase host makes local-fallback content deterministic
// (always INITIAL_WORKS / HAPPY_PRINCE_QUESTIONS from mockData.ts) so tests
// don't depend on whatever's currently curated in the live database.
export const blockSupabase = async (page: Page) => {
  await page.route('**://*.supabase.co/**', route => route.abort());
};

// Select only answer controls; never depend on unrelated buttons or animation timing.
export const answerCurrentQuestion = async (page: Page) => {
  const check = page.getByRole('button', { name: /정답 확인하기/ });
  await expect(check).toBeVisible();
  const words = page.getByTestId('word-option');
  if (await words.count()) {
    // Each occurrence is a separate choice, including repeated words.
    for (let i = 0; i < await words.count(); i += 1) {
      await words.nth(i).click();
    }
  } else {
    await page.getByTestId('answer-option').first().click();
  }
  await expect(check).toBeEnabled();
  await check.click();
  const next = page.getByRole('button', { name: /다음 문제로 이동|결과 보기/ });
  await expect(next).toBeEnabled();
  await next.click();
};

export const isInLearningSession = (page: Page) => page.locator('header').filter({ hasText: '문장' }).isVisible().catch(() => false);
