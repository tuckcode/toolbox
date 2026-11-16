# Prompt-writing principles

Rules of thumb from the general best-practices page. The page introduces them as techniques for all current Claude models. The sentence under its "General principles" heading names only the Fable and Mythos models, so the list there may be out of date. This plugin applies the rules to Opus 5.5, Sonnet 5.5, Fable 5.2, and Haiku 5.5.

A technique that names a model was measured on that model. Re-check it on your own tasks before you use it on another model. A few rules come from the older Fable guides and are marked. Skills read this file. The session hook does not load it.

Sources are in `guidance-index.md`. Last checked: 2026-11-15.

## Say what you want

- **Colleague test.** Show the prompt to a person with no context on the task. If that person would be confused, Claude will be too.
- **Ask for extras directly.** Claude does what the prompt says. If you want more than the task strictly needs, say so.
- **Give the reason.** A short reason behind a rule lets Claude apply it to cases you did not list. Fable 5 also does better when the prompt states the intent behind a request.
- **Say what to do, not what to avoid.** Write "write in flowing prose paragraphs" in place of "do not use markdown".
- **Number the steps** when order or completeness matters.
- **State the scope.** Write "apply this to every section, not just the first". Say whether an instruction covers one item or all.
- **Describe the exact output.** Name the format, the length, and the constraints.

## Structure

- **Use examples.** Use 3 to 5. Make them relevant, diverse, and wrapped in `<example>` tags so Claude does not mistake them for instructions.
- **Use XML tags** to separate instructions, context, examples, and input. Keep tag names consistent.
- **Match the prompt style to the output style.** A prompt without markdown tends to give output with less markdown.
- **Set a role** in one sentence in the system prompt.

## Long inputs

- Put long documents at the top, above the question. Put the question at the end. In tests this raised quality by up to 30 percent on multi-document tasks.
- Wrap each document in `<document>` tags with `<source>` and `<document_content>`.
- For long documents, ask Claude to quote the relevant parts first, then answer.

## Long work

- **Keep state in files and git.** Use a structured file such as `tests.json` for status and a plain notes file for progress.
- **Write the tests first** and tell Claude not to remove or edit them to make a run pass.
- **Preserve on compaction.** When you write a summary prompt, list what must survive: problems and how they were solved, options set aside and why, decisions and constraints in the user's exact words, current state, open items, and hard-to-rebuild details such as names, numbers, and dates. (Fable 5.1 guide.)
- **Prefer small edits.** Ask Claude to edit a file in place and not rewrite it, unless most of the file changes. (Fable 5.1 guide.)
- **Start a fresh context** when state lives on disk. Say how to start: read `progress.txt`, `tests.json`, and the git log.

## Tool use

- Claude acts when the prompt says to act. "Can you suggest changes" gets suggestions. "Change this function" gets a change.
- Soften shouting. Write "use this tool when..." in place of "CRITICAL: you MUST use this tool".
- Independent tool calls can run in parallel. Say so if you want it. Dependent calls must run in order. Never guess a missing parameter.

## Reduce errors

- Tell Claude to read a file before it answers about it.
- Ask Claude to report what it could not verify.
- Ask for a short explanation or a summary of the actions taken. Do not ask Claude to write out its reasoning. That request can be declined.
- Test each prompt change on your own tasks. A line that helps one model can hurt another.
