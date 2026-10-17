---
name: run-to-done
description: Frame a long task so it runs to a clear finish line without check-ins. Use for /run-to-done.
disable-model-invocation: true
---

Turn the task in the arguments into a run with a finish line. Then do the run.

## Steps

1. Write the **done** line: the checkable state that ends the run. Examples: "the test suite passes", "every endpoint uses the new client and the old client is deleted". If the task gives no checkable state, propose one in one line and start work in the same message.
2. Write the **stop** line: the conditions that need the user. Default: a failure you cannot explain, a destructive action, or a fourth review-fix round (see Round cap).
3. Write `TASKS.md` at the repo root. One checkbox per item. Put the done line at the top.
4. Work through the list. Tick each item when it is done. Add new items when you find them. Put status notes in the same message as the next action.
5. Before you stop, check the done line against the real state: run the tests, grep for old names, open the output. Show the command output. Do not claim success without it.
6. End with three headings, in this order: **Blocked on me**, **Changed**, **Found**.

The run is done when the done line is true and every box in `TASKS.md` is ticked or marked as blocked with a reason.

## Round cap

A review-fix round is one pass of review followed by one pass of fixes. Count the rounds in `TASKS.md`.

- Rounds 1 to 3: fix the findings.
- After round 1, review only the new diff. Do not review the whole branch again.
- Fix the whole bug class. When a finding names a pattern, search for every instance and fix all of them in the same round.
- Do not raise a finding again after it was raised. Skip findings that predate the branch. List them under **Found**.
- After round 3, stop. Do not start round 4. Tell the user that the approach may be wrong. Say what each round found and why the findings keep coming. Ask whether to change the approach.
