---
name: explain-slice
description: Write an explainer for one module or path so you learn the code without reading every diff. Use for /explain-slice.
disable-model-invocation: true
---

Review spreads knowledge of the code. When machines read most diffs, ask for an explainer of the exact slice you are about to change. The arguments name a path, a module, or a feature.

## Steps

1. Read the current code in the slice. Do not rely on old docs. Follow entry points, callers, and the main data path.
2. Read `git log --stat -n 20 -- <path>` for recent change.
3. Write the explainer with these parts:
   - **Purpose.** What the slice does, in three sentences or fewer.
   - **Entry points.** Where control comes in, each with a file and a line.
   - **Data flow.** How data moves through the slice, step by step.
   - **Invariants.** Rules the code relies on, and where each is enforced.
   - **Gotchas.** Surprising behavior and known weak spots.
   - **Recent change.** What changed lately and why, from the log.
   - **Careful here.** Where a change is most likely to break something.
4. Cite a file and a line for each claim. Mark each claim you could not confirm, and say where you looked.
5. Print the explainer. Save it only if the user asks. Offer to build a small visual of the data flow if the user learns better that way.

Do not change code in this skill.
