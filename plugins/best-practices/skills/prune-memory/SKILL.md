---
name: prune-memory
description: Find old cautions, absolute rules, and stale notes in instruction and memory files, and propose edits. Use for /prune-memory.
disable-model-invocation: true
---

Current Claude models follow notes and memory files closely. Old cautions pile up and cause needless approval requests. Find them.

## Scope

Read these files. Skip any that do not exist:

- `~/.claude/CLAUDE.md`, and `CLAUDE.md`, `AGENTS.md`, and `.claude/CLAUDE.md` in the current repo
- memory files: `~/.claude/projects/*/memory/*.md` and any folder the arguments name
- the start-chain files that `CLAUDE.md` tells every session to read
- extra paths named in the arguments

For a faster scan of skills, agents, and commands, run `/best-practices:audit-prompts` instead.

## What to find

- **Absolute rules:** "never" or "always" on an action the agent may sometimes need. Propose "ask before <action>".
- **Old cautions:** "never retry", "stop at the first error", "stop and review" conditions with no stated reason. Propose deletion or a narrow scope.
- **Stale notes:** dated notes about work that is done, moved files, or retired tools. Propose deletion.
- **Forced work:** a rule that makes every session do extra work first, for example "run the audit before anything else". Propose "tell the user, then ask".
- **Broad approval lists:** "ask before sending messages to anyone". Propose a list of the exact actions.
- **Repeated text:** the same rule loaded by more than one path. Propose keeping one.
- **Hard style limits:** "20 words or fewer". They can make prose choppy on Fable 5.2. Flag them. Do not remove them without the user.

A match in a quote, an example, or a file that only describes the rule is not a rule. Leave it.

## Output

One row per match: file, line, the quoted text, why it matters, and the proposed change.

A file may carry a "do not edit by hand" header. Name its source file and say the edit goes there. Name the sync script if one exists.

Change no file until the user approves. Then apply only the approved rows. Do not delete a note without the user's yes, even if it looks stale. End with **Not checked**: each file you could not read.
