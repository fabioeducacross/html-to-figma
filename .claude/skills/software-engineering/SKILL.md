---
name: software-engineering
description: Apply software engineering best practices — refactoring, testing, performance, security hardening, and TypeScript strictness — to any file or module in this repository.
argument-hint: [file-or-module] [concern]
disable-model-invocation: true
---

Use this skill when the user asks to improve code quality, fix a bug, add tests, refactor a module, or harden security in any part of this codebase.

Task: `$ARGUMENTS`

## Guardrails (non-negotiable)
- TypeScript strict — no `any`, no implicit returns
- Never weaken sanitization (DOMPurify, URL checks, XSS guards)
- Keep existing limits: 100 nodes, 2 MB JSON, 50-node chunks
- No silent fallbacks that swallow errors
- Add or update tests for every behavior change

## Execution flow
1. Read `AGENTS.md` for project context and code map.
2. Identify the target file(s) from the argument or the code map:
   - Capture: `src/extension/src/content.ts`, `src/extension/src/utils/exportJson.ts`
   - Plugin parser: `src/plugin/src/parser/jsonParser.ts`, `src/plugin/src/parser/styleMapper.ts`
   - Plugin renderer: `src/plugin/src/utils/rendering.ts`
   - Tests: `tests/unit/`, `tests/integration/`, `tests/security/`
3. Read only the relevant files — avoid loading the whole tree.
4. Apply the **smallest correct change** that satisfies the concern.
5. Run validation:
   ```bash
   npm run lint
   npm run test
   ```
6. Report:
   - files changed and lines modified
   - what was done and why
   - any trade-offs or follow-up risks

## Common concerns and where to act

| Concern | Primary file |
|---|---|
| XSS / injection | `src/extension/src/utils/domPurify.ts`, `validation.ts` |
| JSON schema validation | `src/plugin/src/parser/jsonParser.ts` |
| CSS → Figma mapping gap | `src/plugin/src/parser/styleMapper.ts` |
| Rendering performance | `src/plugin/src/utils/rendering.ts` |
| Type safety | any file failing `tsc --strict` |
| Missing test coverage | `tests/unit/` or `tests/security/` |
| Memory / size limit | `src/extension/src/utils/exportJson.ts` |

## Quality checklist before finishing
- [ ] `npm run lint` — 0 errors (warnings OK if pre-existing)
- [ ] `npm run test` — all tests pass
- [ ] No new `any` introduced
- [ ] No sanitization removed or weakened
- [ ] Changed files listed in report
