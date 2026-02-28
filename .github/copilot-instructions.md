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

---

## Software Engineering skill
When asked to improve code quality, fix bugs, add tests, refactor, or harden security:

1. Identify the target file from the code map above.
2. Apply the **smallest correct change** — no unrelated edits.
3. Common concern → file mapping:
   | Concern | File |
   |---|---|
   | XSS / injection | `src/extension/src/utils/domPurify.ts` |
   | JSON schema | `src/plugin/src/parser/jsonParser.ts` |
   | CSS → Figma gap | `src/plugin/src/parser/styleMapper.ts` |
   | Rendering perf | `src/plugin/src/utils/rendering.ts` |
   | Type safety | any file with `any` or missing return types |
   | Test coverage | `tests/unit/` or `tests/security/` |
4. Run `npm run lint && npm run test` before finishing.
5. Report: files changed, what was done, risks.

---

## Product Engineering skill
When asked about feature scope, prioritisation, user flows, acceptance criteria, or roadmap:

### Product context
- **Users:** designers and front-end devs wanting Figma layers from live HTML
- **Core value:** accurate, safe, fast conversion — no manual recreation
- **Phase 1** = 100% complete (PoC ready); **Phase 2** = 8% (in progress)
- Reference: `docs/PRD_PROGRESS_REPORT.md`, `docs/PHASE_2_AGENT_PROMPTS.md`

### Prioritisation (RICE)
Score = (Reach × Impact × Confidence) / Effort

### Phase 2 priority order
1. SVG → VectorNode ← highest accuracy impact
2. A11y → layer names ← quick win (function already exists)
3. Shadow DOM traversal ← unblocks modern component libraries
4. Multi-viewport capture ← responsive design workflows
5. CSS gradient mapping ← visual fidelity

### Acceptance criteria format
```
Given [context]
When [action]
Then [expected outcome]
And [constraints / limits]
```

### Answer format
- **Recommendation** (1–2 sentences)
- **Rationale**
- **Acceptance criteria**
- **Risks / open questions**
- **Next action** (Phase 2, 3, or 4)
