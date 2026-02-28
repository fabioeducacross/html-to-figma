# 🔧 Troubleshooting — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026

---

## Problemas com a Extensão Chrome

### ❌ "A extensão não ativa o inspetor"

**Causas possíveis:**
1. A aba está em uma URL especial (`chrome://`, `chrome-extension://`, `about:`, `file://`).
2. A extensão não tem permissão para a aba atual.

**Solução:**
- Navegue para um website normal (http/https) e tente novamente.
- Recarregue a extensão em `chrome://extensions`.

---

### ❌ "JSON gerado acima do limite de 2 MB"

**Causa:** O componente selecionado tem muitos elementos ou estilos.

**Solução:**
- Selecione um sub-componente menor.
- Evite capturar a `<body>` ou `<main>` inteira.

---

### ❌ "Captura não aparece no histórico"

**Causa:** IndexedDB pode estar bloqueado ou limpo.

**Solução:**
- Verifique se o limite de 10 capturas foi atingido (as mais antigas são removidas automaticamente).
- Em `chrome://settings/siteData`, verifique se os dados da extensão foram limpos.

---

### ⚠️ "Aviso: Shadow DOM detectado"

**O que acontece:** O elemento usa Web Components e o conteúdo interno não foi capturado.

**Solução:**
- Capture os elementos internos individualmente usando DevTools para identificá-los.
- Aguarde suporte a Shadow DOM na Fase 2.

---

### ⚠️ "X imagem(ns) com possível problema de CORS"

**O que acontece:** Imagens cross-origin podem não carregar no Figma.

**Solução:**
1. Abra as imagens diretamente no browser e baixe manualmente.
2. Importe as imagens no Figma via `File → Place Image`.
3. Substitua os placeholders na importação.

---

## Problemas com o Plugin Figma

### ❌ "JSON inválido: não foi possível fazer o parse"

**Causa:** O texto colado não é um JSON válido ou está incompleto.

**Solução:**
- Use a extensão Chrome para gerar o JSON (não edite manualmente).
- Verifique se copiou o JSON completo (começa com `{` e termina com `}`).

---

### ❌ "Campo 'version' deve ser '1.0'"

**Causa:** O JSON foi gerado por uma versão incompatível da extensão.

**Solução:**
- Atualize a extensão Chrome para a versão mais recente.
- Regenere o JSON.

---

### ❌ "O componente contém X elementos, acima do limite de 100"

**Causa:** O componente capturado é muito grande para o Figma processar sem travar.

**Solução:**
- Ative o **Modo Lightweight** (checkbox na UI do plugin).
- Ou capture sub-componentes individualmente.

---

### ❌ "Fontes aparecem erradas no Figma"

**Causa:** A fonte do website não está disponível no Figma.

**Solução:**
1. Instale a fonte localmente (Google Fonts, Adobe Fonts).
2. O relatório de importação lista as fontes substituídas.
3. Substitua manualmente no Figma após importação.

**Veja:** `docs/FONT_FALLBACK_MAP.md` para a lista de mapeamentos.

---

### ❌ "Imagens aparecem quebradas no Figma"

**Causa:** CORS ou URL inacessível.

**Solução:**
- Baixe as imagens manualmente e importe via Figma.
- Verifique os avisos de CORS no relatório de importação.

---

## Problemas de Performance

### 🐌 "A importação está muito lenta"

**Diagnóstico:**
- 50 elementos: normal (~2s)
- 100 elementos: esperado (~5-10s)
- Mais de 100: bloqueado pelo limite

**Solução:**
- Ative o Modo Lightweight para componentes complexos.
- Capture componentes menores.

---

### 💀 "O Figma travou durante a importação"

**Causa:** JSON muito grande ou muitos nós.

**Solução:**
1. Feche e reabra o Figma.
2. Importe novamente com Modo Lightweight ativado.
3. Capture um componente menor.

---

## Suporte

- Abra uma issue em: `github.com/fabioeducacross/html-to-figma/issues`
- Inclua: versão da extensão, URL da página, mensagem de erro, e o JSON gerado (se disponível).
