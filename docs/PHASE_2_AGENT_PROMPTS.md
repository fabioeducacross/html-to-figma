# Prompts prontos - Fase 2

Este arquivo concentra prompts reutilizaveis para GitHub Copilot, Codex e Claude.

## 1) GitHub Copilot coding agent - SVG para VectorNode

```text
Implemente o item de Fase 2 "SVG -> Figma VectorNode rendering".

Contexto:
- `src/extension/src/utils/exportJson.ts` ja inclui `svgContent`.
- Conectar esse campo ao plugin para criar vetor com `figma.importSvgAsync()`.

Escopo:
1. Atualizar parser/validacao para aceitar `svgContent` com seguranca.
2. Atualizar `src/plugin/src/utils/rendering.ts` para importar SVG inline quando presente.
3. Preservar limite de 100 nos e renderizacao em chunks.
4. Adicionar/ajustar testes unitarios e de integracao.

Criterios de aceite:
- SVG inline vira `VectorNode` quando valido.
- Falhas de SVG nao quebram a importacao inteira; erro fica no relatorio.
- `npm run lint` e `npm run test` passam.
```

## 2) Codex CLI - A11y para nomes de layers

```text
Implement one Phase 2 task: map accessibility metadata to Figma layer names.

Repository:
- src/extension/src/utils/exportJson.ts already exports accessibility data.
- src/plugin/src/utils/rendering.ts is where nodes are created.

Requirements:
1. Prefer accessible name when present (aria-label, role context), fallback to existing naming.
2. Keep deterministic naming rules.
3. Add unit tests for naming precedence.
4. Do not change unrelated rendering behavior.

Validation:
- npm run lint
- npm run test
```

## 3) Claude Code - Shadow DOM support no capture

```text
/phase-2-delivery shadow-dom

Implementar suporte basico a Shadow DOM no fluxo de captura da extension.

Arquivos foco:
- src/extension/src/content.ts
- src/extension/src/utils/exportJson.ts

Requisitos:
1. Traversal de shadow roots quando existirem.
2. Fallback para host element quando shadow tree nao puder ser capturado.
3. Nao violar regras de seguranca ja existentes.
4. Cobrir com testes unitarios/integracao.

Checklist final:
- npm run lint
- npm run test
```

## 4) GitHub Copilot Chat ou Codex - Multi-viewport capture

```text
Implement the Phase 2 "multi-viewport capture" incrementally (mobile/tablet/desktop).

Goals:
1. Add data model support for multiple viewport captures per URL.
2. Add capture entry points for 3 breakpoints (mobile, tablet, desktop).
3. Keep existing single-capture flow backward compatible.
4. Add tests for schema compatibility and import behavior.

Focus on minimal viable implementation first, then report extension points.
```

## 5) Claude Code ou Codex - Gradientes CSS

```text
Implementar suporte inicial para `linear-gradient()` no style mapper.

Arquivos foco:
- src/plugin/src/parser/styleMapper.ts
- testes relacionados ao mapper

Escopo:
1. Parsear somente `linear-gradient(...)` no primeiro incremento.
2. Converter para `GradientPaint` compativel com Figma.
3. Preservar comportamento atual para cores simples.
4. Adicionar testes para casos validos e invalidos.

Nao implementar radial/conic neste passo.
```

## 6) Vercel (suporte operacional para agentes)

```text
Set up an agent-ready Vercel workflow for this repository.

Use Vercel docs resources:
- https://vercel.com/docs/agent-resources
- https://vercel.com/docs/agent-resources/workflows
- https://vercel.com/docs/agent-resources/skills

Deliverables:
1. Propose the minimum CLI workflow for preview + production validation.
2. Suggest 2-3 skills from skills.sh useful for this repo.
3. Provide exact commands and verification steps.
4. Do not change application code in this task.
```
