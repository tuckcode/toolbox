---
name: audit-prompts
description: Find instructions that work against Opus 5.5, such as "think hard" or "show your reasoning", and propose edits. Use for /audit-prompts.
disable-model-invocation: true
---

Opus 5.5 thinks before each reply and sets its own depth. Some requests to show internal reasoning can be declined. Find old instructions that ask for either.

## Scope

Search these files. Skip any that do not exist:

- `~/.claude/CLAUDE.md`, and `CLAUDE.md`, `AGENTS.md`, and `.claude/CLAUDE.md` in the current repo
- `~/.claude/skills/*/SKILL.md` and `.claude/skills/*/SKILL.md`
- `~/.claude/agents/*.md` and `.claude/agents/*.md`
- `~/.claude/commands/*.md` and `.claude/commands/*.md`
- extra paths named in the arguments

## What to find

- **Think requests**: "think hard", "think harder", "think carefully", "think step by step", "think deeply", "ultrathink", "take a deep breath", and close variants.
- **Reasoning requests**: "show your reasoning", "show your thinking", "explain your chain of thought", "think out loud", or a request to put the internal reasoning in the reply.

A match in quoted text, an example, or code that processes such phrases is not an instruction. Leave it.

## Output

One row per match: file, line, the quoted text, and a proposed replacement.

- For a think request, propose deletion. Where the line sets real depth, propose "Answer directly." for simple tasks, or point to the effort setting.
- For a reasoning request, propose a request for the result: "Explain why you chose this approach in three sentences."

Change no file until the user approves. Then apply only the approved rows.
