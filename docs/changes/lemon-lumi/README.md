# Lemon Lumi visual refresh

Requirements: combine lemon notebook home, Lumi sticker onboarding, and sentence garden. Build a large responsive hero and scroll reveal sections. Keep entry-first behavior, catalog fallback, lessons, progress and navigation.

Implementation: new transparent Lumi WebP asset; responsive onboarding with learning flow, quote, garden and final CTA; home with actual work progress and garden flowers per learned work; shared lemon tokens and Korean font. Garden derives from completedSentences, not synthetic daily streaks. No DB/schema/environment changes. CSS view timelines progressively enhance normal visible content; reduced motion disables reveal and float. No new JS dependencies.

Acceptance: onboarding always first; CTA and exploration work; lessons still complete; fresh garden has no fake flowers; completed work counts shown; no mobile horizontal overflow; keyboard focus and reduced motion supported.

Validation: typecheck, build, offline fallback, full lesson and landing entry tests plus responsive garden/reduced motion regression checks. Do not run live content-pipeline test.

Results: TypeScript typecheck and Vite production build passed using the installed locked dependencies. pnpm 11 installed lockfile dependencies but reported ignored esbuild install scripts; direct TypeScript/Vite checks succeeded. Playwright discovered the new tests; browser execution is blocked by Chromium CDN HTTP 403 and no installed browser binary. Run the Verify workflow before merging. Asset is generated original Lumi sticker, optimized WebP (~39 KB).
