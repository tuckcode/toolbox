---
name: own-it
description: Run one coding task as the code owner, then review the diff and list every change the task did not ask for. Use for /own-it.
disable-model-invocation: true
---

Do the task in the arguments as the owner of this codebase. Then check what you changed.

The ownership stance is from Anthropic's Fable 5.2 guide. It makes the model consolidate duplicate code and fix nearby problems. It also raises token use and unrequested changes. Read the Code ownership section of `models.md` if you need the numbers.

## Optional arguments

The arguments may set a budget. Read them before step 1.

- `protect=<path>,<path>`: files and folders that you must not edit.
- `max-files=<N>`: the most files the diff may touch.
- `area=<path>`: the folder the task belongs to. Default: the files the task names, and their direct callers.

## Guardrails

These are positive limits. They are a hypothesis. Anthropic's guide tested only a negative rule, which did not stop the extra changes.

- You may merge duplicate code and fix bugs inside the area.
- Ask before you change behavior, rename a public name, or edit a file outside the area.
- Existing tests must pass without edits. A changed test counts as a behavior change.
- Add a test only where the task asks for one or the repo keeps tests for this kind of change.

## Steps

1. Write the base: the commit or branch the diff starts from. Default `main`. Run `git status` and stop if the tree has uncommitted work that is not yours. Ask first.
2. Take this stance for the whole run: you are the owner and long-term maintainer of this codebase, and its design is up to you. Work inside the Guardrails. Improve the structure in the area. Merge duplicate code. Fix related problems you find in the area.
3. Do the task. Run a real check before you stop: the tests, the type-checker, or the build. Show the output.
4. Run `/best-practices:review-diff` on the diff against the base.
5. Check the budget. Compare `git diff <base>...HEAD --name-only` with `protect`, `area`, and `max-files`. List each breach. Do not undo a breach yourself. Ask the user.
6. List every change that the task did not ask for. Use one row each: file, what changed, why, and whether behavior changed. Mark a behavior change in bold. Your own summary may leave out small changes, so build the list from `git diff <base>...HEAD --stat` and the diff itself.
7. End with three headings, in this order: **Blocked on me**, **Changed**, **Found**. Put the unrequested-change table under **Changed**.

The run is done when the check passes, the review is done, the budget check is done, and the table covers every file in the diff.

## Do not use this skill when

- Behavior must stay fixed, for example a public API or a released plugin.
- The user owns the code and wants a minimal change.
- Nobody will read the table.
