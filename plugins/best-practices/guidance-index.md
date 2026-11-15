# Guidance index

Each recommendation from Anthropic's published guidance, in our own words, and where this plugin covers it. `/sync-guidance` compares this file with the live sources.

## First source: Opus 5.5

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
| Claude apps | In a project, say when answers are settled | `models.md` (chat only. Risky on Fable 5.2) |
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
| Not covered | `REVIEW.md` template, PR template, incident evals, team approval tiers | Built in the `code-review-flow` plugin |

## Third source: Prompting Claude Sonnet 5.5

Source: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5-5
Last checked: 2026-11-15 (raw page)

| Section | Recommendation | Covered by |
|---|---|---|
| Effort | Levels are recalibrated. Sweep on your own evals. Start at `high`, or `medium` for agentic work | `/set-effort` |
| Effort | Lower effort to get less thinking. A "think less" prompt is unreliable | `/set-effort`, `/audit-prompts` |
| Effort | Leave room in `max_tokens` for thinking. Use per-message effort to keep the cache | `/set-effort` |
| Initiative | Keep working until done. Stop to ask only when blocked or before a risky step | `rules.md`, `models.md` |
| Scope | Do not add unrequested features, tests, files, or docs. Mention them at the end | Not adopted. The maintainer wants the model free to add them |
| Scope | At `xhigh` and `max`, do not start extra review rounds or reviewer subagents | `rules.md` |
| Scope | For ideas or plans, give that and stop | `rules.md` |
| Thinking | `between_tools` is the lowest thinking setting. Not for reasoning tasks without tools | `/set-effort` |
| JSON output | Add "Think the problem through before you answer." Or use `xhigh`. Parse the last JSON value | `/set-effort` |
| Progress | Show updates between tool calls. Remove "hold all findings" rules | `/audit-prompts` |
| Tool use | Search for facts that may have changed. Remove "minimize tool calls" | `rules.md`, `/audit-prompts` |
| Mid-turn messages | Send user text as a user turn, never inside a `tool_result` | Harness builders only. Not built |
| Verification | Run a real check before "done". Install declared dependencies if missing | `rules.md`, `/run-to-done` |
| Tool calls | Accept tool names that differ only in letter case | Harness builders only. Not built |
| Visual input | Give crop or zoom tools for dense charts | User habit |
| Refusals | Do not ask for reasoning in the reply. Read summarized thinking blocks | `rules.md`, `/audit-prompts` |

## Fourth source: Prompting Claude Fable 5.2

Source: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-2
Last checked: 2026-11-15 (raw page)

| Section | Recommendation | Covered by |
|---|---|---|
| Effort | Default `high`. Rerun the sweep. "Answer directly" does not stop thinking at `medium` and above | `models.md`, `/set-effort`, `/audit-prompts` |
| Finish the task | Add text that works through ordinary obstacles and leaves deliberate blockers alone | `models.md` |
| Approvals | Say exactly what to approve. Do not list broad groups such as "messages to people outside" | `rules.md` |
| Code ownership | The owner sentence makes the model consolidate code. It raises tokens and unrequested changes | `models.md` |
| Progress | Set `display: "updates"`. Ask for an opening line and a recap | `models.md` |
| Subagents | State the cost of a subagent. Check the subagent model | `models.md` |
| Caution | Delete old notes. Write "ask before" in place of "never" | `models.md`, `/audit-prompts` |
| Earlier prompts | Remove "think less", hard style limits, "treat as done" lines, and token budgets in the prompt | `models.md`, `/audit-prompts` |
| Harness | Keep history append-only. Preserved thinking breaks on edits | `models.md` |
| Reports | Write for a low-context reader | `models.md` |

## Fifth source: Prompting Claude Opus 5.5

Source: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5-5
Last checked: 2026-11-15 (raw page)

| Section | Recommendation | Covered by |
|---|---|---|
| Effort | Default `medium`. `xhigh` and `max` think more than on Opus 5 | `models.md`, `/set-effort` |
| Unattended runs | Treat a text-only end of turn as a report. Keep a task checklist. Cap automatic continuations at two or three | `models.md`, `/run-to-done` |
| Updates | Set `display: "updates"`. Ask for an opening line and a recap | `models.md` |
| Multiapp work | Tell the model to explore all relevant sources before it acts | Harness builders. Not built |
| Time signals | Add elapsed time against a budget in multiagent harnesses | Harness builders. Not built |
| Chat | Remove "think carefully". Optional "treat answers as done" line | `models.md`, `/audit-prompts` |
| Pasted text | Wrap pasted text in tags with a random id | Harness builders. Not built |
| Visual input | Use crop or image tools for dense charts | User habit |
| Frontend | Name the patterns to avoid | `/design-avoid` |

## Sixth source: Prompting Claude Haiku 5.5

Source: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-haiku-5-5
Last checked: 2026-11-15 (raw page)

| Section | Recommendation | Covered by |
|---|---|---|
| Effort | Default `medium`. `low` for chat. `budget_tokens` returns a 400 error | `models.md`, `/set-effort` |
| Search | Give today's date. Add a "training data ends" line for long prompts | `models.md` |
| JSON with tools | With thinking off, use adaptive thinking or force the tool call | `models.md` |
| Early stops | Add the keep-working text in long agent prompts | `models.md` |
| Verification | Run a real check before "done" | `rules.md` |
| Chatbots | Add the "rules hold for the whole conversation" line | `models.md` |
| Reasoning in replies | Use adaptive thinking and `medium` | `models.md` |
