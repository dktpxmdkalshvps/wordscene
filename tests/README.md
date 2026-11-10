# E2E tests

```bash
npm run test:e2e
```

Three smoke tests covering the highest-risk flows in the app:

- **offline-fallback.spec.ts** — Supabase is blocked at the network level; the app must still render the bundled local catalog instead of crashing.
- **core-learning-flow.spec.ts** — onboarding → a full lesson (every question type) → result screen → navigating back out. The last step is a direct regression test for a real bug: the result screen's "홈으로 돌아가기" button used to leave `lastResult` set, so `AppShell` kept showing the result screen forever no matter what tab you switched to.
- **content-pipeline.spec.ts** — seeds a `generated_questions` row directly via REST (bypassing the Gemini call) and checks it actually shows up in a live session. This is the exact bug class found this session: the admin "AI 문제 생성" picker used to let you generate a question for a sentence/type combination `contentService.ts` would never actually use, so approving it silently did nothing.

`content-pipeline.spec.ts` talks to the real Supabase project and needs a service-role key, so it **skips itself** unless you export:

```bash
VITE_SUPABASE_URL=https://vopkpnochmnilgvdafnf.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=<secret key, never commit this> \
npx playwright test content-pipeline
```

It always cleans up the row it inserts, even if the assertion fails.

The other two tests block all `*.supabase.co` requests, so they're fully deterministic and never touch the live database.
