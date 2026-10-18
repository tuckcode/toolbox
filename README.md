# toolbox

Tuck's Claude Code plugins. This repo is a plugin marketplace. Add it once, then install only the plugins you want.

## Install

The repo is private. Ask Tuck for GitHub access first. Claude Code uses your own git credentials to fetch it.

In Claude Code, add the marketplace:

```
/plugin marketplace add tuckcode/toolbox
```

Then install a plugin:

```
/plugin install opus-refiner@toolbox
```

To get updates later:

```
/plugin marketplace update toolbox
```

## Plugins

| Plugin | What it does |
|---|---|
| `opus-refiner` | Applies Anthropic's [Opus 5.5 guidance](https://claude.dev/blog/getting-the-most-out-of-opus-5-5/). Adds stop rules and end-of-run headings to each session, asks before destructive shell commands, and adds skills for long runs, subagent audits, reviews, and checks. |
| `code-review-flow` | A code review process for agent-written code. Based on Anthropic's [How the Claude Code team does code review](https://claude.dev/blog/solving-code-review-at-anthropic/). Adds skills to verify work, review with a vote of verifiers, run a security pass, cap review rounds, pick a risk tier, write PR bodies, and turn incidents into evals. |
| `trilemma` | A band above the prompt with 3 suggested next prompts, quick follow-up pills, and a one-line usage strip for context and rate limits. |
| `stepack` | Plain, exact English for your agent. Lives in [tuckcode/stepack](https://github.com/tuckcode/stepack). Needs access to that repo too. |

## opus-refiner

**Each session:** A SessionStart hook loads [`rules.md`](plugins/opus-refiner/rules.md): continue without check-ins, stop before destructive actions, keep `TASKS.md` on long runs, end with **Blocked on me / Changed / Found**, show check output before you say done, and mark unconfirmed claims.

**Before shell commands:** A PreToolUse hook asks you before `git push --force`, `git reset --hard`, `git clean -f`, `git branch -D`, and `rm -rf`. It asks even in auto mode.

**Skills** (type them; the agent does not start them on its own):

| Skill | Use it to |
|---|---|
| `/opus-refiner:run-to-done` | Set a finish line, then let the agent run to it. Stops after three review-fix rounds |
| `/opus-refiner:fan-out` | Split an audit or migration across subagents and check their evidence |
| `/opus-refiner:review-diff` | List only the merge-blocking problems in the branch or a pull request, with proof. A fresh subagent verifies each one. Old bugs go in a separate Pre-existing list |
| `/opus-refiner:check-doc` | Find contradictions in numbers, dates, and names in a long document |
| `/opus-refiner:design-avoid` | Keep a UI away from the model's default look |
| `/opus-refiner:audit-prompts` | Find "think hard" and "show your reasoning" in your own instructions |
| `/opus-refiner:sync-guidance` | Maintainer only. Compare the plugin with the latest guidance post |

**Not covered by a plugin:** the model picker, `/fast`, and the "switch models when a message is flagged" setting. Set those yourself.

## code-review-flow

Every skill is typed by you. The agent does not start them on its own. The skills share two repo files: `REVIEW.md` (what the reviewer must care about) and `.review/ledger.md` (every finding and how it ended).

| Skill | Use it to |
|---|---|
| `/code-review-flow:init-review` | Draft a `REVIEW.md` and check that `CLAUDE.md` lists runnable checks |
| `/code-review-flow:verify-work` | Run checks, show output, and get a fresh-context review before a PR |
| `/code-review-flow:review` | Review a diff with parallel hunters and a vote of 3 verifiers. Tags Important, Nit, Pre-existing. Depth: quick, standard, deep |
| `/code-review-flow:security-pass` | Run a separate security review. Open findings give a `BLOCKED` verdict |
| `/code-review-flow:review-loop` | Review and fix in rounds. Stops after round 3 and re-reviews only new diffs |
| `/code-review-flow:risk-tier` | Pick Low, Medium, or High from the change and give the human approvals needed |
| `/code-review-flow:pr-body` | Write a PR body with Testing, Risk, and How to revert |
| `/code-review-flow:incident-to-eval` | Save an incident as a regression case. A person must confirm it |
| `/code-review-flow:eval-reviewer` | Score the review flow against the saved cases and clean controls |
| `/code-review-flow:explain-slice` | Write an explainer for one module before you change it |
| `/code-review-flow:adopt-review` | Audit a repo against the adoption checklist. Read-only |

**Not built:** the merge queue, feature flags, staged releases, rollback, and branch protection. These are team tools. `/code-review-flow:adopt-review` reports whether you have them.

**Source caveat:** the skills follow the post's structure. The numbers they use are choices of this repo, not the post: 3 hunters at standard depth, 5 at deep, a 2-of-3 vote, and a nit cap of 3. The post names the ideas but gives no such numbers.

## trilemma

A band above the prompt box. It is a mod: a hooks module, with no skills or commands.

- **Suggested prompts:** after each answer, Haiku reads the last 8 messages and writes 3 likely next prompts. Click one to send it. They clear when you send a prompt.
- **Pills:** 4 next, 5 tldr, 6 eli5, 7 opinion, 8 recap, 9 elab. Each one sends one plain prompt.
- **Usage strip:** one line. Left: last turn and context. Middle: the 5-hour and weekly limits. Right: the weekly reset. Cost shows only on API billing. A bar turns amber at 75% and red at 90%, and adds a "full in ~Xh" estimate from the last hour of use.
- **One send per click:** the first click hides the options until the turn ends.

**Terminal only:** keys 1–9 send while the prompt box is empty, and Tab drops the focused prompt into the box for editing. The desktop app draws its own composer and does not report these keys, so use clicks there.

**Cost:** one small Haiku call (at most 200 output tokens) after each answer.

To develop it without installing: `claude --plugin-dir plugins/trilemma`. Tests: `claude plugin test plugins/trilemma`.

## Maintaining

1. Run `/opus-refiner:sync-guidance` in this repo.
2. Approve the drafted edits.
3. Raise `version` in the plugin's `plugin.json`. Users stay on the old version until you do.
4. Push. Users get the change on `/plugin marketplace update toolbox`.
