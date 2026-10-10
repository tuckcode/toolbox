#!/bin/sh
# PreToolUse hook for Bash. Asks the user before a destructive command runs.
# Reads the hook JSON on stdin. Uses only POSIX sh and grep, so no jq or python is needed.
input=$(cat)

reason=""
if printf '%s' "$input" | grep -Eq 'git[[:space:]]+push([[:space:]][^"]*)?[[:space:]](--force|-f([[:space:]"]|$)|\+)'; then
  reason="force-push"
elif printf '%s' "$input" | grep -Eq 'git[[:space:]]+reset[[:space:]][^"]*--hard'; then
  reason="git reset --hard"
elif printf '%s' "$input" | grep -Eq 'git[[:space:]]+clean[[:space:]][^"]*-[a-zA-Z]*f'; then
  reason="git clean -f"
elif printf '%s' "$input" | grep -Eq 'git[[:space:]]+branch[[:space:]][^"]*(-D|--delete[[:space:]]+--force|--force[[:space:]]+--delete)'; then
  reason="git branch -D"
elif printf '%s' "$input" | grep -Eq '(^|[^a-zA-Z_-])rm[[:space:]]+([^"]*[[:space:]])?-[a-zA-Z]*([rR][a-zA-Z]*f|f[a-zA-Z]*[rR])' \
  || printf '%s' "$input" | grep -Eq '(^|[^a-zA-Z_-])rm[[:space:]]+([^"]*[[:space:]])?-[a-zA-Z]*[rR][^"]*[[:space:]]-[a-zA-Z]*f' \
  || printf '%s' "$input" | grep -Eq '(^|[^a-zA-Z_-])rm[[:space:]]+([^"]*[[:space:]])?-[a-zA-Z]*f[^"]*[[:space:]]-[a-zA-Z]*[rR]'; then
  reason="rm -rf"
fi

if [ -n "$reason" ]; then
  printf '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"ask","permissionDecisionReason":"opus-refiner: %s cannot be undone. Confirm before it runs."}}\n' "$reason"
fi
exit 0
