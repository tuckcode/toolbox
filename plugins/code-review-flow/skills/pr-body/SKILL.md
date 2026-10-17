---
name: pr-body
description: Draft a PR description with Testing, Risk, and How to revert sections, using real evidence. Use for /pr-body.
disable-model-invocation: true
---

Write the pull request body for the current branch. The base is `main` unless the arguments name another ref.

## Steps

1. Read `git log <base>..HEAD` and `git diff <base>...HEAD`. State the intent in two sentences or fewer.
2. Run `/code-review-flow:risk-tier` logic on the diff. Use its tier and reasons.
3. Collect the evidence for the Testing section. Use output from this session or run the checks now. Do not write "tested" without a command and a result.
4. Write the body with these sections:
   - **What and why.** The intent. Link the issue if one exists.
   - **Testing.** Each check as a command and its result. For a UI change, name the screenshot. List what you did not test.
   - **Risk.** The tier, the reasons, and the required human approvals.
   - **How to revert.** The exact step: the revert command, the flag to switch off, or the migration to roll back. Say whether a revert needs a deploy.
   - **Review status.** Counts from the last `/code-review-flow:review` and `/code-review-flow:security-pass`. If you have not run them, say so.
5. End with a line the person must tick: `[ ] I read the evidence above and I own this change.`

Print the body. Create the PR only if the user asks. The person who asked for the change signs off on this text. Do not tick the box yourself.
