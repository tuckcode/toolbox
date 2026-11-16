---
name: sync-guidance
description: Maintainer tool. Compare Anthropic's current prompting guidance with this plugin and draft updates. Use for /sync-guidance.
disable-model-invocation: true
---

This skill is for the maintainer of the best-practices plugin. Run it in a checkout of the toolbox repo.

1. Fetch each source URL that `plugins/best-practices/guidance-index.md` lists. If a page moved, search for the newest Anthropic guidance for that model and say which page you used. Also check for a newer model guide.
2. Read `plugins/best-practices/guidance-index.md`. It lists each recommendation the plugin knows, in our own words.
3. Compare. Make three lists: **New** (in the post, not in the index), **Changed** (in both, with different advice), and **Removed** (in the index, not in the post). Quote the post for each item in 15 words or fewer.
4. For each item, draft the change to the plugin. Choose the destination with this rubric:
   - **Session rule (`rules.md`):** the item applies to all four models, takes one line, and does no harm if the model misapplies it.
   - **Typed skill:** the item is a procedure with steps, or it writes a file.
   - **Reference line (`models.md` or `principles.md`):** the item is model-specific or situational. A skill reads it.
   - **User habit:** the item is a setting, such as effort or the model picker.
   - **Leave out:** the item is a standing negative, a hard limit, an absolute "never", an API-only fact, or a line that causes the problem it describes. Every added caution also adds to the caution that makes Fable 5.2 ask for needless approval. Prefer deleting a line to adding one.
5. Show the lists and the drafts. Change no file until the maintainer approves.
6. After approval, apply the changes. Update `guidance-index.md` and its `Last checked` dates. Raise `version` in `plugins/best-practices/.claude-plugin/plugin.json`: patch for wording, minor for a new rule or skill.
7. Run `claude plugin validate plugins/best-practices` and `claude plugin validate .`. Fix each error.

Mark each item you could not confirm against the post, and say where you looked. If nothing changed, say so and stop.
