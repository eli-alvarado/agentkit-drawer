# LAUNCH promo cleanup (after Wed Oct 28, 2026, 6:20 PM CT)

The "Remove LAUNCH promo copy" routine must remove ALL of these:

## New (Oct 26 LAUNCH sprint): DRW-06 one-click buy buttons
Marked `<!-- LAUNCH-BUY:START --> ... <!-- LAUNCH-BUY:END -->`, attribute `data-launch-end="2026-10-28T23:20:00Z"`.
Links carry `prefilled_promo_code=LAUNCH`. Button text: "DRW-06 $19, LAUNCH code ends Wed".
- /directory/ index + all 20 /directory/<slug>/ pages -> `LAUNCH_BUY_ON` in scripts/build-directory.py
- /packs/ (under the promo line)
- dev.to articles 4906108, 4886351, 4886337, 4886336 (bottom CTA)
Run: `python3 scripts/remove-launch-buy.py` (site, then branch/PR/merge) and
`python3 /workspace/luca/devto/devto_launch.py remove` (dev.to, via API).
Safety net: docs/links.js removes `[data-launch-end]` elements client-side once the deadline passes.
After cleanup the links.js LAUNCH block and .launch-buy CSS can stay (inert) or be deleted.

## Pre-existing LAUNCH copy (already in the routine's scope)
- `grep -rln LAUNCH docs/` : promo lines (`promo-fine`, `fine`) on /, /packs/, and the guide pages
- worker `src/signup.js` follow-up email (auto-skips after PROMO_END) and any LAUNCH line in the Starter email
- Bluesky queue Tue Oct 27 post (DRW-00 with LAUNCH) is time-bound; nothing to edit after posting
- Stripe: the LAUNCH promotion code itself (expiry set in Stripe; check it is inactive)
