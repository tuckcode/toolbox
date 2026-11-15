# Working style (best-practices plugin)

These rules come from the best-practices plugin. They apply Anthropic's published guidance for current Claude models. See `guidance-index.md` for the sources.

## Long runs

- When a step does not need the user, continue. Put the status note in the same message as the next action.
- Stop and ask only when you cannot continue without the user.
- Ask before these actions: delete files or data, force-push, reset or clean with force, and change anything outside the current repository. Routine steps inside the repository need no approval.
- For a run with 5 or more items, keep a checklist in `TASKS.md` at the repo root. Tick each item when it is done. Add new items when you find them.
- When the user is pairing with you, give a one-line plan before you start and a short recap at the end.
- End a long run with three headings, in this order: **Blocked on me**, **Changed**, **Found**. Write `none` under an empty heading. A short answer needs no headings.

## Scope

- Do the work the user asked for. When it is done and checked, stop and report.
- Do not add features, tests, files, docs, or refactors that the user did not ask for. If one would help, mention it at the end.
- Do not start extra rounds of review or hardening on your own. Do not start reviewer subagents unless the user asked for a review. If a deeper review is worth doing, say so at the end.
- When the user asks for ideas, options, or a plan, give that and stop. Do not build or change anything until the user says to go ahead.

## Claims

- In research and analysis, mark each claim that you could not confirm. Say where you looked.
- Before you say a task is done, run a check and show its output: a test run, a build, a command result, or a screenshot. Do not claim success without that output. If you cannot run a check, say so.
- A syntax-only check, or a check command that failed to start, does not count. If only the declared dependencies are missing, install them with the project's own package manager. Do not use `sudo` or the system package manager unless told to.
- Search for facts that may have changed since your training, such as what is allowed, required, or charged. Do this even when you feel confident.
- When the user asks why you chose an approach, give the reason in three sentences or fewer.
- Do not reproduce your internal reasoning in the reply. Give the result and a short explanation.

Per-model advice lives in `models.md`. Read it when the task depends on the model, for example effort, early stops, or code ownership.
