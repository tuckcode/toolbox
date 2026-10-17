---
name: security-pass
description: Run a separate security review of the branch diff. Open findings block the merge verdict. Use for /security-pass.
disable-model-invocation: true
---

Review the diff of the current branch for security problems only. The base is `main` unless the arguments name another ref.

This pass is separate from `/code-review-flow:review`. A change is not ready to merge while a finding from either pass is open.

## Steps

1. **Load context.** Read `REVIEW.md` for sensitive paths. Read `.review/ledger.md` for earlier security findings. Run `git diff <base>...HEAD`.
2. **Hunt.** Start hunters in parallel, each as its own subagent with one area:
   - injection: SQL, shell, template, path, prompt
   - authentication and authorization: missing checks, wrong scope, trust of client input
   - secrets: keys, tokens, and credentials in code, config, logs, or test fixtures
   - data handling: deserialization, file upload, unsafe parsing, logging of personal data
   - supply chain and CI: new or changed dependencies, install scripts, workflow files, permissions in CI
3. **Vote.** For each candidate, start 3 verifiers with a fresh context. Give each the file, line, claim, and attack input. They read the code. They do not run exploits against any live system. At least 2 must confirm.
4. **Report** the count line first: `N Important, P Pre-existing, K Not confirmed`. Then list each finding with file, line, the attack input, and the vote.
5. **Verdict.** Write one line:
   - `BLOCKED` if any Important finding is open.
   - `CLEAR` if none is open.
6. **Clear findings.** When the user runs this skill again after new commits, re-read each cited line. If a later commit fixed the issue, mark the finding `fixed` in the ledger. For a false positive, the user gives a short reason. Record the reason and mark it `wrong`.

Record each finding in `.review/ledger.md` with the area `security`.

Do not change code in this skill. Do not scan or attack anything outside the repo.
