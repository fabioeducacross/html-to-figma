---
name: phase-2-delivery
description: Implement one Phase 2 item with minimal safe changes and tests.
argument-hint: [task-name]
disable-model-invocation: true
---

Use this skill when the user asks to execute a specific Phase 2 task.

Task requested: `$ARGUMENTS`

## Execution flow
1. Read `AGENTS.md` and `docs/PHASE_2_AGENT_PROMPTS.md`.
2. Identify the closest prompt template for the requested task.
3. Inspect only the relevant files and implement the smallest correct change.
4. Update or add tests for any behavior change.
5. Run:
   - `npm run lint`
   - `npm run test`
6. Report:
   - changed files
   - what was implemented
   - risks or pending follow-ups

## Phase 2 target list
- SVG to VectorNode rendering
- Accessibility metadata to layer naming
- Shadow DOM support
- Multi-viewport capture
- CSS gradient mapping
