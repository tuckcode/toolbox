---
name: verify-work
description: Run the repo checks on your own change, show the output, and get a fresh-context review of the diff before you open a PR. Use for /verify-work.
disable-model-invocation: true
---

Verify the work on the current branch before anyone else looks at it. The base is `main` unless the arguments name another ref.

## Steps

1. Find the checks. Read `CLAUDE.md`, `package.json`, `Makefile`, CI files, and `REVIEW.md`. List the commands for tests, build, types, and lint. If you find none, say so and propose the smallest check that could fail.
2. Run each check that is cheap enough to run now. Show the command and the output. Do not write "passes" without the output.
3. For a UI change, run the app and take a screenshot. Compare it with the design or the previous state. Show the screenshot. If you cannot run the app, say so.
4. For a bug fix, show the failing case before the fix and the passing case after the fix. Use `git stash` or a worktree only if the user agrees.
5. Start one subagent with a fresh context. Give it the diff, the PR intent, `CLAUDE.md`, and `REVIEW.md`. Do not give it your reasoning. Ask it for problems that would block a merge, each with a file and a line.
6. Check each problem the subagent reports. Read the code path. Drop a problem you can disprove. Fix a problem you can confirm. Run the checks again after each fix.
7. If the same kind of problem keeps appearing, fix it at the source. Add a line to `REVIEW.md` or `CLAUDE.md`, or add a lint rule. Ask the user before you edit those files.

## Report

Give a table: check, command, result, evidence. Then list **Fixed**, **Not fixed**, and **Not confirmed**. For each unconfirmed claim, say where you looked.

The work is verified when every check you could run shows output and the fresh-context review has no confirmed problem left open.
