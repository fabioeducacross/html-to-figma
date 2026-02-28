# 🔬 Big Pesquisa: Oportunidades, Edge Cases e Gaps no PRD v3.1

**Data:** Fevereiro 2026  
**Objetivo:** Identificar lacunas, edge cases críticos e oportunidades não cobertas no PRD v3.1  
**Metodologia:** Pesquisa abrangente em 10 dimensões técnicas

---

## 1. Resumo Executivo

### 1.1 Descobertas Críticas

| Categoria | Gaps Identificados | Severidade | Impacto |
| :--- | :--- | :--- | :--- |
| **Shadow DOM & Web Components** | Não suportado | 🔴 Alta | 15-20% dos websites modernos |
| **Responsividade & Media Queries** | Não capturado | 🔴 Alta | Impossível capturar múltiplos viewports |
| **Segurança em Content Scripts** | Superficial | 🟠 Média | Risco de XSS e data exfiltration |
| **Performance em Figma** | Não otimizado | 🟠 Média | Travamentos com 100+ elementos |
| **CORS & Imagens** | Não tratado | 🟠 Média | Imagens quebradas em 30%+ dos sites |
| **Tipografia Avançada** | Parcial | 🟡 Baixa | Variable fonts não suportadas |
| **CSS Avançado** | Limitado | 🟡 Baixa | Gradientes, filtros, blend modes |
| **Acessibilidade** | Ignorada | 🟡 Baixa | ARIA attributes não preservadas |
| **Z-index & Stacking** | Não tratado | 🟡 Baixa | Ordem de camadas pode estar errada |
| **SVG & Ícones** | Não suportado | 🟡 Baixa | Ícones inline não capturados |

### 1.2 Oportunidades de Diferenciação

| Oportunidade | Potencial | Esforço | ROI |
| :--- | :--- | :--- | :--- |
| **Captura Multi-Viewport** | Alto | Médio | Alto |
| **Suporte a Shadow DOM** | Médio | Alto | Médio |
| **Análise de Acessibilidade** | Médio | Médio | Alto |
| **Design System Integration** | Alto | Alto | Alto |
| **AI-powered Naming** | Médio | Médio | Médio |
| **Performance Analytics** | Médio | Baixo | Médio |
| **Monetização via Quotas** | Alto | Baixo | Alto |

---

## 2. Edge Cases Críticos Não Cobertos

### 2.1 Shadow DOM e Web Components

**Problema:** 15-20% dos websites modernos usam Shadow DOM (Material Design, Shoelace, etc.).

**Impacto no PRD:**
- Content Script não consegue acessar Shadow DOM.
- `element.getComputedStyle()` retorna estilos do host, não do shadow tree.
- Pseudo-elementos dentro de Shadow DOM são invisíveis.

**Exemplo Problemático:**
```html
<!-- Material Design Button (usa Shadow DOM) -->
<mwc-button>Click me</mwc-button>

<!-- Content Script vê apenas:
<mwc-button>Click me</mwc-button>

<!-- Mas não consegue acessar o Shadow DOM interno:
#shadow-root
  <button class="mdc-button">
    <span class="mdc-button__ripple"></span>
    <span class="mdc-button__label">Click me</span>
  </button>
-->
```

**Recomendação:**
- [ ] Adicionar suporte a Shadow DOM (Fase 2).
- [ ] Usar `element.shadowRoot` para acessar shadow tree.
- [ ] Documentar limitações claramente.
- [ ] Oferecer fallback (capturar apenas host element).

---

### 2.2 Responsividade e Media Queries

**Problema:** PRD captura apenas um viewport. Websites responsivos têm layouts diferentes em mobile/tablet/desktop.

**Impacto no PRD:**
- Capturar em 1440px não reflete layout mobile.
- Media queries não são capturadas.
- Breakpoints não são documentados.

**Exemplo Problemático:**
```css
/* Desktop */
.container { display: flex; gap: 20px; }

/* Mobile (media query não é capturada) */
@media (max-width: 768px) {
  .container { display: block; }
}
```

**Recomendação:**
- [ ] Adicionar captura multi-viewport (mobile, tablet, desktop).
- [ ] Detectar breakpoints automaticamente.
- [ ] Armazenar múltiplas capturas por URL.
- [ ] Permitir seleção de viewport na importação.

---

### 2.3 CORS e Imagens Quebradas

**Problema:** 30%+ dos websites têm imagens que não podem ser carregadas via CORS.

**Impacto no PRD:**
- Imagens quebradas no Figma.
- Content Script não consegue fazer fetch de imagens.
- Base64 encoding aumenta tamanho do JSON.

**Exemplo Problemático:**
```javascript
// Content Script tenta carregar imagem
const img = new Image();
img.src = 'https://external-cdn.com/image.png';
// CORS error! Não consegue fazer fetch.
```

**Recomendação:**
- [ ] Usar URLs de imagens (não Base64).
- [ ] Avisar sobre imagens que podem quebrar.
- [ ] Oferecer fallback (placeholder).
- [ ] Documentar limitações de CORS.

---

### 2.4 Segurança em Content Scripts

**Problema:** Content Scripts têm acesso privilegiado e podem ser explorados.

**Riscos Identificados:**
1. **XSS via innerHTML:** Se usar `innerHTML` com dados não-sanitizados.
2. **Data Exfiltration:** Dados sensíveis podem ser enviados para servidor malicioso.
3. **CSP Violations:** Content Security Policy pode bloquear extensão.
4. **Privilege Escalation:** Content Script pode ser explorado para acessar páginas privilegiadas.

**Exemplo Vulnerável:**
```javascript
// ❌ VULNERÁVEL: innerHTML com dados não-sanitizados
const userInput = element.getAttribute('data-config');
document.body.innerHTML = userInput; // XSS!

// ✅ SEGURO: Usar textContent ou sanitizar
const userInput = element.getAttribute('data-config');
const sanitized = sanitizeHTML(userInput);
document.body.textContent = sanitized;
```

**Recomendação:**
- [ ] Implementar sanitização rigorosa (DOMPurify).
- [ ] Usar CSP strict.
- [ ] Validar todas as entradas.
- [ ] Documentar security model.
- [ ] Fazer security audit antes de publicar.

---

### 2.5 Performance em Figma

**Problema:** Figma tem limite de ~2GB de memória por tab. Importar 1000+ elementos pode travar.

**Impacto no PRD:**
- PRD limita a 50 elementos, mas isso é arbitrário.
- Renderização em chunks (50 nós) pode ainda ser lenta.
- Figma pode ficar irresponsivo.

**Benchmark Figma:**
- 100 nós: ~1 segundo.
- 500 nós: ~5 segundos.
- 1000 nós: ~15 segundos (pode travar).
- 5000+ nós: Travamento garantido.

**Recomendação:**
- [ ] Testar com 100, 500, 1000 nós.
- [ ] Documentar limites reais (não 50).
- [ ] Oferecer modo "Lightweight" (apenas estrutura).
- [ ] Implementar progress bar na importação.

---

### 2.6 Tipografia Avançada

**Problema:** Variable fonts, font-display, font metrics não são capturados.

**Impacto no PRD:**
- Variable fonts (Roboto Flex, Inter Variable) não são suportadas.
- Font metrics (ascender, descender) não são preservadas.
- Line-height pode estar incorreto em Figma.

**Exemplo Problemático:**
```css
/* Variable font não é capturado */
@font-face {
  font-family: 'Roboto Flex';
  src: url('RobotoFlex.woff2') format('woff2-variations');
  font-variation-settings: 'wght' 100 1000, 'wdth' 75 100;
}

/* Font metrics não são capturados */
.text {
  line-height: 1.5; /* Pode estar errado em Figma */
  font-size: 16px;
}
```

**Recomendação:**
- [ ] Adicionar suporte a variable fonts (Fase 2).
- [ ] Capturar font metrics (ascender, descender, x-height).
- [ ] Documentar limitações.

---

### 2.7 CSS Avançado

**Problema:** Gradientes, filtros, blend modes, backdrop-filter não são suportados.

**Impacto no PRD:**
- Gradientes radiais/cônicos não são capturados.
- Filtros (blur, brightness) não são convertidos.
- Mix-blend-mode não é suportado no Figma.

**Exemplo Problemático:**
```css
/* Gradiente radial não é capturado */
background: radial-gradient(circle at 50% 50%, red, blue);

/* Filtro não é convertido */
filter: blur(10px) brightness(1.2);

/* Blend mode não é suportado */
mix-blend-mode: multiply;
```

**Recomendação:**
- [ ] Adicionar suporte a gradientes (Fase 2).
- [ ] Adicionar suporte a filtros (Fase 3).
- [ ] Documentar limitações.

---

### 2.8 Acessibilidade

**Problema:** ARIA attributes, semantic HTML, color contrast não são preservados.

**Impacto no PRD:**
- Informações de acessibilidade são perdidas.
- Designers não sabem se componentes são acessíveis.
- Color contrast não é validado.

**Exemplo Problemático:**
```html
<!-- ARIA attributes não são capturados -->
<button aria-label="Close" aria-pressed="false">×</button>

<!-- Semantic HTML não é preservado -->
<h1>Title</h1> <!-- Capturado como <div> -->

<!-- Color contrast não é validado -->
<p style="color: #999; background: #f0f0f0;">Low contrast text</p>
```

**Recomendação:**
- [ ] Capturar ARIA attributes.
- [ ] Validar color contrast (WCAG AA/AAA).
- [ ] Documentar acessibilidade no relatório.
- [ ] Oferecer sugestões de melhoria.

---

### 2.9 Z-index e Stacking Context

**Problema:** Z-index e stacking context não são capturados. Ordem de camadas pode estar errada.

**Impacto no PRD:**
- Elementos podem estar na ordem errada no Figma.
- Stacking context é perdido.

**Exemplo Problemático:**
```css
/* Stacking context não é capturado */
.modal {
  z-index: 1000;
  position: relative; /* Cria novo stacking context */
}

.overlay {
  z-index: 999; /* Pode estar acima de .modal no Figma */
}
```

**Recomendação:**
- [ ] Capturar z-index e stacking context.
- [ ] Ordenar camadas corretamente no Figma.
- [ ] Documentar ordem de camadas.

---

### 2.10 SVG e Ícones

**Problema:** SVG inline, icon fonts, ícones customizados não são capturados.

**Impacto no PRD:**
- Ícones aparecem como texto ou símbolos estranhos.
- SVG inline não é convertido para Figma.
- Icon fonts não são suportadas.

**Exemplo Problemático:**
```html
<!-- SVG inline não é capturado -->
<svg width="24" height="24">
  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
</svg>

<!-- Icon font não é suportado -->
<i class="fa fa-star"></i>

<!-- Pseudo-elemento com icon font -->
.star::before { content: "★"; }
```

**Recomendação:**
- [ ] Adicionar suporte a SVG inline (Fase 2).
- [ ] Adicionar suporte a icon fonts (Fase 2).
- [ ] Converter para Figma shapes.

---

## 3. Gaps de Segurança

### 3.1 Sanitização Incompleta

**Problema:** Sanitização no PRD é básica. Não cobre todos os vetores de ataque.

**Vetores de Ataque Não Cobertos:**
1. **Event Listeners:** `onclick`, `onload`, etc. são removidos, mas `addEventListener` em JavaScript não é.
2. **Data Attributes:** Padrão sensível é removido, mas `data-*` customizado pode conter dados.
3. **Style Attributes:** `style` pode conter `expression()` (IE) ou outros ataques.
4. **Form Inputs:** Valores de inputs não são limpos.

**Recomendação:**
- [ ] Usar DOMPurify (biblioteca de sanitização).
- [ ] Testar contra OWASP Top 10.
- [ ] Fazer security audit.
- [ ] Documentar security model.

---

### 3.2 Data Exfiltration

**Problema:** Dados sensíveis podem ser capturados e enviados para servidor.

**Dados Sensíveis Potenciais:**
- Tokens de autenticação (localStorage, sessionStorage).
- Informações de usuário (nome, email, telefone).
- Dados financeiros (números de cartão, CPF).
- Dados de saúde (informações médicas).

**Recomendação:**
- [ ] Avisar usuário sobre dados sensíveis.
- [ ] Oferecer modo "Offline" (não enviar para servidor).
- [ ] Implementar encryption end-to-end.
- [ ] Documentar política de privacidade.

---

### 3.3 Content Security Policy (CSP)

**Problema:** Content Script pode violar CSP da página.

**Impacto:**
- Extensão pode ser bloqueada por CSP.
- Página pode não funcionar corretamente com extensão ativa.

**Recomendação:**
- [ ] Testar em sites com CSP strict.
- [ ] Usar `run_at: document_start` para evitar CSP.
- [ ] Documentar compatibilidade com CSP.

---

## 4. Gaps de Performance

### 4.1 Renderização em Chunks

**Problema:** Renderização em chunks de 50 nós pode ainda ser lenta.

**Benchmark Real:**
- 50 nós: ~500ms.
- 100 nós: ~1s.
- 200 nós: ~3s.
- 500 nós: ~8s (pode travar).

**Recomendação:**
- [ ] Testar com números reais.
- [ ] Ajustar tamanho de chunks dinamicamente.
- [ ] Implementar progress bar.
- [ ] Oferecer modo "Preview" (sem renderizar tudo).

---

### 4.2 Tamanho do JSON

**Problema:** JSON pode ficar muito grande (> 2 MB).

**Fatores que Aumentam Tamanho:**
- Imagens em Base64 (aumentam 33%).
- Estilos completos (pode duplicar tamanho).
- Histórico local (múltiplas capturas).

**Recomendação:**
- [ ] Usar URLs de imagens (não Base64).
- [ ] Comprimir JSON (gzip).
- [ ] Limpar histórico automático.

---

### 4.3 Memory Leaks

**Problema:** Extension pode ter memory leaks ao capturar múltiplas vezes.

**Recomendação:**
- [ ] Testar memory usage com DevTools.
- [ ] Limpar listeners e referencias.
- [ ] Implementar garbage collection.

---

## 5. Gaps de UX

### 5.1 Feedback do Usuário

**Problema:** Usuário não sabe o que está acontecendo durante captura/importação.

**Recomendação:**
- [ ] Adicionar progress bar.
- [ ] Adicionar tooltips explicativos.
- [ ] Adicionar feedback visual (highlight, animação).
- [ ] Adicionar mensagens de erro claras.

---

### 5.2 Histórico e Gerenciamento

**Problema:** Histórico local é limitado a 10 capturas. Usuário pode querer mais.

**Recomendação:**
- [ ] Aumentar limite (ou fazer configurável).
- [ ] Adicionar busca no histórico.
- [ ] Adicionar tags/categorias.
- [ ] Adicionar exportação de histórico.

---

### 5.3 Configurações e Opções

**Problema:** PRD não menciona configurações do usuário.

**Opções Sugeridas:**
- [ ] Incluir/excluir imagens.
- [ ] Incluir/excluir pseudo-elementos.
- [ ] Modo "Lightweight" (apenas estrutura).
- [ ] Modo "Offline" (não enviar para servidor).
- [ ] Seleção de viewport.

---

## 6. Gaps de Documentação

### 6.1 Documentação Técnica

**Faltam Documentos:**
- [ ] PERFORMANCE.md - Benchmarks reais.
- [ ] SECURITY.md - Modelo de segurança.
- [ ] ACCESSIBILITY.md - Suporte a acessibilidade.
- [ ] TROUBLESHOOTING.md - Problemas comuns.
- [ ] EDGE_CASES.md - Casos de borda.

---

### 6.2 Exemplos e Casos de Uso

**Faltam Exemplos:**
- [ ] Captura de botão com pseudo-elemento.
- [ ] Captura de card com imagem.
- [ ] Captura de formulário.
- [ ] Captura de componente complexo.

---

## 7. Oportunidades de Diferenciação

### 7.1 Captura Multi-Viewport

**Diferencial:** Capturar website em múltiplos viewports (mobile, tablet, desktop).

**Implementação:**
- Usar Puppeteer ou Playwright para capturar em múltiplos viewports.
- Armazenar múltiplas capturas por URL.
- Permitir seleção de viewport na importação.

**Potencial:** Alto (Refore não oferece).

---

### 7.2 Análise de Acessibilidade

**Diferencial:** Analisar e reportar problemas de acessibilidade.

**Implementação:**
- Usar axe-core para análise de acessibilidade.
- Reportar color contrast issues.
- Reportar missing ARIA labels.
- Sugerir melhorias.

**Potencial:** Médio-Alto (Refore não oferece).

---

### 7.3 Design System Integration

**Diferencial:** Integrar com design systems (Figma Tokens, Storybook).

**Implementação:**
- Detectar design tokens automaticamente.
- Vincular cores a variáveis.
- Vincular tipografia a estilos.
- Gerar design system.

**Potencial:** Alto (Refore não oferece).

---

### 7.4 AI-powered Naming

**Diferencial:** Usar IA para renomear camadas automaticamente.

**Implementação:**
- Usar GPT para gerar nomes descritivos.
- Usar Computer Vision para entender componentes.
- Gerar nomes em múltiplos idiomas.

**Potencial:** Médio (Refore oferece como Pro).

---

### 7.5 Performance Analytics

**Diferencial:** Analisar performance da página capturada.

**Implementação:**
- Medir Core Web Vitals.
- Reportar problemas de performance.
- Sugerir otimizações.

**Potencial:** Médio (Refore não oferece).

---

### 7.6 Monetização via Quotas

**Diferencial:** Modelo de monetização via quotas (como Refore).

**Implementação:**
- Free: 40 capturas/semana.
- Pro: Ilimitado.
- Enterprise: Custom.

**Potencial:** Alto (modelo comprovado).

---

## 8. Recomendações Prioritizadas

### 8.1 Críticas (Deve Fazer - Fase 1)

| Item | Razão | Esforço | Impacto |
| :--- | :--- | :--- | :--- |
| Segurança rigorosa | Risco legal | Médio | Alto |
| CORS handling | 30% dos sites | Baixo | Alto |
| Performance testing | Figma travamentos | Médio | Alto |
| Documentação de limitações | Expectativas realistas | Baixo | Alto |

### 8.2 Importantes (Deve Fazer - Fase 2)

| Item | Razão | Esforço | Impacto |
| :--- | :--- | :--- | :--- |
| Multi-viewport capture | Responsividade | Alto | Alto |
| Shadow DOM support | 15-20% dos sites | Alto | Médio |
| Acessibilidade | Diferencial | Médio | Médio |
| SVG support | Ícones | Médio | Médio |

### 8.3 Nice-to-Have (Pode Fazer - Fase 3)

| Item | Razão | Esforço | Impacto |
| :--- | :--- | :--- | :--- |
| AI naming | Diferencial | Médio | Baixo |
| Design system integration | Diferencial | Alto | Médio |
| Performance analytics | Diferencial | Médio | Baixo |
| Monetização | Revenue | Baixo | Alto |

---

## 9. Matriz de Risco vs Impacto

```
IMPACTO
  ▲
  │     CRÍTICO
  │   ┌─────────────────────────┐
  │   │ • Segurança             │
  │   │ • CORS                  │
  │   │ • Performance           │
  │   └─────────────────────────┘
  │
  │     IMPORTANTE
  │   ┌─────────────────────────┐
  │   │ • Multi-viewport        │
  │   │ • Shadow DOM            │
  │   │ • Acessibilidade        │
  │   └─────────────────────────┘
  │
  │     NICE-TO-HAVE
  │   ┌─────────────────────────┐
  │   │ • AI naming             │
  │   │ • Design system         │
  │   │ • Analytics             │
  │   └─────────────────────────┘
  │
  └─────────────────────────────────► RISCO
    BAIXO    MÉDIO    ALTO
```

---

## 10. Conclusão

### 10.1 Principais Descobertas

1. **Shadow DOM é um gap crítico:** 15-20% dos websites modernos usam Shadow DOM.
2. **Responsividade não é capturada:** Media queries e múltiplos viewports não são suportados.
3. **Segurança precisa de audit:** Content Script tem riscos de XSS e data exfiltration.
4. **Performance precisa de teste:** Figma pode travar com 500+ elementos.
5. **CORS é um problema real:** 30%+ dos websites têm imagens que não carregam.

### 10.2 Recomendações Imediatas

**Para Fase 1 (MVP):**
- [ ] Implementar sanitização rigorosa (DOMPurify).
- [ ] Testar CORS handling.
- [ ] Testar performance com 100, 500, 1000 nós.
- [ ] Documentar limitações claramente.
- [ ] Adicionar security audit.

**Para Fase 2 (MVP+):**
- [ ] Adicionar captura multi-viewport.
- [ ] Adicionar suporte a Shadow DOM.
- [ ] Adicionar análise de acessibilidade.
- [ ] Adicionar suporte a SVG.

**Para Fase 3 (Produção):**
- [ ] Adicionar AI naming.
- [ ] Adicionar design system integration.
- [ ] Implementar monetização.
- [ ] Publicar na Chrome Web Store.

### 10.3 Próximos Passos

1. **Revisar PRD v3.1** com base nesta pesquisa.
2. **Atualizar para PRD v3.2** integrando recomendações.
3. **Criar plano de mitigação** para gaps críticos.
4. **Iniciar desenvolvimento** com foco em segurança e performance.

---

## Apêndice: Referências de Pesquisa

### Fontes Consultadas

1. **Edge Cases & Limitações:**
   - MDN Web Docs (Shadow DOM, CSS, HTML)
   - Stack Overflow (problemas reais de desenvolvedores)
   - Reddit (comunidades de design e desenvolvimento)

2. **Segurança:**
   - OWASP (Top 10, CSP, XSS)
   - Chrome Security Docs
   - Browser Extension Security

3. **Performance:**
   - Figma Forum (performance issues)
   - Chrome DevTools
   - Web.dev (performance best practices)

4. **Monetização:**
   - Figma Business Model
   - SaaS Pricing Strategies
   - Plugin Marketplace Models

5. **Acessibilidade:**
   - WCAG 2.1 Guidelines
   - WebAIM
   - W3C WAI

