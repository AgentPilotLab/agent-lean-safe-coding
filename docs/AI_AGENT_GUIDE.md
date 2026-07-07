# AI Agent Guide

This repository packages `agent-lean-safe-coding`, a workflow skill for coding agents that need both lean implementation discipline and Windows-safe editing behavior.

## Use When

- The task is coding, refactoring, bug fixing, reviewing, or dependency selection.
- The repository may contain Windows paths, PowerShell scripts, Chinese text, Markdown prompts, or newline-sensitive files.
- The user asks for the smallest correct implementation or wants to reduce over-engineering.

## Codex

Codex can use this repository in two ways:

1. Install it as a plugin from the repository so `.codex-plugin/plugin.json` exposes `skills/`.
2. Use it as a direct skill by placing the repository or the skill folder in a Codex skill search path.

The skill description is intentionally explicit so Codex can invoke it implicitly for coding tasks involving lean implementation, dependency decisions, Windows text safety, or diff review.

## Claude Code

Claude Code can install this repository as a plugin. The `.claude-plugin/plugin.json` file points to lifecycle hooks that nudge each session and prompt toward the same lean-safe workflow. The root `AGENTS.md` also gives instruction-only fallback behavior for hosts that read project guidance but do not run plugin hooks.

## Verify

Run:

```bash
npm test
```

This validates skill metadata, plugin files, synchronized skill copies, benchmark generation, and privacy hygiene.
