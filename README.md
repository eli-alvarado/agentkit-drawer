# AgentKit Drawer [![site](https://img.shields.io/badge/site-agentkitdrawer.com-ff5a1f)](https://agentkitdrawer.com) [![license: MIT](https://img.shields.io/badge/free%20files-MIT-15130f)](LICENSE)

> Rules your AI coding agent actually follows. Free, copy-paste `.cursor/rules`, `AGENTS.md` and system-prompt snippets for Cursor, Claude Code, Codex, Windsurf and Aider.

Agents without project rules guess: they disable RLS, trust the Stripe redirect, rewrite your scene tree, and follow instructions hidden in web pages. These files stop that.

## Contents
- [Next.js + Supabase](#nextjs--supabase)
- [Godot / game jams](#godot--game-jams)
- [Building AI agents](#building-ai-agents)
- [How to install](#how-to-install)
- [Full packs](#full-packs)

## Next.js + Supabase
- [`free/nextjs-supabase-rls.mdc`](free/nextjs-supabase-rls.mdc): Cursor rule. Every migration enables RLS with per-command policies, uses `(select auth.uid())`, indexes policy columns, and never disables RLS "to make it work". [Guide →](https://agentkitdrawer.com/cursor-rules-nextjs-supabase/)

## Godot / game jams
- [`free/godot-jam-timeline.md`](free/godot-jam-timeline.md): a 48-hour jam plan with hard cut-off points that your agent (and you) can follow. [AGENTS.md for Godot guide →](https://agentkitdrawer.com/agents-md-godot/)

## Building AI agents
- [`free/agent-guardrails.md`](free/agent-guardrails.md): paste-in snippets for prompt-injection defense, ask-before-acting, honest uncertainty, tool budgets, citations and refusals. [System prompt templates guide →](https://agentkitdrawer.com/ai-agent-system-prompt-templates/)

## How to install
| Tool | Where it goes |
|---|---|
| Cursor | `.cursor/rules/*.mdc` |
| Codex CLI, Windsurf, Aider, Zed | `AGENTS.md` at the repo root |
| Claude Code | `CLAUDE.md` containing `@AGENTS.md` |
| Any agent / API | paste into the system prompt |

## Full packs
Paid, one-time, use in unlimited projects. Details and file previews at **[agentkitdrawer.com](https://agentkitdrawer.com)**.

| Pack | What's inside | Price |
|---|---|---|
| Vibe Starter Rules Pack | AGENTS.md, CLAUDE.md, 8 scoped Cursor rules, 12 slash-command prompts, launch checklists (Next.js + Supabase + Stripe) | $19 |
| Game Jam Agent Kit | Godot 4 + Phaser/Three.js rule sets, 10 jam prompts, GDD/playtest templates | $24 |
| Agent Builder Prompt Pack | 10 agent system prompts + tool schemas, 100 eval cases, runner for any OpenAI-compatible API | $29 |
| The whole cabinet | All 3 + 12 months of updates | $49 |

## Contributing
Found a rule that agents ignore, or one that misfires? Open an issue with the tool, model and what happened. PRs that add tested free rules are welcome.

Support: agentkitdrawer@agentmail.to · Free files are MIT licensed.
