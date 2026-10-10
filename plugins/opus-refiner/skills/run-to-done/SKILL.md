---
name: run-to-done
description: Frame a long task so it runs to a clear finish line without check-ins. Use for /run-to-done.
disable-model-invocation: true
---

Turn the task in the arguments into a run with a finish line. Then do the run.

## Steps

1. Write the **done** line: the checkable state that ends the run. Examples: "the test suite passes", "every endpoint uses the new client and the old client is deleted". If the task gives no checkable state, propose one in one line and start work in the same message.
2. Write the **stop** line: the conditions that need the user. Default: a failure you cannot explain, or a destructive action.
3. Write `TASKS.md` at the repo root. One checkbox per item. Put the done line at the top.
4. Work through the list. Tick each item when it is done. Add new items when you find them. Put status notes in the same message as the next action.
5. Before you stop, check the done line against the real state: run the tests, grep for old names, open the output.
6. End with three headings, in this order: **Blocked on me**, **Changed**, **Found**.

The run is done when the done line is true and every box in `TASKS.md` is ticked or marked as blocked with a reason.
