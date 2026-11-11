---
name: wordscene-change
description: Plan and verify changes to the WordScene learning UI, content pipeline, Supabase functions, or progress data.
---

# WordScene changes

Read `AGENTS.md`, `README.md`, `tests/README.md`, and the affected source before editing. For a scoped change, record requirements, plan, and tasks under `docs/changes/<id>/` using the structure described in the parent workspace's `docs/agent-workflow.md` when available.

Preserve the existing learning flow, offline catalog fallback, anonymous device progress, and Supabase REST/Edge Function contracts. The repository does not fully reconstruct its base database schema from migrations; do not assume a fresh database is equivalent to production. Explicitly review RLS and migration effects for any proposed data change.

Use the existing pnpm lockfile for builds. Verify typecheck, build, and the two offline Playwright scenarios for applicable changes. `content-pipeline.spec.ts` writes to a real Supabase project and requires a service role key; run it only in an explicitly approved isolated environment. Never print secrets or environment variable values. Keep the desktop QA guidance in `AGENTS.md` intact.

Before running an external skill, CLI, or repository script, inspect its code and effects. Report the files changed, acceptance criteria met, tests run, and any DB or deployment impact.
