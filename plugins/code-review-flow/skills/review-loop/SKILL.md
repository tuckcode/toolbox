---
name: review-loop
description: Run review, fix, and re-review rounds that converge. Caps rounds at three, re-reviews only new diffs, fixes whole bug classes, and logs rounds-to-pass. Use for /review-loop.
disable-model-invocation: true
---

Take the current branch through review and fix rounds until it passes or the cap stops the loop. The arguments may name a base ref and a depth for round 1 (`quick`, `standard`, `deep`).

An agent author and an agent reviewer can keep each other busy for dozens of rounds. This skill makes the loop end.

## A round

One round is one review followed by one set of fixes.

1. **Review.** Follow `/code-review-flow:review`. Add `/code-review-flow:security-pass` when the change touches a sensitive path.
   - Round 1: review the whole branch diff.
   - Round 2 and 3: review only the diff since the last round (`git diff <last-round-commit>..HEAD`).
2. **Fix.** Fix each Important finding. Fix a Nit only when it is cheap. Do not fix Pre-existing findings in this change. List them in the final report.
3. **Fix the class.** When a finding names a pattern, search the repo for every instance. Fix all of them in the same round. Add the class to the ledger, not only one line.
4. **Answer every finding.** Each finding ends as `fixed`, or closed with a reason: `wrong`, `intentional`, or `dont-care`. Do not leave one open.
5. **Check.** Run the repo checks. Show the output.
6. **Record.** Commit the fixes so the next round can diff against them. Ask the user first if the repo has no commit rule for this.

## Rules

- Do not post a finding again if the ledger already holds it.
- After round 3, stop. Do not start round 4. Tell the user that the approach may be wrong. Give what each round found and why findings keep coming. Ask whether to change the approach.
- Stop earlier when a round finds no Important finding.
- Count rounds-to-pass. A branch that passes in round 1 or 2 is healthy.

## The ledger

Keep `.review/ledger.md`. Create it if needed. One table row per finding:

| id | round | area | file:line | class | severity | origin | status | reason |
|---|---|---|---|---|---|---|---|---|

- `severity`: Important, Nit.
- `origin`: introduced, pre-existing.
- `status`: open, fixed, wrong, intentional, dont-care.

At the end, add one summary line: `rounds-to-pass: N`, plus counts by status. A high `wrong` and `dont-care` count means the reviewer is noisy. Report that to the user.
