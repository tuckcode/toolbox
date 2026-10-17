---
name: init-review
description: Draft a REVIEW.md for this repo and check that CLAUDE.md is short and lists runnable checks. Use for /init-review.
disable-model-invocation: true
---

Prepare this repo for the review flow. The review skills read `REVIEW.md` and `CLAUDE.md` before every review.

## Steps

1. Look at the repo: languages, test and build commands, lint config, CI files, `CODEOWNERS`, and the top-level folders. Read any existing `CLAUDE.md` and `REVIEW.md` in full.
2. Check `CLAUDE.md`. It should state the stack, the conventions, the goals, and the non-goals. It should list the commands that run the tests, the build, and the linter. It should stay short and link to other docs. List each gap. Do not rewrite the file.
3. Draft `REVIEW.md` at the repo root. If one exists, write the draft to `REVIEW.draft.md` and show the difference. Use these sections:
   - **What failure looks like here.** One line per area. Examples: docs "it lies", config "it misroutes", API code "it breaks a caller".
   - **Nit cap.** The maximum number of nits per review. Default: 3.
   - **Skip paths.** Generated code, vendored code, lock files, snapshots.
   - **Sensitive paths.** Code that always needs a human: auth, billing, installers, auto-update, CI workflows, migrations, secrets handling. Take the first guess from `CODEOWNERS` and the folder names.
   - **Evidence rule.** Every finding cites a file and a line. A guess from a name is not evidence.
   - **Summary rule.** The summary starts with a count. When nothing needs a fix, it says so in one line.
4. Mark each line you inferred, not read, with `(guess)`. The code owner must confirm those lines.
5. Show the draft. Write the file only after the user approves.

Do not change code, CI files, or `CLAUDE.md` in this skill.
