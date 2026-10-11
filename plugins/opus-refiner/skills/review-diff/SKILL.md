---
name: review-diff
description: Review the current branch diff or a pull request and list only merge-blocking problems, each with proof. Use for /review-diff.
disable-model-invocation: true
---

Review the diff of the current branch against its base. The base is `main` unless the arguments name another ref. If the argument is a number, review that pull request.

1. Run `git diff <base>...HEAD`. For a pull request, run `gh pr diff <number>`. Read each changed file in full where the diff alone does not show the context.
2. List only problems you would block the merge for: wrong behavior, data loss, security holes, broken contracts, missing migrations. Leave out style and preference.
3. For each problem, give:
   - the file and line
   - why it is wrong
   - how to show it fails: a test, a command, or concrete input and the wrong output
4. Confirm each problem before you report it. Read the code path. Run the check when it is cheap.

If nothing blocks the merge, say so in one line. Then give a plain-language summary of what the diff changes, in five lines or fewer.
