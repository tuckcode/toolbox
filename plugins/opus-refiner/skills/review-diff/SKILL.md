---
name: review-diff
description: Review the current branch diff or a pull request and list only merge-blocking problems, each with proof and a verifier check. Use for /review-diff.
disable-model-invocation: true
---

Review the diff of the current branch against its base. The base is `main` unless the arguments name another ref. If the argument is a number, review that pull request.

## Steps

1. Run `git diff <base>...HEAD`. For a pull request, run `gh pr diff <number>`. Read each changed file in full where the diff alone does not show the context.
2. List candidate problems you would block the merge for: wrong behavior, data loss, security holes, broken contracts, missing migrations. Leave out style and preference.
3. For each candidate, write:
   - the file and line
   - why it is wrong
   - how to show it fails: a test, a command, or concrete input and the wrong output
4. Check the origin of each candidate with `git blame` on the cited lines. If the lines are older than the branch point, tag the candidate **Pre-existing**. If the diff added or changed the lines, tag it **Important**.
5. Verify each candidate in a fresh context. Start one subagent per candidate. Give it only the file, line, claim, and failing input. Tell it to try to disprove the claim by reading the code path and running the check. Do not give it your reasoning.
6. Keep a candidate only if its verifier confirms it. Drop a candidate the verifier disproves. If the verifier cannot decide, list the candidate under **Not confirmed** with where it looked.

## Report

Start with a count line: `N Important, M Pre-existing, K Not confirmed`.

Then list the **Important** problems. These block the merge. Each entry has the file, line, reason, and proof.

Then list the **Pre-existing** problems in a separate section. These do not block this merge. Do not blame the author for them.

Cap nits at three. Report a nit only if it hides a real risk. Do not repeat a finding.

If nothing blocks the merge, say so in one line. Then give a plain-language summary of what the diff changes, in five lines or fewer.
