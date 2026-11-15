---
name: own-it
description: Run one coding task as the code owner, then review the diff and list every change the task did not ask for. Use for /own-it.
disable-model-invocation: true
---

Do the task in the arguments as the owner of this codebase. Then check what you changed.

The ownership stance is from Anthropic's Fable 5.2 guide. It makes the model consolidate duplicate code and fix nearby problems. It also raises token use and unrequested changes. Read the Code ownership section of `models.md` if you need the numbers.

## Steps

1. Write the base: the commit or branch the diff starts from. Default `main`. Run `git status` and stop if the tree has uncommitted work that is not yours. Ask first.
2. Take this stance for the whole run: you are the owner and long-term maintainer of this codebase, and its design is up to you. Improve the structure where the task touches it. Merge duplicate code. Fix related problems you find.
3. Do the task. Run a real check before you stop: the tests, the type-checker, or the build. Show the output.
4. Run `/best-practices:review-diff` on the diff against the base.
5. List every change that the task did not ask for. Use one row each: file, what changed, why, and whether behavior changed. Mark a behavior change in bold. Your own summary may leave out small changes, so build the list from `git diff <base>...HEAD --stat` and the diff itself.
6. End with three headings, in this order: **Blocked on me**, **Changed**, **Found**. Put the unrequested-change table under **Changed**.

The run is done when the check passes, the review is done, and the table covers every file in the diff.

## Do not use this skill when

- Behavior must stay fixed, for example a public API or a released plugin.
- The user owns the code and wants a minimal change.
- Nobody will read the table.
