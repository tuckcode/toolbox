---
name: adopt-review
description: Audit a repo against the adoption checklist from the Claude Code team's review process and say what is missing. Use for /adopt-review.
disable-model-invocation: true
---

Check this repo against the review process checklist. This skill only reads. It changes nothing.

## Steps

1. Look for each item below. Use the repo files first. Use `gh` only for read-only queries, and only if the repo has a GitHub remote.
2. For each item, record **present**, **missing**, or **unknown**. Give the evidence: a file path, a command output, or where you looked.
3. Give the result as one table: item, status, evidence, fix.

## Checklist

**Before the PR**
- A short `CLAUDE.md` with runnable checks. Fix: `/code-review-flow:init-review`.
- Hooks or scripts that run the formatter and linter.
- A `REVIEW.md`. Fix: `/code-review-flow:init-review`.
- A habit of `/code-review-flow:verify-work` before a PR.

**On every PR**
- CI that runs lint, types, tests, and a build, and is required.
- A PR template with Testing, Risk, and How to revert. Fix: `/code-review-flow:pr-body`.
- An AI review on the repo.
- A security review that blocks merge. Fix: `/code-review-flow:security-pass`.
- A rule that every review thread is resolved before merge.
- A round cap. Fix: `/code-review-flow:review-loop`.

**Approval**
- Written risk tiers. Fix: `/code-review-flow:risk-tier`.
- `CODEOWNERS` that covers auth, billing, CI, release, and installers.
- Branch protection. Approvals dismissed on new commits. No bot approval in place of a human.

**Merge and after**
- A merge queue.
- Feature flags and a staged release path.
- A one-step rollback.
- Incidents saved as eval cases. Fix: `/code-review-flow:incident-to-eval` and `/code-review-flow:eval-reviewer`.
- A measure of human time per PR, with revert and incident rates as the guardrail.

## After the table

Give the three changes with the most value, in order. Start with the ones this plugin can do. Say which items need a team tool (merge queue, flags, branch protection) that this plugin cannot set up.
