---
name: product-engineering
description: Drive product decisions — PRD alignment, feature scoping, acceptance criteria, UX flow, metrics, and roadmap prioritisation — for the HTML-to-Figma project.
argument-hint: [feature-or-question]
disable-model-invocation: true
---

Use this skill when the user asks about feature scope, prioritisation, acceptance criteria, user flows, metrics, or roadmap decisions.

Task: `$ARGUMENTS`

## Product context
- **What it is:** Chrome Extension + Figma Plugin that converts live HTML/CSS into Figma layers.
- **Primary user:** Designer or front-end developer who wants a Figma representation of an existing web page.
- **Core value:** Accurate, safe, fast — no manual recreation of components.
- **Competitors:** Refore (closed API), manual screenshot → trace.
- **Current milestone:** Phase 2 MVP+ (8 % complete; Phase 1 PoC = 100 %).

## Reference documents (read before answering)
1. `docs/PRD_PROGRESS_REPORT.md` — current score and gap list
2. `docs/PRD_HTML_TO_FIGMA_v3.2_FINAL_COM_PESQUISA.md` — full PRD
3. `docs/PHASE_2_AGENT_PROMPTS.md` — ready-to-use implementation prompts
4. `docs/ROADMAP.md` — phase 3 and 4 plans

## Execution flow
1. Read the reference documents above (or the relevant subset).
2. Map the user's request to one of the four phases:
   - **Phase 1** — PoC/MVP (done)
   - **Phase 2** — MVP+ (SVG, A11y, Shadow DOM, viewport, gradients)
   - **Phase 3** — Production (Chrome Store, Figma Community, AI features)
   - **Phase 4** — Advanced (Design System, Code Export, Public API, i18n)
3. Apply one or more of the frameworks below as appropriate.
4. Output a concise, actionable answer — avoid vague recommendations.

## Frameworks to apply

### Feature scoping (INVEST)
- **I**ndependent — can be delivered without other pending items
- **N**egotiable — scope can flex within value boundaries
- **V**aluable — clear user benefit
- **E**stimable — can be sized (small/medium/large)
- **S**mall — fits in one PR
- **T**estable — has clear acceptance criteria

### Prioritisation (RICE)
| Factor | Question |
|---|---|
| Reach | How many users/sessions per month? |
| Impact | How much does it improve the core value? (1–3) |
| Confidence | How sure are we? (%) |
| Effort | Person-hours |
**Score = (Reach × Impact × Confidence) / Effort**

### Acceptance criteria template
```
Given [context]
When [action]
Then [expected outcome]
And [constraints / limits]
```

### Metric definition
| Metric | Type | Target |
|---|---|---|
| Conversion accuracy | quality | ≥ 90 % element match |
| Capture time | performance | < 2 s for 100 elements |
| Error rate | reliability | < 1 % unhandled errors |
| User retention (D7) | engagement | ≥ 40 % |

## Phase 2 priority order (from PRD)
1. SVG → VectorNode rendering ← **highest impact on accuracy**
2. A11y → layer names ← quick win (function exists)
3. Shadow DOM traversal ← unblocks modern component libraries
4. Multi-viewport capture ← enables responsive design workflows
5. CSS gradient mapping ← visual fidelity

## Output format
- **Decision / recommendation** (1–2 sentences)
- **Rationale** (why this, not that)
- **Acceptance criteria** (Given/When/Then)
- **Risks / open questions**
- **Next action** (concrete, assigned to a Phase)
