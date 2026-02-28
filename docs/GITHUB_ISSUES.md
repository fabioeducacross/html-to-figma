# 📋 GitHub Issues — HTML-to-Figma Converter

**Baseado em:** PRD v3.3, ROADMAP, VALIDATION_PLAN, BIG_PESQUISA, PLANO_PARA_100_PORCENTO_CONFIANCA, ENGENHARIA_REVERSA_REFORE  
**Data:** Fevereiro 2026  
**Objetivo:** Listar todas as issues a serem criadas no GitHub para rastrear o desenvolvimento do projeto

---

## 🏷️ Labels Recomendadas

| Label | Cor | Descrição |
| :--- | :--- | :--- |
| `fase-1` | `#0075ca` | Fase 1 — MVP |
| `fase-2` | `#e4e669` | Fase 2 — MVP+ |
| `fase-3` | `#cfd3d7` | Fase 3 — Produção |
| `infrastructure` | `#e4e669` | Setup e infraestrutura |
| `prototype` | `#7057ff` | Prototipagem e validação |
| `security` | `#d93f0b` | Segurança |
| `extension` | `#0052cc` | Chrome Extension |
| `plugin` | `#5319e7` | Figma Plugin |
| `testing` | `#0e8a16` | Testes |
| `documentation` | `#c5def5` | Documentação |
| `performance` | `#f9d0c4` | Performance |
| `bug` | `#d73a4a` | Correção de bug |
| `enhancement` | `#a2eeef` | Melhoria |
| `good first issue` | `#7057ff` | Bom para iniciantes |

---

## 🗺️ Milestones Recomendados

| Milestone | Duração | Objetivo |
| :--- | :--- | :--- |
| **Semana 1-2: Preparação** | Semanas 1-2 | Setup, estrutura de código, CI/CD |
| **Semana 2-4: Validação** | Semanas 2-4 | 6 protótipos + testes de segurança |
| **Semana 4-12: Desenvolvimento** | Semanas 4-12 | Extension + Plugin + Testes + Docs |
| **Semana 12+: Publicação** | Semana 12+ | Chrome Web Store + Figma Community |
| **Fase 2: MVP+** | Futuro | Multi-viewport, Shadow DOM, A11y, SVG |
| **Fase 3: Produção** | Futuro | AI, Design System, Monetização |

---

## 📦 Fase 1 — Preparação (Semanas 1-2)

### [INFRA-01] Criar estrutura de pastas do código-fonte

**Título:** `feat(infra): criar estrutura de pastas src/extension, src/plugin, tests, prototypes`  
**Labels:** `infrastructure`, `fase-1`, `good first issue`  
**Milestone:** Semana 1-2: Preparação

**Descrição:**
Criar a estrutura completa de pastas e arquivos vazios conforme definida no PROXIMOS_PASSOS_ROADMAP.md.

```
src/extension/src/
├── popup.tsx
├── content.ts
├── background.ts
└── utils/
    ├── domPurify.ts
    ├── imageHandler.ts
    └── storage.ts

src/plugin/src/
├── ui.tsx
├── code.ts
├── parser/
│   ├── jsonParser.ts
│   └── styleMapper.ts
└── utils/
    ├── validation.ts
    └── rendering.ts

tests/
├── unit/
├── integration/
└── security/

prototypes/
```

**Critérios de Aceite:**
- [ ] Estrutura de pastas criada
- [ ] Arquivos `.ts`/`.tsx` vazios criados
- [ ] `package.json` em cada subpacote (extension e plugin)
- [ ] Imports funcionando sem erros do TypeScript

---

### [INFRA-02] Configurar CI/CD com GitHub Actions

**Título:** `feat(infra): configurar pipeline CI/CD com GitHub Actions`  
**Labels:** `infrastructure`, `fase-1`  
**Milestone:** Semana 1-2: Preparação

**Descrição:**
Criar o arquivo `.github/workflows/validate.yml` para rodar lint e testes automaticamente em cada push e pull request.

```yaml
name: Validate
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run lint
      - run: npm run test
```

**Critérios de Aceite:**
- [ ] Workflow criado em `.github/workflows/validate.yml`
- [ ] Pipeline executa com sucesso em push para `main`
- [ ] Pipeline executa com sucesso em Pull Requests
- [ ] Falhas de lint bloqueiam merge

---

### [INFRA-03] Configurar subpacotes npm para Extension e Plugin

**Título:** `feat(infra): configurar package.json e tsconfig para extension e plugin`  
**Labels:** `infrastructure`, `fase-1`  
**Milestone:** Semana 1-2: Preparação

**Descrição:**
Criar os arquivos `package.json` e `tsconfig.json` individuais para `src/extension` e `src/plugin`, configurados com as dependências específicas de cada um (Plasmo para extension, Figma Plugin API para plugin).

**Critérios de Aceite:**
- [ ] `src/extension/package.json` criado com Plasmo configurado
- [ ] `src/plugin/package.json` criado com Figma Plugin API configurado
- [ ] `npm run dev:extension` funciona sem erros
- [ ] `npm run dev:plugin` funciona sem erros
- [ ] `npm run build` no root compila ambos

---

## 🔬 Fase 1 — Validação: Protótipos Técnicos (Semanas 2-4)

### [PROTO-01] Protótipo: Performance da Figma API

**Título:** `feat(prototype): testar performance da Figma API com 100, 500 e 1000 nós`  
**Labels:** `prototype`, `performance`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Criar um script em `prototypes/figma-api-performance/` que crie nós no Figma e meça o tempo de renderização para diferentes tamanhos (10, 50, 100, 200, 500, 1000 nós). Documentar os resultados em `results.md`.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §1.1

**Critérios de Aceite:**
- [ ] Script TypeScript criado e executável
- [ ] Medições registradas para cada tamanho de conjunto
- [ ] `prototypes/figma-api-performance/results.md` preenchido
- [ ] Limite máximo seguro documentado (meta: < 5s para 100 nós)
- [ ] Timeline ajustada se necessário com base nos resultados

---

### [PROTO-02] Protótipo: Isolamento de Content Script

**Título:** `feat(prototype): validar isolamento de contexto do Content Script`  
**Labels:** `prototype`, `security`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Criar uma extensão mínima em `prototypes/content-script-isolation/` para testar que o Content Script tem acesso ao DOM da página sem violar o isolamento de contexto (Isolated World) e sem conflitos com CSP.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §1.2

**Critérios de Aceite:**
- [ ] Content Script acessa `document.body` com sucesso
- [ ] Isolamento de contexto é respeitado
- [ ] Nenhuma violação de CSP detectada
- [ ] `prototypes/content-script-isolation/results.md` preenchido

---

### [PROTO-03] Protótipo: Integração com DOMPurify

**Título:** `feat(prototype): testar DOMPurify contra XSS payloads`  
**Labels:** `prototype`, `security`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Criar um script em `prototypes/dompurify-integration/` que passe 15+ payloads XSS conhecidos pelo DOMPurify e verifique que todos são neutralizados. Documentar eficácia e casos extremos.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §1.3

**Critérios de Aceite:**
- [ ] 15+ payloads XSS testados
- [ ] Todos os payloads neutralizados sem execução de `alert()`
- [ ] Casos extremos documentados (encoded, HTML5, style-based)
- [ ] `prototypes/dompurify-integration/results.md` preenchido

---

### [PROTO-04] Protótipo: Testes de CORS em websites reais

**Título:** `feat(prototype): testar CORS em 10 websites reais e documentar resultados`  
**Labels:** `prototype`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Testar o carregamento de imagens via CORS em 10 websites reais (github.com, stackoverflow.com, medium.com, dribbble.com, etc.) e documentar quais têm restrições CORS que impediriam a captura de imagens.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §1.4

**Critérios de Aceite:**
- [ ] 10 websites testados
- [ ] % de imagens com bloqueio CORS documentada
- [ ] Estratégia de fallback (placeholder) validada
- [ ] `prototypes/cors-testing/results.md` preenchido

---

### [PROTO-05] Protótipo: Memory Profiling da Extension

**Título:** `feat(prototype): medir memory usage e detectar memory leaks na extension`  
**Labels:** `prototype`, `performance`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Usando o Chrome DevTools Memory Profiler, capturar um elemento 100 vezes em sequência e verificar se o uso de memória cresce (memory leak) ou se permanece estável.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §1.5

**Critérios de Aceite:**
- [ ] Script de teste criado e executável
- [ ] Memory usage medido em 10 iterações de 10 capturas
- [ ] Crescimento de memória por captura documentado
- [ ] `prototypes/memory-profiling/results.md` preenchido
- [ ] Garbage collection verificado

---

### [PROTO-06] Protótipo: Renderização em Chunks no Figma

**Título:** `feat(prototype): validar renderização em chunks de 50 nós no Figma Plugin`  
**Labels:** `prototype`, `performance`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Criar um plugin Figma mínimo em `prototypes/rendering-chunks/` que renderize 100 nós em chunks de 50 com `setTimeout` entre cada chunk, medindo o tempo total e verificando que a UI do Figma não trava.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §1.6

**Critérios de Aceite:**
- [ ] Plugin renderiza 100 nós com sucesso
- [ ] UI do Figma não trava durante renderização
- [ ] Tempo total de renderização documentado
- [ ] `prototypes/rendering-chunks/results.md` preenchido

---

## 🔐 Fase 1 — Validação: Testes de Segurança (Semanas 2-4)

### [SEC-01] Testes XSS com 15+ payloads

**Título:** `security: implementar e executar testes XSS com 15+ payloads`  
**Labels:** `security`, `testing`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Criar o arquivo `tests/security/xss.test.ts` com testes automatizados para 15+ payloads XSS, incluindo variantes com event handlers, SVG, iframes, style injection e encoding.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §2.1, BIG_PESQUISA §3.1

**Payloads mínimos a cobrir:**
- Basic: `<img src=x onerror="alert(1)">`, `<svg onload="alert(1)">`
- Event handlers: `onclick`, `onload`, `onsubmit`
- Style-based: `style="background:url(javascript:alert(1))"`
- Data attributes: `<div data-onclick="alert(1)">`
- HTML5: `<video>`, `<audio>`, `<source>` com `onerror`
- Encoded: `&#97;&#108;...`, `eval(String.fromCharCode(...))`

**Critérios de Aceite:**
- [ ] Arquivo `tests/security/xss.test.ts` criado
- [ ] 15+ payloads cobertos como test cases
- [ ] Todos os testes passam (DOMPurify neutraliza 100%)
- [ ] Resultado documentado em `docs/SECURITY_FINDINGS.md`

---

### [SEC-02] Testes de prevenção de Data Exfiltration

**Título:** `security: testar prevenção de exfiltração de dados sensíveis`  
**Labels:** `security`, `testing`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Criar o arquivo `tests/security/dataExfiltration.test.ts` para verificar que a sanitização remove dados sensíveis (tokens JWT, API keys, senhas, CPF, número de cartão) que possam estar em atributos `data-*` ou outros campos.

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §2.2, BIG_PESQUISA §3.2

**Critérios de Aceite:**
- [ ] Arquivo `tests/security/dataExfiltration.test.ts` criado
- [ ] Tokens JWT, API keys, senhas, CPF e cartões de crédito testados
- [ ] Estratégia de sanitização de dados sensíveis documentada
- [ ] Modo "Offline" (sem envio a servidor) proposto no PRD

---

### [SEC-03] Testes OWASP Top 10

**Título:** `security: executar testes OWASP Top 10 e documentar mitigações`  
**Labels:** `security`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Testar a aplicação contra os 10 principais vetores de ataque do OWASP (Injection, Broken Auth, Sensitive Data Exposure, XXE, Broken Access Control, Security Misconfiguration, XSS, Insecure Deserialization, Vulnerable Components, Insufficient Logging).

**Referência:** PLANO_PARA_100_PORCENTO_CONFIANCA.md §2.3

**Critérios de Aceite:**
- [ ] Cada um dos 10 vetores testado e documentado
- [ ] `docs/SECURITY_AUDIT.md` criado com resultados
- [ ] Mitigações implementadas ou planejadas para cada vulnerabilidade
- [ ] Nenhuma vulnerabilidade crítica sem mitigação

---

### [SEC-04] Testes de Content Security Policy (CSP)

**Título:** `security: testar compatibilidade da extension com sites de CSP strict`  
**Labels:** `security`, `testing`, `fase-1`  
**Milestone:** Semana 2-4: Validação

**Descrição:**
Testar a extensão em websites com CSP strict para verificar que o Content Script não é bloqueado e que a extensão funciona corretamente sem violar as políticas de segurança da página.

**Referência:** BIG_PESQUISA §3.3, PLANO_PARA_100_PORCENTO_CONFIANCA incerteza #17

**Critérios de Aceite:**
- [ ] Extensão testada em 5+ sites com CSP strict
- [ ] Incompatibilidades documentadas
- [ ] Solução ou workaround proposto para cada caso
- [ ] `docs/SECURITY_MODEL.md` atualizado com achados de CSP

---

### [SEC-05] Security Audit geral da codebase

**Título:** `security: realizar security audit da codebase antes da publicação`  
**Labels:** `security`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Revisar toda a codebase em busca de vulnerabilidades de segurança, incluindo uso incorreto de `innerHTML`, referências a dados de usuário, uso de `eval`, dependências com vulnerabilidades conhecidas.

**Referência:** BIG_PESQUISA §3.1, COPILOT_INSTRUCTIONS

**Critérios de Aceite:**
- [ ] Revisão completa de `src/extension/` e `src/plugin/`
- [ ] Nenhum uso inseguro de `innerHTML` sem sanitização
- [ ] Nenhum uso de `eval()`
- [ ] Dependências auditadas com `npm audit`
- [ ] `docs/SECURITY_FINDINGS.md` criado com resultados

---

## 🧩 Fase 1 — Desenvolvimento: Chrome Extension (Semanas 4-12)

### [EXT-01] Implementar Popup UI da Extension

**Título:** `feat(extension): implementar popup UI com React e TailwindCSS`  
**Labels:** `extension`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar o componente de popup (`src/extension/src/popup.tsx`) com botão "Ativar Inspetor", status de captura, botão de acesso ao histórico e indicadores visuais de estado.

**Stack:** React + TypeScript + TailwindCSS + Plasmo

**Critérios de Aceite:**
- [ ] Popup abre ao clicar no ícone da extensão
- [ ] Botão "Ativar Inspetor" presente e funcional
- [ ] Status atual exibido (Inativo / Ativo / Capturando)
- [ ] Link para histórico de capturas
- [ ] Testes unitários cobrindo componentes principais

---

### [EXT-02] Implementar Element Picker com overlay visual

**Título:** `feat(extension): implementar element picker com overlay de highlight`  
**Labels:** `extension`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar o Content Script (`src/extension/src/content.ts`) que, quando ativado, exibe um overlay visual ao passar o mouse sobre elementos DOM e captura o elemento ao clicar.

**Referência:** ENGENHARIA_REVERSA_REFORE §3.1

**Critérios de Aceite:**
- [ ] Overlay exibido ao hover sobre elementos
- [ ] Elemento capturado ao clicar
- [ ] Modo de captura cancelável (Esc ou botão)
- [ ] Sem interferência com interações normais da página
- [ ] Funciona em Chrome 120+

---

### [EXT-03] Implementar captura de estilos com DOMPurify

**Título:** `feat(extension): implementar captura de estilos CSS computados com sanitização DOMPurify`  
**Labels:** `extension`, `security`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Implementar em `src/extension/src/utils/domPurify.ts` a captura de todos os estilos computados do elemento selecionado usando `window.getComputedStyle()`, incluindo pseudo-elementos `::before` e `::after`, com sanitização via DOMPurify.

**Referência:** BIG_PESQUISA §2.4, ENGENHARIA_REVERSA_REFORE §3.3

**Critérios de Aceite:**
- [ ] Estilos computados capturados (cor, font, padding, margin, etc.)
- [ ] Pseudo-elementos `::before` e `::after` capturados
- [ ] Bounding box (x, y, width, height) incluída
- [ ] HTML sanitizado com DOMPurify antes de gerar JSON
- [ ] Dados sensíveis em `data-*` removidos
- [ ] Cobertura de testes ≥ 80%

---

### [EXT-04] Implementar armazenamento local com IndexedDB

**Título:** `feat(extension): implementar armazenamento de capturas com IndexedDB`  
**Labels:** `extension`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `src/extension/src/utils/storage.ts` com funções para salvar, listar, buscar e deletar capturas no IndexedDB do browser.

**Referência:** ENGENHARIA_REVERSA_REFORE §3.1

**Critérios de Aceite:**
- [ ] Captura salva no IndexedDB ao clicar em elemento
- [ ] Lista de capturas recuperável
- [ ] Captura deletável individualmente
- [ ] Histórico limitado a 10 capturas por padrão (configurável)
- [ ] Limpeza automática de capturas antigas

---

### [EXT-05] Implementar histórico de capturas no Popup

**Título:** `feat(extension): implementar tela de histórico de capturas`  
**Labels:** `extension`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Adicionar tela de histórico ao popup que lista as capturas salvas localmente, com preview, data/hora, URL de origem e opções de exportar ou deletar.

**Critérios de Aceite:**
- [ ] Lista de capturas exibida no popup
- [ ] Preview do elemento capturado visível
- [ ] Data, hora e URL de origem exibidas
- [ ] Captura exportável como JSON
- [ ] Captura deletável com confirmação

---

### [EXT-06] Implementar exportação de JSON

**Título:** `feat(extension): implementar exportação do JSON de captura para clipboard e arquivo`  
**Labels:** `extension`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Implementar a geração do JSON no formato definido no projeto e disponibilizar opções de exportação: copiar para clipboard ou baixar como `.json`.

**Referência:** ENGENHARIA_REVERSA_REFORE §3.3

**Formato esperado:**
```json
{
  "version": "1.0",
  "timestamp": "...",
  "url": "...",
  "viewport": { "width": 1440, "height": 900 },
  "element": {
    "id": "...", "tagName": "...", "styles": {},
    "pseudo": { "before": {}, "after": {} },
    "children": [], "boundingBox": {}
  }
}
```

**Critérios de Aceite:**
- [ ] JSON gerado no formato correto
- [ ] Opção de copiar para clipboard
- [ ] Opção de baixar como arquivo `.json`
- [ ] JSON validado contra schema antes de exportar

---

## 🎨 Fase 1 — Desenvolvimento: Figma Plugin (Semanas 4-12)

### [PLUG-01] Implementar UI de importação do Plugin

**Título:** `feat(plugin): implementar interface de importação com drag-and-drop`  
**Labels:** `plugin`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar o componente de UI do plugin (`src/plugin/src/ui.tsx`) com área de drag-and-drop para arquivo JSON, campo de texto para colar JSON, botão de importação e área de feedback de status.

**Critérios de Aceite:**
- [ ] Drag-and-drop de arquivo `.json` funciona
- [ ] Campo de texto aceita JSON colado
- [ ] Botão "Importar" visível e funcional
- [ ] Status de importação exibido (Idle / Importando / Concluído / Erro)
- [ ] Mensagens de erro claras e informativas

---

### [PLUG-02] Implementar validação de JSON com schema

**Título:** `feat(plugin): implementar validação de JSON de entrada contra schema`  
**Labels:** `plugin`, `security`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `src/plugin/src/utils/validation.ts` com funções para validar o JSON recebido contra o schema esperado, rejeitando entradas malformadas ou com campos inesperados.

**Critérios de Aceite:**
- [ ] JSON com campos obrigatórios ausentes é rejeitado
- [ ] JSON com tipos incorretos é rejeitado
- [ ] JSON com campos adicionais inesperados é ignorado de forma segura
- [ ] Mensagens de erro descritivas para o usuário
- [ ] Testes unitários para casos válidos e inválidos

---

### [PLUG-03] Implementar renderização em chunks no Figma

**Título:** `feat(plugin): implementar renderização de nós em chunks de 50 para evitar travamento`  
**Labels:** `plugin`, `performance`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `src/plugin/src/utils/rendering.ts` com função que renderiza os nós Figma em lotes de 50, com `setTimeout` entre chunks para manter a UI responsiva. Incluir progress bar e estimativa de tempo.

**Referência:** BIG_PESQUISA §4.1, PROTO-06

**Critérios de Aceite:**
- [ ] Renderização ocorre em chunks de 50 nós
- [ ] UI do Figma não trava durante importação
- [ ] Progress bar exibido com porcentagem
- [ ] Estimativa de tempo restante exibida
- [ ] Cancelamento da importação possível

---

### [PLUG-04] Implementar mapeamento CSS → Figma (Style Mapper)

**Título:** `feat(plugin): implementar mapeamento de propriedades CSS para propriedades Figma`  
**Labels:** `plugin`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `src/plugin/src/parser/styleMapper.ts` para converter propriedades CSS computadas em propriedades da Figma API:
- `background-color` → `fills`
- `border-radius` → `cornerRadius`
- `box-shadow` → `effects`
- `font-family`, `font-size`, `font-weight` → `fontName`, `fontSize`
- `color` → `fills` (em TextNode)
- `opacity` → `opacity`

**Critérios de Aceite:**
- [ ] Cores (hex, rgb, rgba, hsl) corretamente convertidas para `{ r, g, b, a }` Figma
- [ ] Border radius convertido corretamente
- [ ] Box shadow convertido para effects Figma
- [ ] Opacidade convertida
- [ ] Cobertura de testes ≥ 80%

---

### [PLUG-05] Implementar Auto Layout (Flexbox → Figma Auto Layout)

**Título:** `feat(plugin): implementar conversão de CSS Flexbox para Figma Auto Layout`  
**Labels:** `plugin`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Quando o elemento capturado usa `display: flex`, criar frames Figma com Auto Layout configurado corretamente: `layoutMode` (HORIZONTAL/VERTICAL), `itemSpacing` (gap), `paddingLeft/Right/Top/Bottom`.

**Referência:** ENGENHARIA_REVERSA_REFORE §3.2

**Critérios de Aceite:**
- [ ] `display: flex` + `flex-direction: row` → `layoutMode: HORIZONTAL`
- [ ] `display: flex` + `flex-direction: column` → `layoutMode: VERTICAL`
- [ ] `gap` → `itemSpacing`
- [ ] `padding` → `paddingLeft/Right/Top/Bottom`
- [ ] Elementos sem flex → Frame simples sem Auto Layout
- [ ] Testes unitários para cada caso

---

### [PLUG-06] Implementar Font Fallback Map

**Título:** `feat(plugin): implementar mapeamento de fontes web para fontes disponíveis no Figma`  
**Labels:** `plugin`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `src/plugin/src/utils/fontFallback.ts` com mapa de fontes web comuns para equivalentes disponíveis no Figma (ex: `system-ui` → `Inter`, `Georgia` → `Georgia`, fontes Google Fonts, etc.).

**Referência:** PROXIMOS_PASSOS_ROADMAP.md §3.4 (FONT_FALLBACK_MAP.md)

**Critérios de Aceite:**
- [ ] Mapa cobrindo as 20+ fontes web mais comuns
- [ ] Fallback para `Inter` quando fonte não encontrada
- [ ] Aviso ao usuário quando fonte é substituída
- [ ] Lista de substituições incluída no relatório de importação
- [ ] Testes unitários para o mapeamento

---

### [PLUG-07] Implementar relatório de importação

**Título:** `feat(plugin): implementar relatório detalhado após importação`  
**Labels:** `plugin`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Ao final de cada importação, exibir um relatório com: quantidade de nós criados, tempo de renderização, fontes substituídas, imagens com erro CORS, propriedades CSS não suportadas e avisos gerais.

**Critérios de Aceite:**
- [ ] Relatório exibido na UI do plugin após importação
- [ ] Quantidade de nós criados informada
- [ ] Fontes substituídas listadas
- [ ] Imagens com CORS error listadas
- [ ] Opção de exportar relatório como `.txt` ou `.md`

---

## 🧪 Fase 1 — Testes (Semanas 4-12)

### [TEST-01] Escrever testes unitários (cobertura ≥ 80%)

**Título:** `test: escrever testes unitários para extension e plugin (cobertura ≥ 80%)`  
**Labels:** `testing`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Escrever testes unitários usando Vitest para todos os módulos utilitários da extension e do plugin, atingindo cobertura mínima de 80%.

**Arquivos prioritários:**
- `src/extension/src/utils/domPurify.ts`
- `src/extension/src/utils/storage.ts`
- `src/plugin/src/parser/styleMapper.ts`
- `src/plugin/src/parser/jsonParser.ts`
- `src/plugin/src/utils/validation.ts`
- `src/plugin/src/utils/fontFallback.ts`

**Critérios de Aceite:**
- [ ] `npm run test:coverage` mostra ≥ 80% para todos os arquivos acima
- [ ] Testes passam sem erros
- [ ] Testes cobrem casos felizes e casos de erro
- [ ] Mocks adequados para APIs externas (chrome.*, figma.*)

---

### [TEST-02] Escrever testes de integração Extension ↔ Plugin

**Título:** `test: escrever testes de integração do fluxo Extension → JSON → Plugin`  
**Labels:** `testing`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `tests/integration/extension-plugin.test.ts` que simule o fluxo completo: captura de elemento → geração de JSON → validação → importação no plugin.

**Critérios de Aceite:**
- [ ] Fluxo completo testado end-to-end
- [ ] JSON gerado pela extension é aceito pelo plugin
- [ ] Erros de validação são propagados corretamente
- [ ] Testes de CORS handling incluídos (`tests/integration/cors.test.ts`)

---

## 📝 Fase 1 — Documentação (Semanas 4-12)

### [DOC-01] Preencher ARCHITECTURE.md

**Título:** `docs: preencher ARCHITECTURE.md com arquitetura técnica completa`  
**Labels:** `documentation`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Preencher `docs/ARCHITECTURE.md` (atualmente vazio) com a arquitetura técnica do projeto: diagrama de componentes, fluxo de dados, decisões de design e descrição de cada módulo.

**Critérios de Aceite:**
- [ ] Diagrama ASCII de arquitetura incluído
- [ ] Fluxo Extension → JSON → Plugin descrito
- [ ] Cada módulo descrito (popup, content, background, parser, renderer)
- [ ] Decisões de design explicadas (por que DOMPurify, IndexedDB, chunks, etc.)

---

### [DOC-02] Preencher SECURITY_MODEL.md

**Título:** `docs: preencher SECURITY_MODEL.md com modelo de segurança e ameaças`  
**Labels:** `documentation`, `security`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Preencher `docs/SECURITY_MODEL.md` (atualmente vazio) com o modelo de segurança completo: ameaças identificadas, mitigações implementadas, resultados dos testes de segurança e recomendações.

**Critérios de Aceite:**
- [ ] Todas as ameaças identificadas nos testes listadas
- [ ] Mitigações para cada ameaça descritas
- [ ] Resultados do security audit incluídos
- [ ] Política de divulgação de vulnerabilidades definida

---

### [DOC-03] Criar e preencher LIMITATIONS.md

**Título:** `docs: criar LIMITATIONS.md documentando limitações conhecidas`  
**Labels:** `documentation`, `fase-1`, `good first issue`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `docs/LIMITATIONS.md` documentando o que funciona, o que não funciona, casos de borda conhecidos e workarounds sugeridos.

**Limitações a documentar (baseado em BIG_PESQUISA):**
- Shadow DOM não suportado na Fase 1
- Media queries não capturadas
- Variable fonts não suportadas
- Gradientes radiais/cônicos não capturados
- CORS pode impedir carregamento de imagens externas
- SVG inline não convertido na Fase 1

**Critérios de Aceite:**
- [ ] Seção "O que funciona" preenchida
- [ ] Seção "O que não funciona" preenchida
- [ ] Workarounds sugeridos para cada limitação
- [ ] Roadmap para quando limitações serão resolvidas

---

### [DOC-04] Criar e preencher PERFORMANCE_BENCHMARKS.md

**Título:** `docs: criar PERFORMANCE_BENCHMARKS.md com benchmarks reais dos protótipos`  
**Labels:** `documentation`, `performance`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `docs/PERFORMANCE_BENCHMARKS.md` com os benchmarks reais medidos durante a fase de validação (Protótipos PROTO-01, PROTO-05, PROTO-06).

**Critérios de Aceite:**
- [ ] Benchmarks de Figma API por número de nós
- [ ] Memory usage durante captura e importação
- [ ] Tempo de renderização em chunks
- [ ] Tamanho de JSON por complexidade de elemento
- [ ] Recomendações de limites baseadas nos números reais

---

### [DOC-05] Criar GLOSSARY.md

**Título:** `docs: criar GLOSSARY.md com termos técnicos do projeto`  
**Labels:** `documentation`, `fase-1`, `good first issue`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `docs/GLOSSARY.md` com definições dos termos técnicos usados no projeto: Shadow DOM, Content Script, Isolated World, CSP, DOMPurify, Figma Auto Layout, bounding box, etc.

**Critérios de Aceite:**
- [ ] 20+ termos técnicos definidos
- [ ] Termos em ordem alfabética
- [ ] Links para referências externas (MDN, Figma Docs) incluídos

---

### [DOC-06] Criar TROUBLESHOOTING.md

**Título:** `docs: criar TROUBLESHOOTING.md com problemas comuns e soluções`  
**Labels:** `documentation`, `fase-1`  
**Milestone:** Semana 4-12: Desenvolvimento

**Descrição:**
Criar `docs/TROUBLESHOOTING.md` documentando problemas comuns que usuários podem encontrar e suas soluções.

**Problemas a cobrir:**
- Extensão não captura elemento (CSP bloqueando?)
- Imagens aparecem quebradas no Figma (CORS)
- Figma trava durante importação (muitos elementos)
- Fontes erradas no Figma (font fallback)
- JSON inválido (schema mismatch)

**Critérios de Aceite:**
- [ ] 10+ problemas comuns documentados
- [ ] Cada problema tem: sintoma, causa, solução
- [ ] Links para issues relacionadas

---

## 📦 Fase 1 — Publicação (Semana 12+)

### [PUB-01] Preparar submissão para Chrome Web Store

**Título:** `feat(publish): preparar assets e submissão para Chrome Web Store`  
**Labels:** `fase-1`  
**Milestone:** Semana 12+: Publicação

**Descrição:**
Preparar todos os assets necessários para submissão da extensão na Chrome Web Store: screenshots (1280×800), ícones (128×128, 48×48, 16×16), descrição, privacy policy e manifest final.

**Referência:** PROXIMOS_PASSOS_ROADMAP.md §4.1

**Critérios de Aceite:**
- [ ] `docs/CHROME_WEB_STORE_SUBMISSION.md` criado
- [ ] 3+ screenshots preparados
- [ ] Ícones em todos os tamanhos
- [ ] Descrição em português e inglês
- [ ] Privacy policy criada
- [ ] Extensão submetida para review

---

### [PUB-02] Preparar submissão para Figma Community

**Título:** `feat(publish): preparar assets e submissão para Figma Community`  
**Labels:** `fase-1`  
**Milestone:** Semana 12+: Publicação

**Descrição:**
Preparar todos os assets necessários para publicação do plugin no Figma Community: cover image (1920×960), screenshots, descrição e documentação de uso.

**Referência:** PROXIMOS_PASSOS_ROADMAP.md §4.2

**Critérios de Aceite:**
- [ ] `docs/FIGMA_COMMUNITY_SUBMISSION.md` criado
- [ ] Cover image preparada
- [ ] 3+ screenshots do plugin em uso
- [ ] Descrição em português e inglês
- [ ] Plugin submetido para review

---

## 🚀 Fase 2 — MVP+ (Futuro)

### [F2-01] Suporte a captura multi-viewport (mobile, tablet, desktop)

**Título:** `feat(extension): implementar captura em múltiplos viewports`  
**Labels:** `extension`, `enhancement`, `fase-2`  
**Milestone:** Fase 2: MVP+

**Descrição:**
Adicionar opção de capturar o mesmo elemento em diferentes viewports (mobile 375px, tablet 768px, desktop 1440px), armazenando múltiplas capturas por URL.

**Referência:** BIG_PESQUISA §2.2, §7.1

---

### [F2-02] Suporte a Shadow DOM e Web Components

**Título:** `feat(extension): implementar suporte a Shadow DOM`  
**Labels:** `extension`, `enhancement`, `fase-2`  
**Milestone:** Fase 2: MVP+

**Descrição:**
Usar `element.shadowRoot` para acessar o shadow tree de Web Components (Material Design, Shoelace, etc.) e capturar seus estilos internos.

**Referência:** BIG_PESQUISA §2.1

---

### [F2-03] Análise de acessibilidade (ARIA, color contrast)

**Título:** `feat(plugin): implementar análise de acessibilidade no relatório de importação`  
**Labels:** `plugin`, `enhancement`, `fase-2`  
**Milestone:** Fase 2: MVP+

**Descrição:**
Integrar axe-core para analisar acessibilidade dos elementos capturados: ARIA attributes faltando, color contrast insuficiente (WCAG AA/AAA), semantic HTML não preservado.

**Referência:** BIG_PESQUISA §2.8, §7.2

---

### [F2-04] Suporte a SVG inline e icon fonts

**Título:** `feat(extension): implementar captura e conversão de SVG inline e icon fonts`  
**Labels:** `extension`, `plugin`, `enhancement`, `fase-2`  
**Milestone:** Fase 2: MVP+

**Descrição:**
Capturar elementos `<svg>` inline e icon fonts (`<i class="fa fa-star">`) e convertê-los para vector shapes no Figma.

**Referência:** BIG_PESQUISA §2.10

---

### [F2-05] Suporte a CSS avançado (gradientes, filtros, blend modes)

**Título:** `feat(plugin): adicionar suporte a gradientes, filtros CSS e blend modes`  
**Labels:** `plugin`, `enhancement`, `fase-2`  
**Milestone:** Fase 2: MVP+

**Descrição:**
Adicionar mapeamento para `background: linear-gradient(...)`, `filter: blur()`, `mix-blend-mode` para os equivalentes no Figma (gradient fills, effects, blend modes).

**Referência:** BIG_PESQUISA §2.7

---

### [F2-06] Suporte a variable fonts

**Título:** `feat(plugin): adicionar suporte a variable fonts`  
**Labels:** `plugin`, `enhancement`, `fase-2`  
**Milestone:** Fase 2: MVP+

**Descrição:**
Detectar e mapear variable fonts (Roboto Flex, Inter Variable, etc.) para os equivalentes disponíveis no Figma, preservando `font-variation-settings`.

**Referência:** BIG_PESQUISA §2.6

---

## 🤖 Fase 3 — Produção (Futuro)

### [F3-01] AI Auto-rename de camadas

**Título:** `feat(plugin): implementar AI auto-rename de camadas no Figma`  
**Labels:** `plugin`, `enhancement`, `fase-3`  
**Milestone:** Fase 3: Produção

**Descrição:**
Usar IA (GPT ou modelo local) para gerar nomes descritivos para as camadas Figma criadas durante a importação, substituindo nomes genéricos como `div`, `span` por nomes semânticos como `Card de Produto`, `Botão de Ação`.

**Referência:** BIG_PESQUISA §7.4, ENGENHARIA_REVERSA §5.1

---

### [F3-02] Integração com Design Systems (Figma Tokens, Storybook)

**Título:** `feat(plugin): implementar integração com design systems`  
**Labels:** `plugin`, `enhancement`, `fase-3`  
**Milestone:** Fase 3: Produção

**Descrição:**
Detectar automaticamente design tokens (cores, tipografia, espaçamento) nos elementos capturados e vinculá-los a variáveis ou estilos do Figma.

**Referência:** BIG_PESQUISA §7.3

---

### [F3-03] Implementar sistema de monetização via quotas

**Título:** `feat(infra): implementar sistema de monetização com free/pro quotas`  
**Labels:** `infrastructure`, `enhancement`, `fase-3`  
**Milestone:** Fase 3: Produção

**Descrição:**
Implementar plano gratuito (40 capturas/semana) e plano Pro (ilimitado) com sistema de autenticação e controle de quotas.

**Referência:** BIG_PESQUISA §7.6

---

## 📊 Resumo de Issues por Categoria

| Categoria | Qtd | Fase |
| :--- | :---: | :--- |
| Infrastructure | 3 | Fase 1 |
| Protótipos de Validação | 6 | Fase 1 |
| Segurança | 5 | Fase 1 |
| Chrome Extension | 6 | Fase 1 |
| Figma Plugin | 7 | Fase 1 |
| Testes | 2 | Fase 1 |
| Documentação | 6 | Fase 1 |
| Publicação | 2 | Fase 1 |
| **Total Fase 1** | **37** | |
| MVP+ Features | 6 | Fase 2 |
| Produção Features | 3 | Fase 3 |
| **Total Geral** | **46** | |

---

## ✅ Ordem Sugerida de Criação das Issues no GitHub

1. **Semana 1:** INFRA-01, INFRA-02, INFRA-03
2. **Semana 2:** PROTO-01 a PROTO-06
3. **Semana 2-3:** SEC-01 a SEC-04
4. **Semana 4:** EXT-01 a EXT-06, PLUG-01 a PLUG-07
5. **Semana 4:** TEST-01, TEST-02, DOC-01 a DOC-06
6. **Semana 12:** PUB-01, PUB-02
7. **Futuro:** F2-01 a F2-06, F3-01 a F3-03
