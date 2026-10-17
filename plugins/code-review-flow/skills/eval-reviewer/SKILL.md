---
name: eval-reviewer
description: Score the review flow against saved incident cases and clean controls. Use after you change review prompts, tools, or the model. Use for /eval-reviewer.
disable-model-invocation: true
---

Run the reviewer against `.review/evals/` and report recall and false alarms.

## Steps

1. Read `.review/evals/index.md` and each `case.md`. Use only cases with `status: confirmed`. List the unconfirmed cases and skip them.
2. For each case, get the diff with `git diff <base> <introducing_commit>`. Do not check out other commits. Do not change the working tree.
3. For each diff, start a subagent. Tell it to follow `/code-review-flow:review` at `standard` depth on that diff only. Give it no hint about the bug.
4. Score the result:
   - **Hit:** a confirmed Important finding names the same file and the same defect as the case.
   - **Miss:** no such finding.
5. For each `control.md`, run the same review. Count each Important finding that would lead someone to make a harmful change. That is a **false alarm**.
6. Report:

   | Case | Result | Finding or reason |
   |---|---|---|

   Then give: `recall = hits / confirmed cases`, `false alarms = N across M controls`, and rounds-to-pass if you ran the loop.
7. Read `.review/evals/scores.md` if it exists. Compare with the last row. Append a new row: date, what changed in the reviewer, recall, false alarms.

Priority: catch real bugs first, then cut review rounds. Keep a reviewer change only if recall rose or held with fewer false alarms. If recall fell, say so and name the change to undo.

Fewer than 5 confirmed cases is a weak signal. Say so in the report.
