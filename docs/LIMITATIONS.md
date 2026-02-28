# ⚠️ Limitações — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026

Esta documentação lista o que **NÃO funciona** e por quê.  
Para casos de uso suportados, consulte o `README.md`.

---

## 1. Shadow DOM / Web Components 🔴

**O que acontece:** Componentes que usam Shadow DOM (Material Design, Shoelace, etc.) são capturados apenas como elemento host. O conteúdo interno da shadow tree não é acessível.

**Por quê:** O Content Script roda em Isolated World e não tem acesso ao `shadowRoot` por padrão.

**Workaround:** Inspecione o shadow tree manualmente no DevTools e capture os elementos internos individualmente.

**Planejado para:** Fase 2.

---

## 2. Media Queries / Responsividade 🔴

**O que acontece:** Apenas o viewport atual é capturado. Se você captura em 1440px, a versão mobile não é incluída.

**Por quê:** O Content Script captura `getComputedStyle()` no momento da captura. Media queries já foram resolvidas pelo browser.

**Workaround:** Redimensione a janela do browser para o viewport desejado antes de capturar.

**Planejado para:** Fase 2 (Multi-Viewport Capture).

---

## 3. Imagens Cross-Origin (CORS) 🟡

**O que acontece:** Imagens de domínios diferentes podem não carregar no Figma. A URL é preservada, mas o Figma pode não conseguir baixá-la.

**Por quê:** Servidores de imagens de terceiros frequentemente bloqueiam requisições sem as credenciais corretas (CORS headers).

**Workaround:** Faça o download manual da imagem e importe-a diretamente no Figma.

**Indicação:** A extensão avisa quando detecta imagens cross-origin.

---

## 4. Variable Fonts 🟡

**O que acontece:** Variações de eixo de variable fonts (`font-variation-settings`) não são capturadas. Apenas `font-weight`, `font-style` e `font-size` são preservados.

**Por quê:** Figma não suporta variable font axes via API atualmente.

**Workaround:** Ajuste o peso da fonte manualmente no Figma após a importação.

---

## 5. Gradientes e Backgrounds Complexos 🟡

**O que acontece:** `background-image: linear-gradient(...)`, `radial-gradient()`, `conic-gradient()` não são convertidos. O fundo aparece como `transparent` ou sólido.

**Por quê:** A API do Figma tem um modelo diferente para gradientes. A conversão requer parsing e mapeamento não trivial.

**Workaround:** Recrie gradientes manualmente no Figma.

**Planejado para:** Fase 2.

---

## 6. CSS Filters e Blend Modes 🟡

**O que acontece:** `filter: blur()`, `backdrop-filter`, `mix-blend-mode` não são convertidos.

**Por quê:** Parcialmente suportados na API do Figma; requer mapeamento específico.

**Planejado para:** Fase 2.

---

## 7. SVG Inline 🟡

**O que acontece:** SVG inline (`<svg>` no DOM) é tratado como um elemento genérico. Os paths não são convertidos para Figma shapes.

**Por quê:** Requer parser SVG completo e mapeamento para Figma vector nodes.

**Workaround:** Exporte o SVG como arquivo e importe diretamente no Figma.

**Planejado para:** Fase 2.

---

## 8. Icon Fonts (Font Awesome, Material Icons) 🟡

**O que acontece:** Ícones de font aparecem como texto com caracteres Unicode incomuns.

**Por quê:** O Figma não tem as icon fonts instaladas por padrão; são substituídas pelo fallback.

**Workaround:** Substitua por componentes de ícone SVG no Figma.

---

## 9. Pseudo-Elementos com Imagens 🟠

**O que acontece:** `::before` e `::after` com `background-image` ou `content: url()` não são renderizados como imagens.

**Por quê:** Pseudo-elementos com recursos externos têm as mesmas limitações CORS que imagens normais.

---

## 10. Stacking Context / Z-index 🟠

**O que acontece:** Camadas são ordenadas pela ordem no DOM, não pelo z-index. Elementos com `position: fixed` ou `z-index` alto podem aparecer em ordem errada.

**Workaround:** Reordene as camadas manualmente no Figma.

---

## 11. Animações CSS 🔴

**O que acontece:** `@keyframes`, `transition`, `animation` não são capturados. Apenas o estado estático no momento da captura é preservado.

**Por quê:** Figma não tem conceito de animações CSS (apenas Prototype flows).

---

## 12. Elementos Fora da Viewport 🟠

**O que acontece:** Elementos com `display: none` ou `visibility: hidden` não são capturados com estilos computados úteis.

**Workaround:** Torne o elemento visível antes de capturar.

---

## 13. Limite de 100 Elementos por Captura ⚡

**O que acontece:** Se o componente selecionado tiver mais de 100 elementos filhos, a importação é bloqueada.

**Por quê:** Previne travamento do Figma (limite de memória ~2 GB por tab).

**Workaround:** Use o **Modo Lightweight** (apenas estrutura sem estilos detalhados) para componentes grandes, ou capture sub-componentes individualmente.

---

## 14. Limite de 2 MB por JSON 📦

**O que acontece:** A exportação falha se o JSON gerado ultrapassar 2 MB.

**Por quê:** Componentes muito grandes com muitos estilos computados geram JSONs enormes que causam lentidão.

**Workaround:** Capture um sub-componente menor.

---

## Resumo Visual

| Limitação | Severidade | Planejado |
|---|---|---|
| Shadow DOM | 🔴 Alto | Fase 2 |
| Media Queries | 🔴 Alto | Fase 2 |
| Animações CSS | 🔴 Alto | Não planejado |
| CORS / Imagens | 🟡 Médio | Fase 1 (aviso) |
| Gradientes | 🟡 Médio | Fase 2 |
| SVG Inline | 🟡 Médio | Fase 2 |
| Variable Fonts | 🟡 Médio | Fase 2 |
| CSS Filters | 🟡 Médio | Fase 2 |
| Icon Fonts | 🟡 Médio | Não planejado |
| Z-index | 🟠 Baixo | Fase 1 (parcial) |
| Pseudo + Imagens | 🟠 Baixo | Fase 2 |
| Limite 100 elems | ⚡ Performance | Permanente |
| Limite 2 MB | ⚡ Performance | Permanente |
