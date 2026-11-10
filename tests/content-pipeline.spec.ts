import { test, expect } from '@playwright/test';
import { dismissOnboarding } from './helpers';

// Validates the *consumption* half of the admin "생성 → 검증 → 저장" pipeline:
// once a generated_questions row is review_status='selected', contentService.ts
// must substitute it into the live session for the matching sentence + type.
// This bypasses the Gemini call itself (non-deterministic, costs money, needs
// the admin passcode) and seeds the row directly via REST instead — the exact
// bug this catches (rank/type mismatch between the admin picker and what
// createQuestions actually assigns) is a real one found and fixed this session.
//
// Needs SUPABASE_SERVICE_ROLE_KEY (the project's secret/service key) and
// VITE_SUPABASE_URL in the environment. Never commit real values for these —
// export them in your shell before running this file locally:
//   SUPABASE_SERVICE_ROLE_KEY=sb_secret_... npx playwright test content-pipeline
//
// Uses plain Node `fetch`, not Playwright's `request` fixture — the fixture
// is browser-context-associated (sends an Origin/browser-like footprint),
// and Supabase's gateway actively rejects secret keys it detects coming from
// a browser context with 401 "Forbidden use of secret API key in browser".
// That's a real, working safety feature — route around it with a real
// server-side fetch instead of trying to defeat it.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

test.skip(!SUPABASE_URL || !SERVICE_KEY, 'SUPABASE_SERVICE_ROLE_KEY not set — see comment at the top of this file');

test('an approved AI-generated question replaces the deterministic one in a live session', async ({ page }) => {
  const headers = {
    apikey: SERVICE_KEY!,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  const topSentenceRes = await fetch(
    `${SUPABASE_URL}/rest/v1/book_contents?select=candidate_id,translation_ko&work_id=eq.BOOK_HP_1888&review_status=eq.selected&order=selection_score.desc&limit=1`,
    { headers }
  );
  const [sentence] = await topSentenceRes.json();
  test.skip(!sentence, 'No selected BOOK_HP_1888 sentence found to seed against');

  const marker = `__TEST_MARKER_${Date.now()}__`;
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/generated_questions`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({
      source_table: 'book_contents',
      source_id: sentence.candidate_id,
      // Rank 0 (highest selection_score) is always assigned fill_blank by
      // both createQuestions() and adminReview.ts's QUESTION_TYPE_BY_RANK.
      question_type: 'fill_blank',
      work_title: 'The Happy Prince, and Other Tales',
      author: 'Oscar Wilde',
      prompt: marker,
      prompt_korean: sentence.translation_ko,
      sentence: `${marker} _____`,
      options: [marker, 'alpha', 'beta', 'gamma'],
      correct_answer: marker,
      explanation: marker,
      validation_status: 'passed',
      review_status: 'selected',
    }),
  });
  const [inserted] = await insertRes.json();

  try {
    await page.goto('/');
    await dismissOnboarding(page);

    await page.getByText('탐색').locator('visible=true').first().click();
    // The local mock catalog (mockData.ts) also has a "행복한 왕자" card with
    // the plain English title "The Happy Prince" — wait for the *real*
    // Supabase-backed card ("The Happy Prince, and Other Tales") specifically,
    // so a slow catalog fetch can't make this click the wrong (mock) card.
    const realCard = page.locator('div.rounded-3xl', { hasText: 'The Happy Prince, and Other Tales' });
    await expect(realCard.first()).toBeVisible({ timeout: 15000 });
    await realCard.first().getByText(/학습 시작|이어서 학습/).click();

    await expect(page.getByText(marker).first()).toBeVisible({ timeout: 10000 });
  } finally {
    if (inserted) {
      await fetch(`${SUPABASE_URL}/rest/v1/generated_questions?id=eq.${inserted.id}`, { method: 'DELETE', headers });
    }
  }
});
