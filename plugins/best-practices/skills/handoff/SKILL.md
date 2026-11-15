---
name: handoff
description: Write the final report of a long run for a reader who did not see the work. Use for /handoff.
disable-model-invocation: true
---

Write one report about the work in this session. The reader did not see the tool calls, the files, or the reasoning. The reader may be switching in from other work.

## Gather first

Build the facts from the real state. Do not write from memory.

- `git status` and `git log --oneline` for the commits since the run began
- `git diff <base>...HEAD --stat` for the files changed
- `TASKS.md`, if it exists, for open and blocked items
- the last check output: tests, build, or type-check

## Write it

1. **Outcome.** One or two sentences: what happened or what you found. Put this first.
2. **What you need from the reader.** Each item stands alone and says why it matters. Write "none" if empty.
3. **What changed.** Files and behavior, in plain sentences. Name each unrequested change and each behavior change.
4. **What you checked.** The command and the result. Say what you could not check, and why.
5. **Open items.** What remains, what blocks it, and who can unblock it.

## Rules

- Write complete sentences. Use plain words.
- Say what a thing is. Do not use a name or abbreviation that you made up during the work.
- Do not use arrow chains or working shorthand.
- Give each file, commit, or flag its own plain clause.
- Do not point to context the reader lacks. A sentence near the top must not need a fact from the bottom.
- Report each claim only if a tool result from this session shows it. Mark the rest as unverified.
- If the choice is between short and clear, choose clear.

Show the report in chat. Write it to a file only if the user asks.
