import { Page } from '@playwright/test';

export const dismissOnboarding = async (page: Page) => {
  const cta = page.getByRole('button', { name: '무료로 시작하기', exact: true });
  if (await cta.isVisible().catch(() => false)) {
    await cta.click();
  }
};

// Blocking every Supabase host makes local-fallback content deterministic
// (always INITIAL_WORKS / HAPPY_PRINCE_QUESTIONS from mockData.ts) so tests
// don't depend on whatever's currently curated in the live database.
export const blockSupabase = async (page: Page) => {
  await page.route('**://*.supabase.co/**', route => route.abort());
};

// Checks the current question (whatever type it is), then advances — mirrors
// the "정답 확인하기" → "다음 문제로 이동" two-click flow in LearningSessionView.
export const answerCurrentQuestion = async (page: Page) => {
  const actionBtn = page.getByRole('button', { name: /정답 확인하기|다음 문제로 이동|결과 보기/ });
  for (let i = 0; i < 25; i += 1) {
    const disabled = await actionBtn.isDisabled().catch(() => true);
    if (!disabled) break;
    // Excludes the primary action button (by text) and the word-order
    // "arranged tray" buttons (they carry a trailing material-symbol "close"
    // glyph in their text content) — otherwise the tray's remove buttons get
    // picked up too and the loop just adds and immediately removes the same
    // word forever.
    const optionBtn = page
      .locator('main button:not([title]):not([disabled])')
      .filter({ hasNotText: /정답 확인하기|다음 문제로 이동|결과 보기|배열 초기화|close/ })
      .first();
    if (!(await optionBtn.isVisible().catch(() => false))) break;
    await optionBtn.click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(60);
  }
  await actionBtn.click();
  await page.waitForTimeout(250);
  await actionBtn.click();
};

export const isInLearningSession = (page: Page) => page.locator('header').filter({ hasText: '문장' }).isVisible().catch(() => false);
