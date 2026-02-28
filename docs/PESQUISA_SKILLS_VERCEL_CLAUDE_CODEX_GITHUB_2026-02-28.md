# 🔎 Pesquisa de Skills: Vercel, Claude, Codex e GitHub

**Data:** 28/02/2026  
**Objetivo:** Identificar skills e fluxos de agentes que aceleram este projeto (`html-to-figma`) com foco em **validação, segurança, performance e CI**.

---

## 1) Resumo Executivo

As quatro plataformas convergiram para um mesmo padrão:

- **Skills como unidade reutilizável** (instruções + scripts + recursos)
- **MCP como padrão de integração com ferramentas e dados**
- **Execução assíncrona com logs e rastreabilidade**
- **Contexto persistente por repositório** (instruções/memória)

Para este repositório, o melhor caminho é:

1. Definir skills de projeto em `.github/skills` (compatível com Copilot e padrão aberto).
2. Organizar regras globais em `AGENTS.md` (Codex) e instruções de repositório no fluxo atual.
3. Usar agentes para tarefas repetitivas: testes, regressão de parser, hardening XSS/CORS e documentação técnica.
4. Adotar revisão automática de PR + memória de repositório para reduzir retrabalho.

---

## 2) Achados por Plataforma

## Vercel

Principais sinais úteis para o projeto:

- `Agent Resources` com:
  - `llms-full.txt` (contexto machine-readable da doc)
  - acesso markdown por página
  - Vercel MCP server
  - skills via ecossistema `skills.sh`
- `AI Gateway` para roteamento multi-modelo com fallback e observabilidade.
- Documentação de `MCP` com padrão host/client/server e deployment de MCP servers.

Aplicação prática aqui:

- Padronizar skills internas com formato aberto e reaproveitar em diferentes agentes.
- Manter uma skill de "troubleshooting deploy/runtime" para cenários de publicação futura.

## Claude

Principais sinais úteis:

- Claude Code trabalha com **skills, instruções e hooks**.
- Recomenda explicitamente engenharia de prompt com:
  - critérios de sucesso
  - avaliação empírica
  - iteração guiada por testes.
- Repositório `anthropics/skills` traz estrutura prática e template de `SKILL.md`.

Aplicação prática aqui:

- Criar skills com gatilhos claros para tarefas de alta recorrência:
  - validação de JSON/schema
  - testes de segurança (XSS/exfiltration)
  - diagnóstico de regressão parser/style mapper.

## Codex

Principais sinais úteis:

- Codex usa execução isolada, com logs e testes para evidência de mudanças.
- Suporte explícito a `AGENTS.md` para instruções persistentes.
- Página de `Agent Skills` define:
  - skill como pasta com `SKILL.md`
  - uso explícito e implícito
  - suporte a scripts opcionais
  - locais de descoberta por escopo.

Aplicação prática aqui:

- Consolidar instruções operacionais em `AGENTS.md` (build/testes/checks).
- Criar 3-5 skills de engenharia para delegação assíncrona de tarefas repetitivas.

## GitHub Copilot / GitHub

Principais sinais úteis:

- `About agent skills`: skills são suportadas e baseadas em padrão aberto.
- `Create skills` (Copilot agent/CLI):
  - diretórios recomendados: `.github/skills` ou `.claude/skills`
  - `SKILL.md` com frontmatter YAML (`name`, `description`, opcional `license`).
- `Agent management`: sessões paralelas, steering e transição para VS Code/CLI.
- `Copilot Memory` (preview): memória por repositório com validação por citações e retenção curta (28 dias).

Aplicação prática aqui:

- Habilitar fluxo de “issue -> agent PR -> review automático -> merge”.
- Ativar memória (quando disponível no plano) para reduzir prompts repetitivos sobre convenções do projeto.

---

## 3) Skills recomendadas para este projeto

Criar em `.github/skills/`:

1. `html-snapshot-sanitization`
   - Quando usar: extração/sanitização no content script.
   - Regras: DOMPurify obrigatório, bloqueio de scripts/event handlers, validações mínimas.

2. `figma-json-contract-validation`
   - Quando usar: mudanças no parser e no schema JSON para plugin.
   - Regras: validar contratos, campos obrigatórios, limites e backward compatibility.

3. `rendering-performance-guardrails`
   - Quando usar: alterações em chunk rendering, image handler, style mapper.
   - Regras: checklist de performance, limites de batch/chunk, impacto de memória.

4. `security-regression-checks`
   - Quando usar: qualquer mudança em extensão/plugin com risco de XSS/CORS/exfiltration.
   - Regras: rodar suíte de segurança e negar merge em falha.

5. `docs-sync-prd-architecture`
   - Quando usar: mudanças de comportamento funcional.
   - Regras: atualizar docs técnicas mínimas (`ARCHITECTURE`, `SECURITY_MODEL`, `LIMITATIONS` quando aplicável).

---

## 4) Plano de adoção (7 dias)

### Dia 1
- Criar `.github/skills/` e duas primeiras skills:
  - `security-regression-checks`
  - `figma-json-contract-validation`

### Dia 2-3
- Adicionar `AGENTS.md` na raiz com:
  - comandos oficiais de teste/lint/build
  - regras de alteração de docs
  - política mínima de segurança

### Dia 4-5
- Configurar workflow de PR com:
  - execução de testes
  - revisão automática de agente (quando disponível no plano).

### Dia 6
- Pilotar 3 issues reais com agentes em paralelo e medir:
  - tempo até PR
  - taxa de retrabalho
  - taxa de aprovação no primeiro review.

### Dia 7
- Ajustar descrições de skills (gatilhos) com base nos resultados.

---

## 5) Repositórios e referências úteis

- `anthropics/skills` (exemplos de skills)
- `agentskills/agentskills` (spec aberta)
- `github/awesome-copilot` (coleção comunitária citada na doc oficial)
- `Code-and-Sorts/awesome-copilot-agents` (exemplos práticos)

Observação: para produção, priorizar **fontes oficiais** e usar repositórios comunitários apenas como inspiração.

---

## 6) Decisão recomendada

Seguir com um **MVP de skills no próprio repo** (5 skills acima) + `AGENTS.md` raiz + automação de revisão em PR.

Isso entrega ganhos rápidos de produtividade sem aumentar risco arquitetural, mantendo aderência às prioridades já definidas no projeto (segurança, validação e performance).
