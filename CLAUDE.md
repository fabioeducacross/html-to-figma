# CLAUDE.md

## Project context
- Product: HTML-to-Figma converter (extension + plugin)
- Main constraints: security first, deterministic conversion, performance limits
- Current milestone: execute Phase 2 backlog items safely

## How to work in this repo
1. Start from `AGENTS.md`.
2. Use prompts from `docs/PHASE_2_AGENT_PROMPTS.md` when implementing Phase 2.
3. If a user asks for direct execution of one Phase 2 item, use `/phase-2-delivery <task>`.

## Validation before handoff
- Run `npm run lint`
- Run `npm run test`
- Mention changed files and remaining risks
