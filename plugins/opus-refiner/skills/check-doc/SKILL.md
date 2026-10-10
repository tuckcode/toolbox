---
name: check-doc
description: Check a long document, deck, or plan for contradictions in numbers, dates, and names. Use for /check-doc.
disable-model-invocation: true
---

Read the whole document named in the arguments. Find each place where it contradicts itself or the calendar.

## What to check

- **Numbers**: a figure in the text differs from the same figure in a table, chart, or summary. Totals do not add up.
- **Dates**: a weekday does not match its date. A sequence runs out of order. A deadline falls before its start.
- **Names**: one person, product, or team appears under two spellings or two titles.
- **Charts and images**: a chart shows a value that the text contradicts. Read the image itself.

## Output

One row per problem: the quote, the location (page, slide, or heading), and the conflict. Verify each weekday with `date` or `cal`. Do not trust memory for a weekday. End with **Not checked**: any part you could not read, and why.
