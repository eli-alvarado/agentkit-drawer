# SEO changelog

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
