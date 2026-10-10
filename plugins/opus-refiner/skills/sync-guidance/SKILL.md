---
name: sync-guidance
description: Maintainer tool. Compare Anthropic's Opus 5.5 guidance post with this plugin and draft updates. Use for /sync-guidance.
disable-model-invocation: true
---

This skill is for the maintainer of the opus-refiner plugin. Run it in a checkout of the toolbox repo.

1. Fetch https://claude.dev/blog/getting-the-most-out-of-opus-5-5/. If the page moved, search for the newest Anthropic guidance post for the current Opus model and say which page you used.
2. Read `plugins/opus-refiner/guidance-index.md`. It lists each recommendation the plugin knows, in our own words.
3. Compare. Make three lists: **New** (in the post, not in the index), **Changed** (in both, with different advice), and **Removed** (in the index, not in the post). Quote the post for each item in 15 words or fewer.
4. For each item, draft the change to the plugin: `rules.md`, a skill, the hook, or "no plugin change, user habit only".
5. Show the lists and the drafts. Change no file until the maintainer approves.
6. After approval, apply the changes. Update `guidance-index.md`. Raise `version` in `plugins/opus-refiner/.claude-plugin/plugin.json`: patch for wording, minor for a new rule or skill.
7. Run `claude plugin validate plugins/opus-refiner` and `claude plugin validate .`. Fix each error.

Mark each item you could not confirm against the post, and say where you looked. If nothing changed, say so and stop.
