---
name: set-effort
description: Pick an effort level and thinking setting for a task or integration, with the trade-offs. Use for /set-effort.
disable-model-invocation: true
---

Recommend an effort level for the task in the arguments. Read `models.md` in the plugin root first. Use the model that the arguments name. If none is named, ask which model.

## Starting points

API defaults differ: Fable 5.2 and Sonnet 5.5 default to `high`, Opus 5.5 and Haiku 5.5 to `medium`. Set the level explicitly.

- **Agentic coding, well-specified:** `medium`.
- **Agentic coding, hard or long:** `high`.
- **Chat and latency-sensitive work:** `medium` or `low`. Higher effort delays the first token.
- **Most other work:** `high`. This is the API default.
- **`xhigh` and `max`:** only where you measured a quality gain. They cost much more and lengthen replies.

## Rules

- Levels are recalibrated for each model. Run a fresh sweep on your own evals. Do not carry a setting over from an older model.
- To get less thinking, lower the effort level. A "think less" line in a prompt is not reliable.
- Changing top-level `effort` between API requests invalidates the prompt cache. Use per-message effort (beta) to change it mid-conversation.
- Thinking counts toward `max_tokens`. Leave room for it. For agentic coding, use the model maximum and stream.
- Sonnet 5.5 only: `thinking: {"type": "between_tools"}` is the lowest thinking setting. It works at `high` or below. It cannot change effort mid-conversation.
- Fable 5.2 and Opus 5.5 think by default. Haiku 5.5 allows `thinking: {"type": "disabled"}` at `high` or below.
- For JSON answers that need working out, use adaptive thinking. Add "Think the problem through before you answer." or use `xhigh`.
- Lower effort has a cost. At `low` and `medium`, every model stops early more often, and Sonnet 5.5 and Haiku 5.5 skip real checks more often. Say this when you recommend `low` or `medium`. Add the early-stop text from `models.md`, and point to `/best-practices:run-to-done` for long tasks.

## Output

Give the recommended level, the thinking setting, and one line on why. Name each prompt line from `rules.md` or `models.md` that the task needs. State what you could not confirm against the live docs, and where you looked.
