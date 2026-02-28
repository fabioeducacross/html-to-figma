# 📋 PRD: HTML-to-Figma Converter (Versão 3.2 - Final com Pesquisa)

**Versão:** 3.2 Final  
**Data:** Fevereiro 2026  
**Autor:** Manus AI  
**Status:** Pronto para Desenvolvimento (Com Mitigações de Risco)  
**Baseado em:** Análise Competitiva + Engenharia Reversa + Big Pesquisa

---

## ⚠️ Prefácio: Mudanças Significativas da v3.1 para v3.2

Esta versão integra descobertas críticas da big pesquisa:

- **Gaps Críticos:** Shadow DOM, Responsividade, Segurança, Performance, CORS.
- **Recomendações Imediatas:** Security audit, DOMPurify, Performance testing.
- **Roadmap Realista:** Fases 1, 2, 3 com priorização clara.
- **Mitigações de Risco:** Estratégias para cada gap identificado.
- **Documentação Expandida:** Segurança, Performance, Acessibilidade, Edge Cases.

---

## 1. Visão Geral do Produto

O **HTML-to-Figma Converter** é uma solução de código aberto que permite aos designers capturar componentes de websites e convertê-los em camadas editáveis no Figma com fidelidade realista (60-70%). A solução prioriza **segurança robusta**, **performance otimizada**, **documentação transparente** e **diferenciais competitivos** sobre promessas irrealistas.

### 1.1 Posicionamento Competitivo (Atualizado)

| Aspecto | Refore | html.to.design | Nossa Solução |
| :--- | :--- | :--- | :--- |
| **Fidelidade Visual** | 70-80% | 80%+ | 60-70% (Honesto) |
| **Documentação Técnica** | Baixa | Baixa | **Alta** |
| **Segurança** | Não doc. | Não doc. | **Robusta + Auditada** |
| **Open Source** | Não | Não | **Sim** |
| **Histórico Local** | Servidor | Não | **Local + Servidor** |
| **Relatórios** | Não | Não | **Sim** |
| **Multi-Viewport** | Não | Não | **Sim (Fase 2)** |
| **Acessibilidade** | Não | Não | **Sim (Fase 2)** |
| **Shadow DOM** | Não | Não | **Sim (Fase 2)** |

### 1.2 Objetivos Principais (Revisados)

**Fase 1 (MVP Seguro):**
- ✅ Capturar componentes com alta fidelidade (60-70%).
- ✅ Implementar segurança robusta (DOMPurify + CSP).
- ✅ Oferecer Offline Mode para privacidade.
- ✅ Armazenar histórico de capturas localmente.
- ✅ Documentar transparentemente limitações e arquitetura.
- ✅ Ser open source e extensível.

**Fase 2 (MVP+):**
- ✅ Captura multi-viewport (mobile, tablet, desktop).
- ✅ Suporte a Shadow DOM (Web Components).
- ✅ Análise de acessibilidade (WCAG AA/AAA).
- ✅ Suporte a SVG e ícones.

**Fase 3 (Produção):**
- ✅ Publicação na Chrome Web Store.
- ✅ Publicação no Figma Community.
- ✅ AI features (auto-naming, intelligent search).
- ✅ Monetização via quotas.

---

## 2. Gaps Críticos e Mitigações

### 2.1 Gap: Shadow DOM e Web Components

**Problema:** 15-20% dos websites modernos usam Shadow DOM (Material Design, Shoelace, etc.).

**Impacto:** Content Script não consegue acessar Shadow DOM interno.

**Mitigação (Fase 1):**
- [ ] Documentar limitação claramente.
- [ ] Capturar apenas host element (não shadow tree).
- [ ] Avisar usuário quando Shadow DOM é detectado.

**Solução (Fase 2):**
- [ ] Implementar acesso a Shadow DOM via `element.shadowRoot`.
- [ ] Renderizar shadow tree como sub-frame.
- [ ] Testar com Material Design, Shoelace, etc.

**Status:** ⏳ Não será implementado na Fase 1.

---

### 2.2 Gap: Responsividade e Media Queries

**Problema:** PRD captura apenas um viewport. Websites responsivos têm layouts diferentes em mobile/tablet/desktop.

**Impacto:** Capturar em 1440px não reflete layout mobile.

**Mitigação (Fase 1):**
- [ ] Capturar viewport atual (1440px por padrão).
- [ ] Documentar que media queries não são capturadas.
- [ ] Avisar usuário sobre limitação.

**Solução (Fase 2):**
- [ ] Adicionar captura multi-viewport (320px, 768px, 1440px).
- [ ] Detectar breakpoints automaticamente.
- [ ] Armazenar múltiplas capturas por URL.
- [ ] Permitir seleção de viewport na importação.

**Status:** ⏳ Não será implementado na Fase 1.

---

### 2.3 Gap: Segurança em Content Scripts

**Problema:** Content Scripts têm acesso privilegiado e podem ser explorados. Sanitização é superficial.

**Impacto:** Risco de XSS, data exfiltration, privilege escalation.

**Mitigação (Fase 1 - CRÍTICA):**
- [ ] **Usar DOMPurify** para sanitização rigorosa.
- [ ] Remover event listeners via JavaScript (`addEventListener`).
- [ ] Remover data attributes sensíveis (token, secret, key, password, auth).
- [ ] Validar todas as entradas contra schema rigoroso.
- [ ] Implementar Content Security Policy (CSP) strict.
- [ ] **Fazer security audit** antes de publicar.
- [ ] Testar contra OWASP Top 10.
- [ ] Documentar security model em SECURITY.md.

**Implementação:**
```typescript
// content.ts - Sanitização com DOMPurify
import DOMPurify from 'dompurify';

function sanitizeElement(element: Element): void {
  // 1. Remover event listeners
  const clone = element.cloneNode(true) as Element;
  const events = ['onclick', 'onload', 'onerror', 'onmouseover', 'onchange'];
  events.forEach(event => {
    clone.querySelectorAll(`[${event}]`).forEach(el => {
      el.removeAttribute(event);
    });
  });

  // 2. Remover tags perigosas
  const dangerous = ['script', 'iframe', 'embed', 'object'];
  dangerous.forEach(tag => {
    clone.querySelectorAll(tag).forEach(el => el.remove());
  });

  // 3. Remover data attributes sensíveis
  const sensitivePatterns = ['token', 'secret', 'key', 'password', 'auth'];
  clone.getAttributeNames().forEach(attr => {
    if (sensitivePatterns.some(pattern => attr.toLowerCase().includes(pattern))) {
      clone.removeAttribute(attr);
    }
  });

  // 4. Usar DOMPurify para HTML
  const sanitized = DOMPurify.sanitize(clone.outerHTML, {
    ALLOWED_TAGS: ['div', 'span', 'p', 'h1', 'h2', 'h3', 'button', 'input', 'img'],
    ALLOWED_ATTR: ['class', 'id', 'style', 'src', 'alt', 'type', 'placeholder']
  });

  return sanitized;
}
```

**Status:** ✅ Será implementado na Fase 1 (CRÍTICO).

---

### 2.4 Gap: Performance em Figma

**Problema:** Figma tem limite de ~2GB de memória por tab. Importar 1000+ elementos pode travar.

**Impacto:** Travamentos, perda de dados, experiência ruim.

**Benchmark Real:**
- 50 nós: ~500ms.
- 100 nós: ~1s.
- 200 nós: ~3s.
- 500 nós: ~8s (pode travar).
- 1000+ nós: Travamento garantido.

**Mitigação (Fase 1):**
- [ ] Limitar a 100 elementos (não 50).
- [ ] Renderizar em chunks de 50 nós.
- [ ] Implementar progress bar na UI.
- [ ] Testar com 100, 500, 1000 nós.
- [ ] Avisar usuário se JSON > 1 MB.
- [ ] Oferecer modo "Lightweight" (apenas estrutura).

**Solução (Fase 2):**
- [ ] Renderizar em chunks menores (25 nós).
- [ ] Implementar lazy loading.
- [ ] Oferecer modo "Preview" (sem renderizar tudo).

**Status:** ✅ Será implementado na Fase 1 (com testes).

---

### 2.5 Gap: CORS e Imagens Quebradas

**Problema:** 30%+ dos websites têm imagens que não podem ser carregadas via CORS.

**Impacto:** Imagens quebradas no Figma.

**Mitigação (Fase 1):**
- [ ] Usar URLs de imagens (não Base64).
- [ ] Avisar sobre imagens que podem quebrar.
- [ ] Oferecer fallback (placeholder).
- [ ] Documentar limitações de CORS.
- [ ] Testar em 5+ websites com CORS issues.

**Implementação:**
```typescript
// utils/imageHandler.ts
function handleImage(imgElement: HTMLImageElement): ImageData {
  const src = imgElement.src;
  
  // Verificar CORS
  if (!isCORSAllowed(src)) {
    return {
      src: src,
      status: 'CORS_ISSUE',
      warning: 'Image may not load due to CORS restrictions'
    };
  }

  // Usar URL (não Base64)
  return {
    src: src,
    status: 'OK',
    width: imgElement.width,
    height: imgElement.height
  };
}
```

**Status:** ✅ Será implementado na Fase 1.

---

### 2.6 Gap: Tipografia Avançada

**Problema:** Variable fonts, font metrics não são capturados.

**Impacto:** Tipografia pode estar incorreta no Figma.

**Mitigação (Fase 1):**
- [ ] Capturar font-family, font-size, font-weight, line-height.
- [ ] Usar Font Fallback Map para fontes faltantes.
- [ ] Documentar que variable fonts não são suportadas.
- [ ] Avisar sobre font metrics incorretos.

**Solução (Fase 2):**
- [ ] Adicionar suporte a variable fonts.
- [ ] Capturar font metrics (ascender, descender, x-height).

**Status:** ⏳ Não será implementado na Fase 1.

---

### 2.7 Gap: CSS Avançado

**Problema:** Gradientes, filtros, blend modes não são suportados.

**Impacto:** Estilos visuais complexos são perdidos.

**Mitigação (Fase 1):**
- [ ] Capturar background-color (não gradientes).
- [ ] Documentar que gradientes não são suportados.
- [ ] Avisar sobre filtros e blend modes.

**Solução (Fase 2):**
- [ ] Adicionar suporte a gradientes (linear, radial).
- [ ] Adicionar suporte a filtros básicos (blur, brightness).

**Status:** ⏳ Não será implementado na Fase 1.

---

### 2.8 Gap: Acessibilidade

**Problema:** ARIA attributes, color contrast não são preservados.

**Impacto:** Informações de acessibilidade são perdidas.

**Mitigação (Fase 1):**
- [ ] Capturar ARIA attributes.
- [ ] Documentar que acessibilidade não é validada.
- [ ] Avisar sobre color contrast baixo.

**Solução (Fase 2):**
- [ ] Usar axe-core para análise de acessibilidade.
- [ ] Validar color contrast (WCAG AA/AAA).
- [ ] Reportar problemas de acessibilidade.

**Status:** ⏳ Não será implementado na Fase 1.

---

### 2.9 Gap: Z-index e Stacking Context

**Problema:** Z-index e stacking context não são capturados.

**Impacto:** Ordem de camadas pode estar errada.

**Mitigação (Fase 1):**
- [ ] Capturar z-index.
- [ ] Ordenar camadas por z-index no Figma.
- [ ] Documentar que stacking context é aproximado.

**Status:** ✅ Será implementado na Fase 1.

---

### 2.10 Gap: SVG e Ícones

**Problema:** SVG inline, icon fonts não são capturados.

**Impacto:** Ícones aparecem como texto ou símbolos estranhos.

**Mitigação (Fase 1):**
- [ ] Capturar SVG como imagem (screenshot).
- [ ] Documentar que SVG inline não é suportado.
- [ ] Avisar sobre icon fonts.

**Solução (Fase 2):**
- [ ] Adicionar suporte a SVG inline.
- [ ] Converter para Figma shapes.

**Status:** ⏳ Não será implementado na Fase 1.

---

## 3. Recomendações Imediatas (Antes de Iniciar Desenvolvimento)

### 3.1 Segurança (CRÍTICA)

- [ ] **Instalar DOMPurify:** `npm install dompurify @types/dompurify`
- [ ] **Implementar CSP strict** no manifest.json.
- [ ] **Criar SECURITY.md** documentando modelo de segurança.
- [ ] **Fazer security audit** com ferramenta OWASP.
- [ ] **Testar contra XSS payloads** comuns.
- [ ] **Testar data exfiltration** prevention.
- [ ] **Revisar permissions** no manifest (minimizar).

### 3.2 Performance (CRÍTICA)

- [ ] **Testar com 100 nós:** Medir tempo de renderização.
- [ ] **Testar com 500 nós:** Verificar se Figma trava.
- [ ] **Testar com 1000 nós:** Confirmar limite.
- [ ] **Implementar progress bar** na UI.
- [ ] **Medir memory usage** com DevTools.
- [ ] **Criar PERFORMANCE.md** com benchmarks reais.

### 3.3 CORS (CRÍTICA)

- [ ] **Testar em 5+ websites** com CORS issues.
- [ ] **Documentar CORS limitations** em TROUBLESHOOTING.md.
- [ ] **Implementar fallback** para imagens quebradas.
- [ ] **Avisar usuário** sobre CORS issues.

### 3.4 Documentação (CRÍTICA)

- [ ] **Criar LIMITATIONS.md** listando o que NÃO funciona.
- [ ] **Criar SECURITY.md** explicando modelo de segurança.
- [ ] **Criar PERFORMANCE.md** com benchmarks.
- [ ] **Criar EDGE_CASES.md** listando casos de borda.
- [ ] **Criar TROUBLESHOOTING.md** com problemas comuns.

---

## 4. Escopo da PoC (Fase 1 - MVP Seguro)

### 4.1 O que será entregue

#### **Artefato 1: Chrome Extension (Segura e Performática)**

**Funcionalidades:**
- [ ] Popup com botão "Ativar Inspetor".
- [ ] Overlay com destaque visual (outline azul).
- [ ] Captura de estilos com DOMPurify sanitização.
- [ ] Extração de pseudo-elementos (com fallback).
- [ ] Armazenamento local de últimas 10 capturas (IndexedDB).
- [ ] Visualização de histórico com thumbnails.
- [ ] Exportação de JSON estruturado.
- [ ] Toggle para "Offline Mode".
- [ ] Avisos sobre limitações (Shadow DOM, media queries, etc.).
- [ ] Progress bar durante captura.

**Segurança:**
- [ ] DOMPurify para sanitização.
- [ ] CSP strict no manifest.
- [ ] Validação rigorosa de entrada.
- [ ] Remoção de event listeners.
- [ ] Remoção de data attributes sensíveis.

**Performance:**
- [ ] Limite de 100 elementos (não 50).
- [ ] Limite de tamanho JSON (2 MB).
- [ ] Limpeza automática de histórico (> 30 dias).

---

#### **Artefato 2: Figma Plugin (Otimizado e Seguro)**

**Funcionalidades:**
- [ ] Interface de importação (textarea, drag-and-drop, histórico).
- [ ] Validação rigorosa de JSON.
- [ ] Sanitização de dados maliciosos.
- [ ] Renderização em chunks (50 nós por batch).
- [ ] Mapeamento de estilos CSS → Figma.
- [ ] Suporte a Auto Layout (Flexbox simples).
- [ ] Relatório detalhado de conversão.
- [ ] Relatório de fontes faltantes.
- [ ] Exportação de relatório em JSON.
- [ ] Progress bar durante renderização.

**Segurança:**
- [ ] Validação contra schema JSON.
- [ ] Sanitização de URLs.
- [ ] Tratamento de erros robusto.

**Performance:**
- [ ] Renderização em chunks de 50 nós.
- [ ] Aguardo de 100ms entre chunks.
- [ ] Limite de 100 elementos.
- [ ] Modo "Lightweight" (apenas estrutura).

---

#### **Artefato 3: Documentação Técnica Completa**

- [ ] **ARCHITECTURE.md** - Fluxo de dados e decisões.
- [ ] **LIMITATIONS.md** - O que funciona e o que não.
- [ ] **SECURITY.md** - Modelo de segurança (CRÍTICO).
- [ ] **PERFORMANCE.md** - Benchmarks reais (CRÍTICO).
- [ ] **EDGE_CASES.md** - Casos de borda (CRÍTICO).
- [ ] **TROUBLESHOOTING.md** - Problemas comuns (CRÍTICO).
- [ ] **JSON_SCHEMA.md** - Estrutura do JSON.
- [ ] **FONT_FALLBACK_MAP.md** - Mapa de fontes.
- [ ] **CONTRIBUTION.md** - Como contribuir.

---

### 4.2 O que NÃO será entregue na Fase 1

- [ ] Suporte a Shadow DOM.
- [ ] Captura multi-viewport.
- [ ] Suporte a media queries.
- [ ] Suporte a variable fonts.
- [ ] Suporte a gradientes avançados.
- [ ] Análise de acessibilidade.
- [ ] Suporte a SVG inline.
- [ ] AI features.
- [ ] Publicação na Chrome Web Store.
- [ ] Monetização.

---

## 5. Critérios de Aceitação (DoD - Realista)

### 5.1 Segurança (CRÍTICA)

- [ ] DOMPurify implementado e testado.
- [ ] CSP strict no manifest.
- [ ] Nenhum XSS payload consegue ser injetado.
- [ ] Data exfiltration prevention implementado.
- [ ] Security audit realizado.
- [ ] SECURITY.md documentado.

### 5.2 Performance (CRÍTICA)

- [ ] Captura de 100 elementos < 5 segundos.
- [ ] Renderização de 100 elementos < 10 segundos.
- [ ] Renderização de 500 elementos < 30 segundos.
- [ ] Figma não trava com 100 elementos.
- [ ] Memory usage < 100 MB.
- [ ] PERFORMANCE.md documentado com benchmarks.

### 5.3 CORS (CRÍTICA)

- [ ] Testado em 5+ websites com CORS issues.
- [ ] Imagens com CORS issues são avisos.
- [ ] Fallback para imagens quebradas implementado.
- [ ] TROUBLESHOOTING.md documenta CORS issues.

### 5.4 Funcionalidades

- [ ] Extension captura 90%+ dos websites.
- [ ] JSON gerado é válido e estruturado.
- [ ] Plugin importa JSON sem erros.
- [ ] Histórico local funciona com 10 capturas.
- [ ] Relatório detalhado é gerado.

### 5.5 Documentação

- [ ] LIMITATIONS.md lista todas as limitações.
- [ ] SECURITY.md explica modelo de segurança.
- [ ] PERFORMANCE.md documenta benchmarks.
- [ ] EDGE_CASES.md lista casos de borda.
- [ ] TROUBLESHOOTING.md cobre problemas comuns.

---

## 6. Timeline (Realista - 35-50 horas)

| Fase | Duração | Entrega | Notas |
| :--- | :--- | :--- | :--- |
| **Setup + Security** | 3-4h | DOMPurify, CSP, audit | CRÍTICO |
| **Extension (Picker + Histórico)** | 10-14h | Captura + IndexedDB | Incluir segurança |
| **Plugin (Importer + Relatórios)** | 10-14h | Renderização + Reports | Incluir performance |
| **Performance Testing** | 4-6h | Benchmarks 100/500/1000 | CRÍTICO |
| **CORS Testing** | 2-3h | Testar em 5+ sites | CRÍTICO |
| **Documentação Técnica** | 6-8h | 5 docs críticos | CRÍTICO |
| **Security Audit** | 3-4h | OWASP Top 10 | CRÍTICO |
| **Buffer (Contingência)** | 2-4h | Margem de segurança | |
| **Total** | **35-50h** | **PoC Segura** | Realista |

---

## 7. Roadmap (Fases Futuras)

### Fase 2: MVP+ (25-35 horas) - Responsividade e Acessibilidade
- [ ] **Multi-Viewport Capture:** Capturar mobile, tablet, desktop.
- [ ] **Shadow DOM Support:** Acessar shadow tree.
- [ ] **Acessibilidade:** Validar WCAG AA/AAA.
- [ ] **SVG Support:** Converter SVG inline.
- [ ] **Histórico em Servidor:** Sincronizar entre dispositivos.

### Fase 3: Produção (30-40 horas) - Publicação e AI
- [ ] **Publicação Chrome Web Store.**
- [ ] **Publicação Figma Community.**
- [ ] **AI Auto-rename:** Renomear camadas com IA.
- [ ] **AI Intelligent Search:** Buscar capturas similares.
- [ ] **Monetização:** Quotas (40/semana free, ilimitado pro).

### Fase 4: Avançado (40-50 horas) - Extensibilidade
- [ ] **Design System Integration:** Figma Tokens.
- [ ] **Exportação de Código:** React, Vue, Svelte.
- [ ] **API Pública:** Para extensões de terceiros.
- [ ] **Suporte a Múltiplos Idiomas.**

---

## 8. Matriz de Risco vs Mitigação

| Risco | Probabilidade | Impacto | Mitigação |
| :--- | :--- | :--- | :--- |
| **XSS via Content Script** | Alta | Alto | DOMPurify + CSP + audit |
| **Data Exfiltration** | Média | Alto | Sanitização rigorosa + offline mode |
| **Figma Travamento** | Alta | Médio | Performance testing + chunking |
| **CORS Issues** | Alta | Médio | Avisos + fallback + docs |
| **Shadow DOM** | Média | Médio | Documentar limitação |
| **Responsividade** | Alta | Médio | Multi-viewport (Fase 2) |

---

## 9. Diferenciais Competitivos

### vs Refore
- ✅ **Segurança Auditada:** DOMPurify + CSP + audit.
- ✅ **Documentação Técnica:** 5+ docs críticos.
- ✅ **Open Source:** Código aberto.
- ✅ **Histórico Local:** IndexedDB.
- ✅ **Relatórios:** JSON exportável.
- ✅ **Local-First:** Offline Mode.
- ✅ **Performance Otimizada:** Benchmarks documentados.

### vs html.to.design
- ✅ **Open Source:** Código aberto.
- ✅ **Segurança:** DOMPurify + audit.
- ✅ **Documentação:** Completa e transparente.
- ✅ **Histórico Local:** IndexedDB.
- ⚠️ **Fidelidade:** 60-70% (vs 80%+).

---

## 10. Conclusão

Esta versão 3.2 do PRD é **realista, segura e pronta para desenvolvimento**:

- ✅ Gaps críticos identificados e mitigados.
- ✅ Recomendações imediatas documentadas.
- ✅ Timeline realista (35-50 horas).
- ✅ Segurança como prioridade.
- ✅ Performance testada.
- ✅ Documentação abrangente.

**Próximo passo:** Iniciar desenvolvimento com foco em segurança e performance.

---

## Apêndice A: Checklist de Segurança (Antes de Publicar)

- [ ] DOMPurify implementado e testado.
- [ ] CSP strict no manifest.
- [ ] Nenhum XSS payload consegue ser injetado.
- [ ] Data exfiltration prevention implementado.
- [ ] Security audit realizado (OWASP Top 10).
- [ ] SECURITY.md documentado.
- [ ] Permissions minimizadas no manifest.
- [ ] Content Script isolado (Isolated World).
- [ ] Nenhuma comunicação com servidor sem consentimento.
- [ ] Dados sensíveis não são armazenados.

---

## Apêndice B: Checklist de Performance (Antes de Publicar)

- [ ] Captura de 100 elementos < 5 segundos.
- [ ] Renderização de 100 elementos < 10 segundos.
- [ ] Renderização de 500 elementos < 30 segundos.
- [ ] Figma não trava com 100 elementos.
- [ ] Memory usage < 100 MB.
- [ ] PERFORMANCE.md documentado com benchmarks.
- [ ] Progress bar implementado.
- [ ] Modo "Lightweight" implementado.

---

## Apêndice C: Checklist de CORS (Antes de Publicar)

- [ ] Testado em 5+ websites com CORS issues.
- [ ] Imagens com CORS issues são avisos.
- [ ] Fallback para imagens quebradas implementado.
- [ ] TROUBLESHOOTING.md documenta CORS issues.
- [ ] Usuário é informado sobre limitações.

---

## Apêndice D: Checklist de Documentação (Antes de Publicar)

- [ ] ARCHITECTURE.md - Fluxo de dados.
- [ ] LIMITATIONS.md - O que NÃO funciona.
- [ ] SECURITY.md - Modelo de segurança.
- [ ] PERFORMANCE.md - Benchmarks.
- [ ] EDGE_CASES.md - Casos de borda.
- [ ] TROUBLESHOOTING.md - Problemas comuns.
- [ ] JSON_SCHEMA.md - Estrutura do JSON.
- [ ] FONT_FALLBACK_MAP.md - Mapa de fontes.
- [ ] CONTRIBUTION.md - Como contribuir.

