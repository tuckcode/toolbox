---
name: review
description: Review a branch diff with parallel bug hunters and a vote of verifiers. Tags each finding Important, Nit, or Pre-existing. Use for /review.
disable-model-invocation: true
---

Review the diff of the current branch. The arguments may name a base ref (default `main`) and a depth: `quick`, `standard` (default), or `deep`.

Use `deep` where one missed bug costs more than the extra review time. Use `quick` for routine changes.

## Steps

1. **Load context.** Read `CLAUDE.md`, `REVIEW.md`, and `.review/ledger.md` if they exist. Read the PR intent: the PR body, or the commit messages. Run `git diff <base>...HEAD`. Skip the paths that `REVIEW.md` lists as skip paths.
2. **Find candidates.** Start hunters in parallel, each as its own subagent. Give each the diff, the intent, and one dimension.
   - quick: 1 hunter, all dimensions.
   - standard: 3 hunters. Dimensions: logic and edge cases, callers and contracts, error handling and data.
   - deep: 5 hunters. Add: state and concurrency, tests and missing coverage.

   Each hunter returns candidates. Each candidate has a file, a line, a claim, and a concrete input that fails. For a bug fix, one hunter also checks whether the change fixes the root cause or only the symptom.
3. **Filter.** Merge duplicates. Drop findings that are only about style, diagnostics, or cleanup. Drop a finding already in the ledger as raised, fixed, wrong, or intentional.
4. **Vote.** Start verifiers with a fresh context. Give each one only the file, line, claim, and failing input. Tell it to try to disprove the claim by reading the code path and running a check.
   - quick: 1 verifier per candidate. It must confirm.
   - standard and deep: 3 verifiers per candidate. At least 2 must confirm.

   A candidate with no majority goes to **Not confirmed**, with where the verifiers looked.
5. **Tag origin.** Run `git blame` on the cited lines. If the lines come from before the branch point, tag the finding **Pre-existing**. Otherwise it is introduced by this change.
6. **Tag severity.** An introduced finding that would block a merge is **Important**. A minor finding that is real and worth a line is a **Nit**.
7. **Record.** Add each finding to `.review/ledger.md` (see `/code-review-flow:review-loop` for the format). Create the file if it does not exist.

## Report

Start with one count line: `N Important, M Nit, P Pre-existing, K Not confirmed`.

Then give these sections, in order:

1. **Important.** Each entry: file and line, why it is wrong, the failing input, the verifier votes.
2. **Nit.** At most the cap in `REVIEW.md`. Default 3.
3. **Pre-existing.** These do not block this change. Do not present them as the author's fault.
4. **Not confirmed.**

If nothing needs a fix, say that in one line. Then give a summary of what the diff changes in five lines or fewer.

Every finding must end as fixed or closed with a reason. Do not fix anything in this skill. Use `/code-review-flow:review-loop` to fix and re-review.
