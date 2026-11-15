---
name: fan-out
description: Split an audit, migration, or large review across subagents, verify each report, and merge to one table. Use for /fan-out.
disable-model-invocation: true
---

The user asked for subagents. Split the work in the arguments across them.

## Steps

1. List the units: one service, package, or directory per unit. Write the list to `TASKS.md`.
2. Give each unit to its own subagent. Run them in the background, in parallel. Each brief states the question, the unit path, and the required evidence: file, line, and a quote or command output.
3. When a subagent reports, check its evidence before you accept it. Open the cited file and line. Re-run the cited command when it is cheap. Reject a claim that has no evidence and send the unit back once.
4. Tick the unit in `TASKS.md` when its report passes the check.
5. Finish with one table: unit, result, evidence. Add a **Not confirmed** list for each claim that failed the check, with where you looked.

The run is done when every unit has a checked row or a Not confirmed entry.
