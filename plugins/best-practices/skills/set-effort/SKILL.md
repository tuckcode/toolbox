---
name: set-effort
description: Pick an effort level and thinking setting for a task or integration, with the trade-offs. Use for /set-effort.
disable-model-invocation: true
---

Recommend an effort level for the task in the arguments. Base it on Anthropic's guidance for the current Claude models.

## Starting points

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
- `thinking: {"type": "between_tools"}` is the lowest thinking setting. It works at `high` or below. It cannot change effort mid-conversation.
- For JSON answers that need working out, use adaptive thinking. Add "Think the problem through before you answer." or use `xhigh`.
- At `low` and `medium`, the model may stop to check in or skip a real verification. Add the carry-through and verification lines from `rules.md`.

## Output

Give the recommended level, the thinking setting, and one line on why. Name each prompt line from `rules.md` that the task needs. State what you could not confirm against the live docs, and where you looked.
