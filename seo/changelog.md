# SEO changelog

## 2026-11-09: /directory/supabase-mcp/ setup + guardrails
- Expanded the Supabase MCP directory page with a Short answer, a copyable `.cursor/mcp.json` (read-only, `project_ref`), Cursor and Claude Code setup from official docs, and a guardrails section (read-only, project scope, production, feature groups). Title and meta unchanged.
- Contextual inlinks from /supabase-nextjs-agent-kit/ and /cursor-rules-nextjs-supabase/. Sitemap lastmod bumped for those three pages.

## 2026-11-09: /packs/ CLS, sitemap lastmod, title trims (this PR)
- /packs/ CLS: the remaining shift (local Lighthouse mobile 0.147 on `section#drawers > div.snip`, 3 of 3 runs against the live site) came from the **Archivo** swap, not JetBrains Mono: delaying only JetBrains Mono gave CLS 0, delaying only Archivo gave 0.147. In the fallback the "Short answer" paragraph wraps to 9 lines instead of 8 (+27.7 px), so the snippet box below moves up when Archivo arrives. Fallback width vs Archivo varies by text (-1% to +2%), so size-adjust can't fix every rewrap. Archivo now uses `font-display: optional` (preloaded on every page, so it normally renders on first paint; if it's late the fallback stays and nothing shifts). Re-inlined into / and /packs/. Local Lighthouse /packs/ with fonts delayed 500 ms: CLS 0.147 → 0.001, perf 92 → 98 (3 runs each).
- Titles/descriptions: /codex-agents-md-template/ title 68→52 and description 169→157; /windsurf-rules/ title 67→61; /agents-md-game-modding/ description 167→156. Same wording, primary query first, no new claims (og/twitter/JSON-LD copies updated where identical).
- Sitemap: lastmod regenerated from git dates for 46 of 48 URLs (stale since PRs from Oct 22 on edited pages without bumping it; e.g. / and /packs/ said 2026-10-26). New `scripts/sitemap-lastmod.py` (rewrite, or `--check`) and `.github/workflows/sitemap.yml` running the check on every PR and push to main.

## 2026-11-09: Short answer on /supabase-rls-ai-agents/ (#65)
- One answer-first `.tldr` paragraph under the H1. No title, meta or URL change. (Also #66 the same day: Game Jam Kit shortcut on /agents-md-godot/, conversion only.)

## 2026-11-08: Short answer on /codex-agents-md-template/ (#64)
- One `.tldr` paragraph under the H1 (most-visited content page with /agents-md-godot/). No title, meta or URL change.

## 2026-11-07: homepage Short answer + where-to-buy link (#63)
- `.tldr` on / after the hero; contextual link to /where-to-buy-cursor-rules/; removed unused LAUNCH CSS/JS. No title, meta or URL change.

## 2026-11-06: new guide /where-to-buy-cursor-rules/ (#62) and answer-first blocks (#61)
- #62: comparison of free sources and paid packs (AI-search fix 3). Title "Where to buy Cursor rules - AgentKit Drawer" (43), description 156. Sitemap, /guides/, feed, llms.txt, llms-full.txt; inlinks from /packs/ and /cursor-rules-nextjs-supabase/. Indexing requested 2026-11-06 and 2026-11-09 (unknown to Google on both dates).
- #61: Short answer + copyable snippet under the H1 on /cursor-rules-nextjs-supabase/ (duplicate lower snippet removed) and /claude-code-hooks-examples/.

## 2026-11-04: answer-first summaries (#59)
- Short answer + copyable snippet under the H1 on /agents-md-godot/, /packs/ and /supabase-nextjs-agent-kit/ (AI-visibility fix 1). This /packs/ snippet box is the `div.snip` that later showed the font-swap shift.

## 2026-11-02: CLS fixes on / and /packs/ (#48, #50)
- #48: header height no longer depends on the webfont below 440px (CLS on / was 0.199 in 2 of 3 local runs).
- #50: metric-matched Archivo fallback `@font-face` (`size-adjust`, Arial/Liberation Sans and Roboto). Audit 2026-11-09: / CLS 0 in 3 of 3 runs; /packs/ 0.367 → 0.147 (fixed in the 2026-11-09 entry above).

## 2026-10-22: post-#29 anchor audit (/packs/)
- Grepped the whole repo (guides, directory pages + scripts/build-directory.py, llms.txt, llms-full.txt, feed, JSON-LD) for links to the removed homepage anchors /#drw-01..05, /#bundle, /#drawers: none left; all point to /packs/#... Only a code comment in drawers.js still said /#drw-04; updated.
- /packs/ live: 200, self-canonical, unique title ("All AgentKit Drawer packs: AGENTS.md, Cursor rules and Claude Code kits") and meta, listed in sitemap.xml.

## 2026-10-20: week-one foundations (branch seo/2026-10-20-foundations)
- Shortened titles on 6 guides (subagents/hooks 91→58, FastAPI 89→45, CLAUDE.md 75→53, game modding, Godot, system prompts) and descriptions on 3 to ~145-157 chars.
- Added WebSite JSON-LD on home.
- Added /contact/ page, linked from every footer, added to sitemap.

## 2026-10-21
- New /directory/ of 20 hand-picked third-party kits (Cursor rules, AGENTS.md/CLAUDE.md, Claude Code plugins, MCP). Unique titles, self-canonicals, ~300-word pages. Data in docs/directory/entries.json. Added to sitemap, feed, llms.txt. Featured slots noted as coming. No invented stats. Existing guide URLs and titles unchanged.
- Four new guides: /supabase-rls-ai-agents/, /stripe-webhooks-ai-agents/, /fastapi-async-blocking-ai-agents/, /claude-code-stop-hook-tests/. Wired sitemap, feed.xml, /guides/, llms.txt, home cards. Stop-hook page is a tests-gate deep dive (distinct title/H1/meta from /claude-code-hooks-examples/); the examples page links to it instead of expanding.
- New guide /claude-code-hooks-examples/ (target: "claude code hooks examples"). 7 hooks verified against code.claude.com/docs/en/hooks-guide. Inbound links from the subagents guide, CLAUDE.md page, home and /guides/.
- Extended /claude-code-claude-md-template/ with a "CLAUDE.md examples" section (target: "claude.md examples"); retitled "CLAUDE.md examples and template for Claude Code (2026)". Verified against code.claude.com/docs/en/memory.
- Fixed subagents guide: "Exit 0 allows" was inaccurate (exit 0 = no decision, normal permission flow applies), body + FAQ JSON-LD.
- Wired sitemap, llms.txt, feed.xml. No price, claim or checkout changes.
- 2026-10-21 (Woody, PR #26 review): /directory/ launch with 20 entries. Checked: 5-word shingle overlap max Jaccard 0.078, 330+ unique shingles per page, unique titles (≤58 chars) and metas (≤152), self-canonicals, one H1, BreadcrumbList+TechArticle JSON-LD, all 20 outbound URLs 200 with rel=noopener, no ratings/star counts, prices match homepage. Added contextual links: 17 entries → closest guide, 4 guides → matching entry.
- 2026-10-26 (Luca, daily ops): added CollectionPage + ItemList + BreadcrumbList JSON-LD to /directory/ (20 entries, generated in scripts/build-directory.py) and /guides/ (16 guides). Head-only change; no title, meta description, canonical, URL or sitemap changes.

## 2026-10-26: home + /packs/ LCP, shorter titles, Godot FAQ
- Home and /packs/: inlined fonts.css and style.css (marked `<style data-inline=…>`) to remove two render-blocking requests; audit LCP was 2.3 s (PSI mobile) / 2.6 s (local LH), LCP element the hero text. After editing style.css or fonts.css run `python3 scripts/inline-critical-css.py`.
- Titles shortened: /agents-md-vs-claude-md-vs-cursor-rules/ 76→58, /supabase-nextjs-agent-kit/ 71→56, /packs/ 71→64 (no price text touched).
- /agents-md-godot/: 5-question FAQ (visible + FAQPage JSON-LD) citing Godot docs (VCS, upgrading to 4, TSCN) and Claude Code memory docs; dateModified 2026-10-26.
- sitemap lastmod bumped for the 5 changed pages.
