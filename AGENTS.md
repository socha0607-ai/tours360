# Tours360 Lightweight & Cloud-Ready Architecture Rules

## Root & Local Testing
- **Root:** `/home/admin01/tours360`
- **Local Test URL:** Always verify on `http://127.0.0.1:8080` (`go run .`).

## CRITICAL DATA.JS RULE (DO NOT OVERWRITE)
- `static/js/data.js` contains JavaScript methods (`getBuilder`, `getProject`, `getScene`, `addPartner`) and `window.TOURS360_DATA`.
- **NEVER overwrite `static/js/data.js` completely.** Always insert new builder objects inside `builders: [` and new project objects inside `projects: [` cleanly before the closing `],` of each array, preserving all existing entries and helper functions.
- Also sync `static/data.json`, `configs/<slug>.json`, `data/status.json`, and `status_manager.go`.
- **NEVER run `rm`, `rm -rf`, `unlink`, `git clean`, or `git push`.**

## MANDATORY SYNTAX GUARDRAIL
- Every time `static/js/data.js` is edited, the agent MUST immediately run Python brace/bracket balance check on `static/js/data.js` AND `go build .`.
- Always clone an existing project block (like `p-tathastu-greens` for plotting or `p-imperial-grand-4bhk` for builder) by matching brace depth `{...}` so commas and brackets never break.
