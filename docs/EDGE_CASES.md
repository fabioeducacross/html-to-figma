# 🧩 Edge Cases — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026

Lista de casos de borda identificados durante desenvolvimento e pesquisa.

---

## 1. Elementos DOM

### 1.1 Elemento raiz `<body>`

**Comportamento:** Capturável, mas geralmente gera JSON > 2 MB.  
**Resultado:** Erro de tamanho. Capturar sub-seções menores.

### 1.2 Elemento com `display: none`

**Comportamento:** Capturado com dimensões 0x0 e estilos não computados.  
**Resultado:** Frame vazio no Figma.  
**Workaround:** Tornar visível antes de capturar.

### 1.3 Elemento fora do viewport (scroll)

**Comportamento:** `getBoundingClientRect()` retorna coordenadas negativas.  
**Resultado:** Posição no Figma pode estar fora do frame principal.  
**Workaround:** Fazer scroll até o elemento antes de capturar.

### 1.4 Elemento com `position: fixed`

**Comportamento:** Capturado na posição fixa atual.  
**Resultado:** No Figma, aparece na posição do viewport, não do documento.

### 1.5 Elemento dentro de `<iframe>`

**Comportamento:** Content Script não tem acesso a iframes cross-origin.  
**Resultado:** Elemento host `<iframe>` é capturado sem conteúdo interno.

### 1.6 Shadow DOM (Web Components)

**Comportamento:** Aviso é exibido. Apenas o host element é capturado.  
**Resultado:** Elemento vazio no Figma.  
**Exemplo:** `<mwc-button>`, `<sl-button>`, `<ion-button>`.

### 1.7 Elemento com `visibility: hidden` mas `display: block`

**Comportamento:** Capturado com dimensões corretas mas `opacity: 0`.  
**Resultado:** Frame invisível no Figma.

---

## 2. Estilos CSS

### 2.1 Herança de Estilos

**Comportamento:** `getComputedStyle()` já resolve herança — o JSON contém valores finais.  
**Resultado:** Estilos corretos sem precisar rastrear herança.

### 2.2 CSS Custom Properties (Variáveis)

**Comportamento:** `getComputedStyle()` resolve variáveis para seus valores finais.  
**Resultado:** `color: var(--primary)` aparece como `rgb(0, 117, 202)` no JSON. ✅

### 2.3 Shorthand vs. Longhand

**Comportamento:** `getComputedStyle()` retorna longhand (ex: `border-top-width` em vez de `border`).  
**Resultado:** JSON mais verboso mas correto.

### 2.4 Gradiente em `background-image`

**Comportamento:** Capturado como string CSS, não convertido para Figma.  
**Resultado:** Background não renderizado no Figma. Ver `LIMITATIONS.md §5`.

### 2.5 `transform: translate()` ou `rotate()`

**Comportamento:** Não mapeado para propriedades de transformação do Figma.  
**Resultado:** Posição pode estar incorreta.

### 2.6 `clip-path` e `mask`

**Comportamento:** Capturados como strings CSS mas não convertidos.  
**Resultado:** Elemento aparece sem recorte/máscara no Figma.

### 2.7 Pseudo-elementos `::before`/`::after` com `content: "text"`

**Comportamento:** Capturados mas renderizados apenas se o plugin implementar suporte explícito.  
**Status atual:** Dados presentes no JSON; renderização pendente.

---

## 3. Imagens

### 3.1 `srcset` / `<picture>`

**Comportamento:** `currentSrc` é usado (a imagem que o browser escolheu para o viewport atual).  
**Resultado:** Imagem correta para o viewport capturado. ✅

### 3.2 `loading="lazy"` (imagem não carregada)

**Comportamento:** Imagem pode ter `naturalWidth = 0` se ainda não foi carregada.  
**Resultado:** `ImageData.width = 0`. Aviso CORS pode ser impreciso.  
**Workaround:** Fazer scroll até as imagens antes de capturar.

### 3.3 Data URIs (`data:image/...`)

**Comportamento:** Detectados como `status: OK` (não são CORS issues).  
**Resultado:** URL preservada. ✅ (pode ser grande; contribui para o limite de 2 MB)

### 3.4 SVG inline (`<img src="data:image/svg+xml,..."`)

**Comportamento:** Tratado como imagem normal com URL.  
**Resultado:** Imagem SVG preservada.

---

## 4. Fontes

### 4.1 Fonte não disponível no Figma

**Comportamento:** `resolveFontName()` retorna `Inter` como fallback.  
**Resultado:** Texto em Inter; usuário vê aviso no relatório.

### 4.2 Múltiplas fontes em `font-family`

**Comportamento:** Primeira fonte disponível no `FONT_FALLBACK_MAP` é usada.  
**Resultado:** `"Helvetica Neue, Arial, sans-serif"` → `Helvetica Neue`. ✅

### 4.3 Fonte com espaços em aspas (`"Open Sans"`)

**Comportamento:** Parser remove aspas antes de buscar no mapa.  
**Resultado:** `"Open Sans"` → `Open Sans`. ✅

---

## 5. Textos Especiais

### 5.1 Emojis

**Comportamento:** Capturados como caracteres Unicode no JSON.  
**Resultado:** Aparecem no Figma se a fonte suportar. ✅ (Inter suporta emojis básicos)

### 5.2 RTL (Árabe, Hebraico)

**Comportamento:** `direction: rtl` é capturado nos estilos.  
**Resultado:** Figma suporta RTL mas pode precisar de ajuste manual.

### 5.3 Texto muito longo (> 1000 caracteres em um nó)

**Comportamento:** Capturado integralmente.  
**Resultado:** Pode causar lentidão no Figma para texto muito longo.

---

## 6. URLs e Links

### 6.1 URL relativa no `href`

**Comportamento:** Capturada como string relativa.  
**Resultado:** Preservada no JSON; não afeta renderização.

### 6.2 `javascript:` em qualquer atributo

**Comportamento:** Removido por DOMPurify + post-processing.  
**Resultado:** Atributo strip. ✅ Seguro.

### 6.3 URL com caracteres especiais

**Comportamento:** URL preservada como string sem encoding adicional.  
**Resultado:** Funciona para URLs válidas.

---

## 7. JSON e Importação no Plugin

### 7.1 JSON com campos extras (forward compatibility)

**Comportamento:** Campos não reconhecidos são ignorados na validação.  
**Resultado:** Compatível com versões futuras. ✅

### 7.2 JSON truncado

**Comportamento:** `JSON.parse()` falha; erro descritivo exibido.  
**Resultado:** Usuário é informado para regenerar.

### 7.3 Encoding não-UTF-8

**Comportamento:** `TextEncoder` assume UTF-8; caracteres não-ASCII podem ser maiores que 1 byte.  
**Resultado:** Contagem de bytes correta para o limite de 2 MB. ✅
