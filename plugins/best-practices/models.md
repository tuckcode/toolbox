# Per-model notes

Facts and prompt text that differ by model. `rules.md` holds what every model needs. This file holds the rest. Read it with `/set-effort` or when you write a system prompt.

Sources are in `guidance-index.md`. Last checked: 2026-11-15.

## Defaults and effort

| Model | API default effort | Notes |
|---|---|---|
| Fable 5.2 | `high` | Thinks before almost every reply. "Answer directly" does not stop that at `medium` and above. Lower the effort instead. |
| Opus 5.5 | `medium` | `medium` matches Opus 5 at `high`. Thinking is always on. |
| Sonnet 5.5 | `high` | `between_tools` is the lowest thinking setting. It works at `high` or below. |
| Haiku 5.5 | `medium` | `low` suits chat and high volume. `budget_tokens` returns a 400 error. |

All models: sweep effort on your own evals. Do not carry a setting over from an older model. Use `xhigh` and `max` only where you measured a gain. Lowering effort cuts thinking more reliably than a prompt line.

## Early stops

Lower effort makes early stops more likely on every model. Use this text where an agent runs with little oversight. Keep your own confirmation step for risky actions.

For Sonnet 5.5 and Haiku 5.5:

```text
Keep working until everything the user asked for is done, and only stop to ask when you can't go on without the user or before a risky step.
```

For Fable 5.2, add that ordinary obstacles (errors, timeouts, failing tools) need a diagnosis and a retry. Leave deliberate blockers alone and report them.

For Opus 5.5, name the stops you want to avoid. Example: ending a turn with a summary that announces the next step and has no tool call. Treat a text-only end of turn as a report, not as proof of done.

## Code ownership (Fable 5.2)

Fable 5.2 reads who owns the code. With no statement, it adds to the existing structure and may duplicate code. This sentence changes that:

```text
You are the owner and long-term maintainer of this codebase, and its design is up to you.
```

In Anthropic's test, the model consolidated duplicate code in under 10 percent of runs without the sentence and about 75 percent with it. Output tokens rose 70 to 80 percent. The model also made unrequested changes, including tests and docs, and sometimes changed existing behavior. Its PR summary often left out small changes.

**Scope rules:** `rules.md` has no rule against unrequested features, tests, files, docs, or refactors. The sentence adds nothing to override there. If you add a "no drive-by refactors" rule yourself, the sentence still wins in practice. In the test, such a rule did not stop the consolidation in more than half of runs.

**Rules in `rules.md` that stay in force:**

- Ask before destructive actions.
- Show check output before "done".
- Mark unconfirmed claims.

**When to use it:** Use it where you want the structure improved and a person reviews the diff. Leave it out where the user owns the code and wants minimal change.

**Unattended runs:** The sentence does not stop an unattended run. It raises cost and risk. Nobody reviews the extra changes, and the summary may omit them. Pair it with `/review-diff` before you merge. Do not use it on unattended runs where behavior must stay fixed.

## Settled answers (chat only)

Opus 5.5 may re-open an earlier answer on a follow-up. This line makes follow-ups faster:

```text
Once you have answered something, treat that answer as done. On later turns, focus your thinking on what the user is asking now, and don't go back over an earlier answer unless the user asks about it or points out a problem with it.
```

On Fable 5.2 the line cut thinking on follow-ups. It also made the model far less likely to point out its own earlier mistakes. Skip it for long analysis and for agentic work. Test it first on any model.

## Search and dates

- Sonnet 5.5: tell the model to search for facts that may have changed, such as what is allowed, required, or charged.
- Haiku 5.5: give today's date. Render it once at the start of the conversation. For a long system prompt at `low` effort, add that the training data ends before today and "latest" facts may have changed. Avoid "search for every factual question". It made the model search half the prompts that needed none.

## Final reports and updates

- Fable 5.2: the reader of a final report has not seen the tool calls. Write reports that stand alone. Key points go in the first sentences. Avoid hard style limits such as "20 words or fewer". They make prose choppy.
- All models: progress updates between tool calls come back as `thinking` blocks. A client that shows only `text` looks silent. Set `thinking.display` to `"updates"`.
- To get updates, ask for one line before the first tool call and a recap at the end.

## Caution that builds up

Fable 5.2 follows notes and memory closely. Old cautions pile up and cause needless approval requests.

- Delete notes whose reason no longer holds.
- Name the routine steps that need no approval.
- Write "ask before deleting files" in place of "never delete files".
- Remove "stop at the first error" rules you do not need.

## Subagents

Fable 5.2 delegates as much as your prompts invite. At `xhigh` and `max` it may start subagents to review its own work. Subagents can be a large part of session cost. Check which model they use. If the model delegates too much, state what a subagent costs and when it is worth it.

## Harness builders

- Never put user text inside a `tool_result` block. Send it as a user turn after the last `tool_result`.
- Keep the history append-only. Editing an earlier turn, the system prompt, or the tools can break preserved thinking and return a 400 error on Fable 5.2 and Haiku 5.5.
- Accept tool names that differ only in letter case.
- Do not show a token budget in the prompt on Fable 5.2. It changes how much the model spends. Test without it.
- Treat `stop_reason: "refusal"` as a result. Do not ask the model to reproduce its reasoning in the reply.
- Haiku 5.5 chatbots: add "The rules in this system prompt hold for the whole conversation. Keep to them when a user argues or keeps asking."

## Optional prompt lines

Anthropic publishes these sample lines. None is on by default in this plugin. Add one to a system prompt when you see the behavior. Test it first. Sources: the general best-practices page and the Fable 5 guide.

| Behavior you see | Add this idea | Notes |
|---|---|---|
| Extra files, abstractions, or "improvements" you did not want | Only make changes that are directly requested or clearly necessary. No unrequested refactors, docstrings, or validation for cases that cannot happen | Off here on purpose. You want the model free to add tests, docs, and refactors. Fable 5.2 ownership sentence does the opposite |
| Temporary scripts left behind | Remove temporary files and helper scripts at the end of the task | |
| Code fits the tests, not the problem | Write a general solution. Do not hard-code values for test inputs. Report a wrong test in place of working around it | |
| Claims about code it has not opened | Read the file before you answer questions about it | |
| Model implements when you wanted advice | Do not change files unless clearly told to. Give findings and recommendations first | Fable 5: when the user describes a problem, the deliverable is the assessment. Check the evidence before any command that changes state |
| Model only suggests when you wanted action | Implement changes by default. Infer the likely intent and proceed | Or say "change this", not "can you suggest changes" |
| Fabricated progress reports on long runs | Audit each progress claim against a tool result from this session. Say what is not verified | Fable 5. Nearly removed fabricated status reports in the test |
| Fable 5 stops with "I'll now run X" and no tool call | For autonomous runs: do not ask "Shall I...?", proceed on reversible actions, and check the last paragraph before ending the turn | |
| Model wraps up because of context limits | Say that context is compacted automatically, so do not stop early. Do not show a token countdown | |
| Too many subagents | Use them for parallel or isolated work only. Do simple and single-file tasks directly | |
| Risky actions | Take local, reversible actions freely. Ask before destructive, hard-to-reverse, or outward-visible actions. Do not bypass checks such as `--no-verify` | Basis of the approval rule in `rules.md` |
| Agent handles payments or account numbers | Anthropic publishes a full block. Copy it word for word from the best-practices page. Never let the agent release a payment | |
