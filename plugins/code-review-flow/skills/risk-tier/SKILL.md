---
name: risk-tier
description: Pick a risk tier (Low, Medium, High) from the change itself and say how many human approvals it needs. Use for /risk-tier.
disable-model-invocation: true
---

Classify the diff of the current branch. The base is `main` unless the arguments name another ref.

The change sets the tier. The author does not. Start strict and loosen only with evidence.

## Steps

1. Read `git diff <base>...HEAD` and the sensitive paths in `REVIEW.md` and `CODEOWNERS`.
2. **Question 1: what tier is this change?**
   - **Low:** docs, copy, internal-only features, additive changes behind a flag.
   - **Medium:** ordinary product changes, and changes to sensitive areas such as caching, auto-update, or system prompts.
   - **High:** the highest-risk code: billing, auth, installers, data migrations, secrets handling. Also any path that `REVIEW.md` marks as always needing two people.
3. **Question 2: does this change need a person even if its tier says no?** Answer yes if any of these is true:
   - it touches a sensitive path from `REVIEW.md` or `CODEOWNERS`
   - it touches a CI workflow file
   - it adds or changes a dependency or an install script
   - it deletes data or changes a stored format
   - the diff is large and no tests changed
4. Give the result as a short table:

   | Tier | Human approvals | Why |
   |---|---|---|

   Low with no yes in question 2 needs none once `/code-review-flow:review` and `/code-review-flow:security-pass` are clear. Medium needs one person. High needs two.
5. List the file and line behind each reason.

## Rules

- An agent approval never fills a human slot.
- The person who prompted an agent counts as one required reviewer.
- An approval covers one commit. New commits that you cannot vouch for need a new approval.
- Lighter paths apply only to authors the repo trusts. If you cannot tell, use the next tier up.
