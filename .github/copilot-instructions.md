# Repository custom instructions for GitHub Copilot

## Project summary
- HTML-to-Figma converter with two artifacts:
  - Chrome Extension (`src/extension`)
  - Figma Plugin (`src/plugin`)
- Core priorities: security, predictable output, and performance.

## Tooling
- Runtime: Node.js 18+
- Package manager: npm
- Main checks:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run validate`

## Important code map
- `src/extension/src/content.ts`: capture flow in browser
- `src/extension/src/utils/exportJson.ts`: capture JSON generation
- `src/plugin/src/parser/jsonParser.ts`: import validation/parsing
- `src/plugin/src/parser/styleMapper.ts`: CSS to Figma mapping
- `src/plugin/src/utils/rendering.ts`: node rendering in chunks

## Non-negotiable engineering rules
1. Keep TypeScript strict and avoid `any`.
2. Do not weaken sanitization rules (DOMPurify and URL checks).
3. Preserve current safety limits unless explicitly requested:
   - max 100 elements
   - max 2 MB JSON
   - rendering chunks of 50
4. Do not add silent fallbacks that hide errors.
5. Add or update tests when behavior changes.
6. Keep changes minimal and scoped to the requested task.

## Current delivery focus (Phase 2)
Prioritize these items in order:
1. SVG passthrough to real `VectorNode` rendering in plugin
2. Accessibility data to layer naming
3. Shadow DOM traversal in capture
4. Multi-viewport capture (mobile/tablet/desktop)
5. Linear gradient mapping from CSS to Figma paints

## PR-ready checklist
- `npm run lint` passes
- `npm run test` passes
- behavior change covered by tests
- related docs updated when needed
