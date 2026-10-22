#!/usr/bin/env python3
"""Generate /directory/ pages from docs/directory/entries.json.

Re-run after editing the JSON:
    python3 scripts/build-directory.py
"""
from __future__ import annotations

import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DATA = DOCS / "directory" / "entries.json"
SITE = "https://agentkitdrawer.com"

TOOL_LABELS = {
    "cursor": "Cursor",
    "claude-code": "Claude Code",
    "codex": "Codex",
    "windsurf": "Windsurf",
    "mcp": "MCP",
}
STACK_LABELS = {
    "any": "any stack",
    "nextjs": "Next.js",
    "python": "Python",
    "stripe": "Stripe",
    "supabase": "Supabase",
}

PACKS = {
    "drw-00": {
        "sku": "DRW-00",
        "name": "One-File Agent Rules",
        "price": "$9",
        "url": "https://buy.stripe.com/fZu7sKdJ20oP7md93o7kc06",
        "anchor": "/#one-file",
        "blurb": "One universal AGENTS.md for Cursor, Claude Code, Codex, Windsurf and Copilot: plan gate, verify-before-done, and stack modules. A filled-in file, not a format spec.",
    },
    "drw-01": {
        "sku": "DRW-01",
        "name": "Vibe Starter Rules Pack",
        "price": "$19",
        "url": "https://buy.stripe.com/cNi4gy7kEfjJgWN7Zk7kc00",
        "anchor": "/packs/#drw-01",
        "blurb": "AGENTS.md, CLAUDE.md, 8 scoped Cursor rules and launch checklists for Next.js App Router + Supabase + Stripe, including webhook and RLS rules community dumps usually skip.",
    },
    "drw-04": {
        "sku": "DRW-04",
        "name": "Claude Code Kit",
        "price": "$24",
        "url": "https://buy.stripe.com/5kQ3cuawQ6Ndayp0wS7kc04",
        "anchor": "/packs/#drw-04",
        "blurb": "A small Claude Code setup: CLAUDE.md, 6 least-privilege subagents, 10 slash commands, settings.json permissions and 4 hooks. Stack-specific, not a marketplace.",
    },
    "drw-05": {
        "sku": "DRW-05",
        "name": "Python/FastAPI Backend Kit",
        "price": "$19",
        "url": "https://buy.stripe.com/28EdR88oI0oPeOF6Vg7kc05",
        "anchor": "/packs/#drw-05",
        "blurb": "AGENTS.md, CLAUDE.md and scoped Cursor rules for FastAPI + SQLAlchemy 2 + Pydantic v2 + Alembic + pytest: ownership checks, migrations and testing.",
    },
    "drw-06": {
        "sku": "DRW-06",
        "name": "Supabase + Next.js Agent Kit",
        "price": "$19",
        "url": "https://buy.stripe.com/bJeaEWcEYb3tcGx93o7kc07",
        "anchor": "/supabase-nextjs-agent-kit/",
        "blurb": "Rules, a read-only migration-reviewer and a hook that blocks a new Supabase table without RLS. Complements a live MCP connection; it does not replace one.",
    },
}

# Directory entry -> closest free guide (contextual internal link).
RELATED_GUIDE = {
    "agents-md": [
        "agents-md-vs-claude-md-vs-cursor-rules",
        "AGENTS.md vs CLAUDE.md vs .cursor/rules: which file does your AI agent read?"
    ],
    "anthropic-skills": [
        "claude-code-subagents-hooks-guide",
        "Claude Code subagents and hooks: examples and setup (2026)"
    ],
    "awesome-claude-code": [
        "claude-code-hooks-examples",
        "Claude Code hooks examples: 7 copy-paste settings.json hooks"
    ],
    "awesome-cursorrules": [
        "cursor-rules-for-python",
        "Cursor rules for Python: AGENTS.md template"
    ],
    "bmad-method": [
        "codex-agents-md-template",
        "Codex AGENTS.md template (2026): OpenAI Codex CLI agent instructions"
    ],
    "claude-code-templates": [
        "claude-code-claude-md-template",
        "CLAUDE.md examples and template for Claude Code (2026)"
    ],
    "claude-plugins-official": [
        "claude-code-subagents-hooks-guide",
        "Claude Code subagents and hooks: examples and setup (2026)"
    ],
    "context7": [
        "cursor-rules-nextjs-supabase",
        "Cursor rules for Next.js + Supabase (2026): a working .mdc setup"
    ],
    "cursor-rules-docs": [
        "cursor-rules-nextjs-supabase",
        "Cursor rules for Next.js + Supabase (2026): a working .mdc setup"
    ],
    "fastmcp": [
        "fastapi-agents-md-cursor-rules",
        "AGENTS.md and Cursor rules for FastAPI (2026)"
    ],
    "houshuang-claude-code": [
        "claude-code-hooks-examples",
        "Claude Code hooks examples: 7 copy-paste settings.json hooks"
    ],
    "playwright-mcp": [
        "claude-code-stop-hook-tests",
        "Claude Code Stop hook that runs tests (exit 2 blocks)"
    ],
    "spec-kit": [
        "codex-agents-md-template",
        "Codex AGENTS.md template (2026): OpenAI Codex CLI agent instructions"
    ],
    "stripe-mcp": [
        "stripe-webhooks-ai-agents",
        "Don't grant Stripe access on /success: verify webhooks"
    ],
    "supabase-mcp": [
        "supabase-rls-ai-agents",
        "Stop AI agents creating Supabase tables without RLS"
    ],
    "superpowers": [
        "claude-code-subagents-hooks-guide",
        "Claude Code subagents and hooks: examples and setup (2026)"
    ],
    "wshobson-agents": [
        "claude-code-subagents-hooks-guide",
        "Claude Code subagents and hooks: examples and setup (2026)"
    ]
}


def guide_li(entry: dict) -> str:
    g = RELATED_GUIDE.get(entry["slug"])
    if not g:
        return ""
    return f'<li>Related guide: <a href="/{g[0]}/">{escape(g[1])}</a></li>\n'

FOLLOW = """<span class="follow">Follow:<a href="https://x.com/agentkitdrawer" aria-label="AgentKit Drawer on X" title="X" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20z"/></svg></a><a href="https://bsky.app/profile/agentkitdrawer.bsky.social" aria-label="AgentKit Drawer on Bluesky" title="Bluesky" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M5.2 3.3C7.9 5.3 10.9 9.5 12 11.8c1.1-2.3 4.1-6.5 6.8-8.5 2-1.5 5.2-2.6 5.2 1 0 .7-.4 6.1-.7 7-.9 3.1-4.1 3.9-6.9 3.4 4.9.8 6.2 3.6 3.5 6.4-5.1 5.2-7.3-1.3-7.9-3l-.1-.3-.1.3c-.6 1.7-2.8 8.2-7.9 3-2.7-2.8-1.4-5.6 3.5-6.4-2.8.5-6-.3-6.9-3.4C.4 10.4 0 5 0 4.3c0-3.6 3.2-2.5 5.2-1z"/></svg></a><a href="https://www.youtube.com/@agentkitdrawer" aria-label="AgentKit Drawer on YouTube" title="YouTube" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg></a><a href="https://www.tiktok.com/@agentkitdrawer" aria-label="AgentKit Drawer on TikTok" title="TikTok" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.7a5.8 5.8 0 1 0 5 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.3-1.6z"/></svg></a></span>"""

NAV = '<nav aria-label="Main"><a href="/#demo">Demo</a><a href="/packs/">Packs</a><a href="/guides/">Guides</a><a href="/directory/">Directory</a><a href="/#faq">FAQ</a><a href="https://github.com/eli-alvarado/agentkit-drawer" target="_blank" rel="noopener noreferrer">GitHub</a></nav>'
FOOT = f'<footer class="wrap foot mono"><span>© 2026 AgentKit Drawer</span><a href="mailto:agentkitdrawer@agentmail.to">agentkitdrawer@agentmail.to</a><a href="/">Home</a> <a href="/guides/">Guides</a> <a href="/directory/">Directory</a> <a href="/about/">About</a> <a href="/contact/">Contact</a> <a href="/press/">Press</a> <a href="/refund/">Refunds</a> <a href="/privacy/">Privacy</a> <a href="/terms/">Terms</a>\n\n{FOLLOW}\n</footer>'
SCRIPTS = '<script src="/links.js" defer></script><script defer src=\'https://static.cloudflareinsights.com/beacon.min.js\' data-cf-beacon=\'{"token": "f03cc499ace64ce3b05ec4f4dab95786"}\'></script>'

HEAD_ASSETS = """<link rel="preload" href="/fonts/Archivo-400-900-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/fonts/fonts.css">
<link rel="stylesheet" href="/style.css"><link rel="icon" href="/favicon.ico" sizes="48x48"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><meta name="theme-color" content="#15130f">"""


def paras(chunks: list[str]) -> str:
    return "".join(f"<p>{c}</p>" for c in chunks)


def word_count(entry: dict) -> int:
    text = " ".join(
        [entry.get("lede", "")]
        + entry.get("what", [])
        + entry.get("who", [])
        + entry.get("take", [])
        + entry.get("compare", [])
    )
    text = re.sub(r"<[^>]+>", " ", text)
    return len(re.findall(r"[A-Za-z0-9']+", text))


def head(title: str, desc: str, canonical: str, og_type: str = "website") -> str:
    t, d, c = escape(title), escape(desc), escape(canonical)
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{t}</title><meta name="description" content="{d}"><meta name="color-scheme" content="light dark">
<link rel="canonical" href="{c}">
<meta property="og:type" content="{og_type}"><meta property="og:title" content="{t}"><meta property="og:description" content="{d}">
<meta property="og:url" content="{c}"><meta property="og:image" content="{SITE}/og.png"><meta name="twitter:card" content="summary_large_image">
{HEAD_ASSETS}<meta name="twitter:title" content="{t}"><meta name="twitter:description" content="{d}">"""


def related_cta(entry: dict) -> str:
    pack_id = entry.get("relatedPack")
    if not pack_id:
        return ""
    pack = PACKS[pack_id]
    slug = entry["slug"]
    buy = (
        f'{pack["url"]}?client_reference_id={pack_id}_directory-{slug}'
        f"&utm_source=agentkitdrawer&utm_medium=site&utm_campaign=directory-{slug}&utm_content=directory-{slug}"
    )
    return (
        f'<div class="ctabox"><h2>Related AgentKit pack</h2>'
        f"<p>{escape(pack['blurb'])}</p>"
        f'<div class="cta"><a class="btn" href="{escape(buy)}" target="_blank" rel="noopener noreferrer">'
        f"Buy {escape(pack['name'])} · {escape(pack['price'])}</a>"
        f'<a class="btn ghost" href="{escape(pack["anchor"])}">See what\'s inside</a></div>'
        f'<p class="fine mono">One-time payment · instant download · 14-day refund. We do not claim this third-party kit is affiliated with AgentKit Drawer.</p></div>'
    )


def tag_pills(entry: dict) -> str:
    bits = [f'<span class="tag mono">{escape(TOOL_LABELS.get(t, t).upper())}</span>' for t in entry["tools"]]
    bits += [f'<span class="tag mono">{escape(STACK_LABELS.get(s, s).upper())}</span>' for s in entry["stacks"]]
    return '<p class="dir-tags">' + "".join(bits) + "</p>"


def write_detail(entry: dict) -> None:
    slug = entry["slug"]
    canonical = f"{SITE}/directory/{slug}/"
    dest = DOCS / "directory" / slug / "index.html"
    dest.parent.mkdir(parents=True, exist_ok=True)
    license_note = entry.get("license") or "License not clearly stated; check the source."
    crumbs = (
        f'<p class="crumb"><a href="/">Home</a> / <a href="/directory/">Directory</a> / {escape(entry["name"])}</p>'
    )
    breadcrumb = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{SITE}/"},
            {"@type": "ListItem", "position": 2, "name": "Directory", "item": f"{SITE}/directory/"},
            {"@type": "ListItem", "position": 3, "name": entry["name"], "item": canonical},
        ],
    }
    article = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": entry["title"],
        "description": entry["metaDescription"],
        "url": canonical,
        "mainEntityOfPage": canonical,
        "datePublished": "2026-10-21",
        "dateModified": "2026-10-21",
        "image": f"{SITE}/og.png",
        "author": {"@type": "Organization", "name": "AgentKit Drawer", "url": f"{SITE}/"},
        "publisher": {
            "@type": "Organization",
            "name": "AgentKit Drawer",
            "url": f"{SITE}/",
            "logo": {"@type": "ImageObject", "url": f"{SITE}/icon-512.png"},
        },
    }
    html = f"""{head(entry["title"], entry["metaDescription"], canonical, "article")}
<script type="application/ld+json">{json.dumps(breadcrumb, separators=(",", ":"))}</script>
<script type="application/ld+json">{json.dumps(article, separators=(",", ":"))}</script>
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="top wrap"><a class="logo" href="/"><span class="logo-box" aria-hidden="true"><i></i><i></i><i></i></span>AgentKit&nbsp;Drawer</a>
{NAV}</header>
<main id="main" class="wrap article">
{crumbs}
<h1>{escape(entry["heading"])}</h1>
{tag_pills(entry)}
<p class="dir-meta mono">By {escape(entry["creator"])} · License: {escape(license_note)}</p>
<p>{entry["lede"]}</p>
<p><a class="btn" href="{escape(entry["url"])}" target="_blank" rel="noopener">Open {escape(entry["name"])}</a></p>
<h2>What it does</h2>
{paras(entry["what"])}
<h2>Who it is for</h2>
{paras(entry["who"])}
<h2>Our take</h2>
{paras(entry["take"])}
<h2>Compared with AgentKit Drawer</h2>
{paras(entry["compare"])}
{related_cta(entry)}
<nav class="related" aria-labelledby="rel-h"><h2 id="rel-h">More in the directory</h2><ul>
{guide_li(entry)}<li><a href="/directory/">All curated kits</a></li>
<li><a href="/guides/">Free guides</a></li>
</ul></nav>
</main>
{FOOT}
{SCRIPTS}</body></html>
"""
    dest.write_text(html, encoding="utf-8")


def write_index(data: dict) -> None:
    entries = data["entries"]
    tools = sorted({t for e in entries for t in e["tools"]})
    stacks = sorted({s for e in entries for s in e["stacks"]})
    canonical = f"{SITE}/directory/"
    cards = []
    for e in entries:
        tags = " ".join([f"tool:{t}" for t in e["tools"]] + [f"stack:{s}" for s in e["stacks"]])
        cards.append(
            f'<a class="gcard" data-tags="{escape(tags)}" href="/directory/{escape(e["slug"])}/">'
            f'<span class="tag mono">{escape(TOOL_LABELS.get(e["tools"][0], e["tools"][0]).upper())}</span>'
            f"<b>{escape(e['name'])}</b>"
            f'<span class="blurb">{escape(e["card"])}</span></a>'
        )
    tool_btns = ['<button type="button" data-dim="tool" data-filter="all" aria-pressed="true">All tools</button>']
    tool_btns += [
        f'<button type="button" data-dim="tool" data-filter="{escape(t)}" aria-pressed="false">{escape(TOOL_LABELS.get(t, t))}</button>'
        for t in tools
    ]
    stack_btns = ['<button type="button" data-dim="stack" data-filter="all" aria-pressed="true">All stacks</button>']
    stack_btns += [
        f'<button type="button" data-dim="stack" data-filter="{escape(s)}" aria-pressed="false">{escape(STACK_LABELS.get(s, s))}</button>'
        for s in stacks
    ]
    html = f"""{head("Free directory of agent kits and MCP setups | AgentKit Drawer", data["indexMetaDescription"], canonical)}
<link rel="alternate" type="application/atom+xml" title="AgentKit Drawer guides" href="/feed.xml">
</head><body>
<a class="skip" href="#main">Skip to content</a>
<header class="top wrap"><a class="logo" href="/"><span class="logo-box" aria-hidden="true"><i></i><i></i><i></i></span>AgentKit&nbsp;Drawer</a>
{NAV}</header>
<main id="main" class="wrap article">
<p class="crumb"><a href="/">Home</a> / Directory</p>
<h1>Directory</h1>
<p>{data["indexLede"]}</p>
<p>This first cut is {len(entries)} hand-picked entries. We checked that each outbound URL resolves. We do not invent star counts, download numbers or rankings. Featured slots are coming later; nothing here is paid placement.</p>
<p><a class="btn" href="mailto:hello@agentkitdrawer.com?subject=Directory%20submission">Submit a kit</a></p>
</main>
<section class="wrap guides dir-index" aria-label="Directory filters and listings">
  <div class="dir-filters" role="group" aria-label="Filter by tool">
    <span class="mono dir-filter-label">Tool</span>
    {"".join(tool_btns)}
  </div>
  <div class="dir-filters" role="group" aria-label="Filter by stack">
    <span class="mono dir-filter-label">Stack</span>
    {"".join(stack_btns)}
  </div>
  <p class="mono dir-count" id="dir-count">{len(entries)} shown</p>
  <div class="guide-grid" id="dir-grid">
    {"".join(cards)}
  </div>
  <p class="dir-empty" id="dir-empty" hidden>No entries match those filters. Clear a filter or <a href="mailto:hello@agentkitdrawer.com?subject=Directory%20submission">submit a kit</a>.</p>
</section>
{FOOT}
<script src="/directory.js" defer></script>
{SCRIPTS}</body></html>
"""
    (DOCS / "directory" / "index.html").write_text(html, encoding="utf-8")


def main() -> None:
    data = json.loads(DATA.read_text(encoding="utf-8"))
    entries = data["entries"]
    slugs = [e["slug"] for e in entries]
    if len(slugs) != len(set(slugs)):
        raise SystemExit("duplicate slugs")
    short = []
    for e in entries:
        n = word_count(e)
        if n < 300:
            short.append(f"{e['slug']}: {n} words")
    if short:
        raise SystemExit("entries under 300 words:\n  " + "\n  ".join(short))
    for e in entries:
        write_detail(e)
    write_index(data)
    print(f"wrote {len(entries)} directory pages")


if __name__ == "__main__":
    main()
