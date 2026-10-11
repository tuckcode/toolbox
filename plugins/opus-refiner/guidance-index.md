# Guidance index

Each recommendation from Anthropic's "Getting the most out of Opus 5.5" post, in our own words, and where this plugin covers it. `/sync-guidance` compares this file with the live post.

Source: https://claude.dev/blog/getting-the-most-out-of-opus-5-5/
Last checked: 2026-10-11

| Section | Recommendation | Covered by |
|---|---|---|
| How to ask | State the finish line and the stop condition, then let it run | `/run-to-done` |
| How to ask | Remove "think hard" phrases | `/audit-prompts` |
| How to ask | Add follow-ups to a running task | User habit |
| How to ask | Name the design styles to avoid | `/design-avoid` |
| Long runs | Say which stops you want, including before destructive actions | `rules.md` |
| Long runs | Keep permission prompts for destructive commands | `scripts/guard-destructive.sh` |
| Long runs | Split big audits and migrations across subagents and check their evidence | `/fan-out` |
| Long runs | Keep the task list in a file | `rules.md`, `/run-to-done` |
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
| Speed | Use fast mode for back-and-forth work | User setting |
