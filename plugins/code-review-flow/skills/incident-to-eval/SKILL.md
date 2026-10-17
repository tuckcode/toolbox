---
name: incident-to-eval
description: Turn a past incident, revert, or fix-forward into a regression case for the reviewer. Use for /incident-to-eval.
disable-model-invocation: true
---

Save one incident as a test case that the reviewer must catch. The arguments name the incident: a revert commit, a fix-forward commit, or a PR.

## Steps

1. Find the commit that introduced the bug. Use the revert, the fix-forward, `git log -S`, and `git blame` on the fixed lines. Show the evidence for your choice.
2. Create `.review/evals/<short-id>/case.md` with these fields:
   - `introducing_commit`: the full hash of the change that caused the incident
   - `base`: its parent commit
   - `bug`: the file, the line, and one sentence on what is wrong
   - `failing_input`: a concrete input or state that shows the bug
   - `fix_commit`: the revert or fix-forward
   - `status`: `unconfirmed`
   - `confirmed_by`: empty
3. Do not set `status` to `confirmed`. A person who knows that code must confirm the bug and where it lives. Tell the user which person or role should confirm it.
4. Add one clean control. Find a merged change near the same code that caused no incident. Record it in `.review/evals/<short-id>/control.md` with its commit hash. The reviewer should report nothing harmful on it.
5. Add one row to `.review/evals/index.md`: id, date, area, status.

The eval set grows with each incident. Run `/code-review-flow:eval-reviewer` after you change review prompts, tools, or the model.

Do not change code in this skill.
