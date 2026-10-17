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

## Maintaining

1. Run `/opus-refiner:sync-guidance` in this repo.
2. Approve the drafted edits.
3. Raise `version` in the plugin's `plugin.json`. Users stay on the old version until you do.
4. Push. Users get the change on `/plugin marketplace update toolbox`.
