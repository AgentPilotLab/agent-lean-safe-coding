---
name: agent-lean-safe-coding
description: Windows-safe lean coding workflow for Codex, Claude Code, and other AI coding agents. Use for coding, refactoring, bug fixing, dependency choices, code review, or implementation planning when the task may involve Windows shells, PowerShell, cmd, Git Bash, WSL, Unicode or Chinese text, Markdown or prompt files, UTF-8/GBK/CP936 encoding, CRLF/LF line endings, path portability, dependency reuse, YAGNI decisions, over-engineering risk, generated folders, small patches, or minimal verification. Also use when the user asks for lean code, safe Windows edits, smallest correct implementation, dependency review, anti-bloat review, or diff safety.
---

# Agent Lean Safe Coding

Use this skill to keep coding agents both smaller and safer: build only the needed behavior, reuse what already exists, and protect Windows/text-heavy repositories from fragile edits.

Default mode is `full`.

- `lite`: quick triage, narrow context, smallest safe patch.
- `full`: triage ladder, Windows/text safety envelope, dependency check, patch budget, verification.
- `audit`: no edits; review a plan or diff for over-building, duplicated logic, dependency risk, Windows/text risk, and weak verification.

## Runtime Loop

1. Classify the task.
2. Put risky files inside the safety envelope.
3. Walk the triage ladder before writing code.
4. Set a patch budget.
5. Edit locally and preserve style.
6. Verify the smallest objective gate.
7. Report the outcome with reuse and risk notes.

## 1. Classify

Name the task type before editing:

- `bugfix`: find the shared cause; inspect sibling callers before scattering guards.
- `feature`: check whether the requested behavior is already provided by the platform, framework, or repo.
- `refactor`: require a concrete simplification or risk reduction; avoid rearranging code for taste.
- `review`: point to deletions, reuse opportunities, unsafe shell/text operations, and missing checks.
- `docs/text`: protect encoding, line endings, Markdown structure, and examples.

If the request is unclear but a conservative default is safe, proceed with that default and state the assumption briefly.

## 2. Safety Envelope

Use the safety envelope when any of these are present: Windows paths, PowerShell or cmd, non-ASCII text, Chinese text, emoji, Markdown, prompts, templates, localization files, exact replacements, uncertain encoding, CRLF/LF-sensitive files, or generated output that could be mistaken for source.

Inside the envelope:

- Prefer patch tools for small edits.
- Avoid passing non-ASCII content through shell pipelines or inline PowerShell strings.
- Preserve the existing newline style unless a formatter owns the file.
- Use path APIs or quoted literal paths for scripts.
- Treat console mojibake as display evidence only; inspect bytes or UTF-8 reads before rewriting.
- Do not edit generated folders, dependency folders, caches, binaries, screenshots, or archives unless the user explicitly asks.

Read `references/windows-text-safety.md` only when a task has encoding, newline, path, or shell-fragility risk.

## 3. Triage Ladder

Before custom code, stop at the first level that solves the task cleanly:

1. Remove the need: can the request be satisfied by deleting, configuring, or documenting an existing path?
2. Reuse project code: helper, component, hook, validator, test utility, command, schema, or established pattern.
3. Use language or standard library behavior.
4. Use platform or framework behavior: browser controls, CSS, database constraints, framework routing, validation, caching, serialization, or build tooling.
5. Use an already-installed dependency.
6. Add a tiny local implementation.
7. Propose a new dependency or larger implementation only with a clear reason, risk, and approval need.

Never add a production dependency automatically. If a new dependency looks justified, explain what it replaces, why installed options do not fit, maintenance risk, and the exact install command.

Read `references/reuse-ladder.md` only when the dependency/reuse decision is non-obvious.

## 4. Patch Budget

Before editing, choose a small budget:

- Files expected to change.
- Files intentionally left alone.
- Existing code or platform feature to reuse.
- Minimum verification command or reason no command is useful.

Prefer fewer files, fewer abstractions, and direct changes near the behavior. Do not add interfaces, factories, service layers, config switches, future extension points, or wrappers unless the current task needs them.

## 5. Patch Rules

- Fix the root path once instead of adding repeated caller-side workarounds.
- Delete redundant code when behavior remains correct.
- Keep formatting churn out of the diff.
- Keep comments rare; use one concise comment only when an intentional limit needs to be visible later.
- If a shortcut has a known ceiling, name the ceiling and the upgrade trigger in that comment.
- Do not turn one small function into a subsystem.

## 6. Verification

Run the narrowest fresh gate that proves the change:

- Existing test for touched behavior.
- Focused unit test or self-check for non-trivial new logic.
- Syntax/type/lint check for edited language files when tests are not available.
- Diff review for docs-only or trivial one-line changes.

Non-trivial branches, parsers, money/security paths, or data-loss paths need one runnable check when practical. Trivial one-liners do not need new test scaffolding.

## 7. Final Report

Keep the final report short:

```text
Changed - ...
Triage - reused/stdlib/platform/installed dependency/local code/new dependency proposal
Safety - Windows/text risks handled or not relevant
Verified - command/result or reason
Risks - remaining limit, if any
```

For `audit` mode, return findings first with file/line references when available, then a delete/reuse list and the smallest verification gap.
