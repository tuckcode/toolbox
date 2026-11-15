---
name: audit-prompts
description: Find instructions that work against current Claude models, such as "think hard", "show your reasoning", or "minimize tool calls", and propose edits. Use for /audit-prompts.
disable-model-invocation: true
---

Current Claude models set their own thinking depth. Some requests to show internal reasoning can be declined. Some old tool and update rules now hurt. Find old instructions that ask for any of these.

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

- **Tool discouragement**: "only use tools when strictly necessary", "minimize tool calls", and close variants. They make the model answer from memory when a search would catch changes.
- **Hold-back rules**: "hold all findings for the final response", "do not write text between tool calls". They make long turns look silent.
- **No-think rules**: "do not think", "skip thinking". They can make internal tags leak into the reply.

A match in quoted text, an example, or code that processes such phrases is not an instruction. Leave it.

## Output

One row per match: file, line, the quoted text, and a proposed replacement.

- For a think request, propose deletion. Where the line sets real depth, propose "Answer directly." for simple tasks, or point to the effort setting.
- For a tool discouragement, propose deletion. Where search is needed, propose: "Use the search tool to check facts that may have changed."
- For a hold-back rule, propose deletion. Where updates are wanted, propose: "Give a one-line note before the first tool call and a short recap at the end."
- For a no-think rule, propose deletion. Point to the effort setting.
- For a reasoning request, propose a request for the result: "Explain why you chose this approach in three sentences."

Change no file until the user approves. Then apply only the approved rows.
