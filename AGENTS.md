# AGENTS.md

## Repository purpose
This repository builds an HTML-to-Figma converter:
- capture HTML/CSS from a page via Chrome Extension
- import the capture JSON and render layers via Figma Plugin

## Start-of-task checklist
1. Read `docs/PRD_PROGRESS_REPORT.md` for current status.
2. Read `docs/PHASE_2_AGENT_PROMPTS.md` for ready-to-use prompts.
3. Keep edits minimal and scoped to one objective.

## Commands
```bash
npm install
npm run lint
npm run test
npm run build
npm run validate
```

## Code map
- Extension capture: `src/extension/src/content.ts`
- Capture JSON: `src/extension/src/utils/exportJson.ts`
- Import parse/validation: `src/plugin/src/parser/jsonParser.ts`
- Style mapping: `src/plugin/src/parser/styleMapper.ts`
- Plugin rendering: `src/plugin/src/utils/rendering.ts`
- Tests: `tests/unit`, `tests/integration`, `tests/security`

## Guardrails
- Do not remove sanitization, CSP assumptions, or sensitive-data stripping.
- Keep existing limits unless explicitly changed by the user:
  - 100 node limit
  - 2 MB JSON limit
  - 50-node rendering chunks
- Avoid broad try/catch and success-shaped fallbacks.
- Add/update tests for any functional behavior change.
- Preserve existing naming and project conventions.

## Current focus (Phase 2)
1. SVG to VectorNode rendering path
2. Accessibility metadata to layer naming
3. Shadow DOM support in capture
4. Multi-viewport capture
5. CSS gradient mapping
