# Guidance index

Each recommendation from Anthropic's "Getting the most out of Opus 5.5" post, in our own words, and where this plugin covers it. `/sync-guidance` compares this file with the live post.

Source: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/
Last checked: 2026-10-17

| Section | Recommendation | Covered by |
|---|---|---|
| How to ask | State the finish line and the stop condition, then let it run | `/run-to-done` |
| How to ask | Remove "think hard" phrases | `/audit-prompts` |
| How to ask | Add follow-ups to a running task | User habit |
| How to ask | Name the design styles to avoid | `/design-avoid` |
| How to ask | Ask a specific question about an attached image | User habit |
| Long runs | Say which stops you want, including before destructive actions | `rules.md` |
| Long runs | Keep permission prompts for destructive commands | `scripts/guard-destructive.sh` |
| Long runs | Split big audits and migrations across subagents and check their evidence | `/fan-out` |
| Long runs | Keep the task list in a file | `rules.md`, `/run-to-done` |
| Long runs | Reply "continue" when a run pauses to offer more | User habit (`rules.md` tells the model to keep going) |
| Long runs | When pairing, ask for a one-line plan first and a short recap at the end | `rules.md` |
| Checking | Read what it needs from you first; set end-of-run headings | `rules.md` |
| Checking | Ask it to review the diff or PR before a human does | `/review-diff` |
| Checking | Ask it to mark what it could not confirm | `rules.md` |
| Claude apps | Check the model picker | User habit |
| Claude apps | Attach the chart or screenshot itself | User habit |
| Claude apps | Ask it to check a long document for contradictions | `/check-doc` |
| Claude apps | Ask for the finished file | User habit |
| Claude apps | In a project, say when answers are settled | `rules.md` (Claude Code only) |
| Flags | Set "switch models when flagged" (apps setting, or /config in Claude Code) | User setting |
| Flags | In apps, switch back with the model picker or start a new chat | User habit |
| Flags | In Claude Code, press Esc twice, run /model, or run /feedback | User habit |
| Flags | Do not ask it to show its reasoning | `/audit-prompts` |
| Flags | Ask for a three-sentence reason in place of its reasoning | `rules.md` |
| Speed | Use fast mode for back-and-forth work. `/fast` turns it on. It needs extra usage and costs more per token | User setting |

## Second source: code review at Anthropic

Source: https://claude.dev/blog/solving-code-review-at-anthropic/
Last checked: 2026-10-17 (read through a summarizing fetch, not the raw page)

| Section | Recommendation | Covered by |
|---|---|---|
| AI review | Verify each finding with a separate group before you post it | `/review-diff` |
| AI review | Tag findings Important, Nit, or Pre-existing | `/review-diff` |
| Reviewer quality | Cap rounds at three, re-review only the new diff, fix the bug class | `/run-to-done` |
| Verification | Show command output, do not claim success | `rules.md`, `/run-to-done` |
| Not covered | `REVIEW.md` template, PR template, incident evals, team approval tiers | Not built |
