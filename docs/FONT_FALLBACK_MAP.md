# 🔤 Font Fallback Map — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026

Quando uma fonte do website não está disponível no Figma, o plugin usa este mapa para encontrar a melhor alternativa disponível.

---

## Como funciona

1. O CSS `font-family` é capturado como lista: `"Helvetica Neue, Arial, sans-serif"`.
2. O plugin itera pela lista e usa o primeiro nome presente no `FONT_FALLBACK_MAP`.
3. Se nenhuma fonte for encontrada, usa **`Inter`** como fallback universal.
4. O relatório de importação lista todas as substituições realizadas.

---

## Mapa de Fontes

### Fontes do Sistema

| Font-family CSS | Figma Font | Substituição? |
|---|---|---|
| `system-ui` | `Inter` | ✅ Sim |
| `-apple-system` | `Inter` | ✅ Sim |
| `BlinkMacSystemFont` | `Inter` | ✅ Sim |
| `Segoe UI` | `Segoe UI` | ✅ Direto |
| `Helvetica Neue` | `Helvetica Neue` | ✅ Direto |
| `Arial` | `Arial` | ✅ Direto |
| `Helvetica` | `Helvetica` | ✅ Direto |
| `sans-serif` | `Inter` | ✅ Sim |
| `serif` | `Georgia` | ✅ Sim |
| `monospace` | `Roboto Mono` | ✅ Sim |

### Google Fonts (pré-instaladas no Figma)

| Font-family CSS | Figma Font | Substituição? |
|---|---|---|
| `Roboto` | `Roboto` | ❌ Não (igual) |
| `Open Sans` | `Open Sans` | ❌ Não (igual) |
| `Lato` | `Lato` | ❌ Não (igual) |
| `Montserrat` | `Montserrat` | ❌ Não (igual) |
| `Oswald` | `Oswald` | ❌ Não (igual) |
| `Source Sans Pro` | `Source Sans Pro` | ❌ Não (igual) |
| `Raleway` | `Raleway` | ❌ Não (igual) |
| `PT Sans` | `PT Sans` | ❌ Não (igual) |
| `Nunito` | `Nunito` | ❌ Não (igual) |
| `Poppins` | `Poppins` | ❌ Não (igual) |

### Fontes Serif

| Font-family CSS | Figma Font | Substituição? |
|---|---|---|
| `Georgia` | `Georgia` | ❌ Não (igual) |
| `Times New Roman` | `Times New Roman` | ❌ Não (igual) |
| `Merriweather` | `Merriweather` | ❌ Não (igual) |

### Fontes Monospace

| Font-family CSS | Figma Font | Substituição? |
|---|---|---|
| `Courier New` | `Courier New` | ❌ Não (igual) |
| `Roboto Mono` | `Roboto Mono` | ❌ Não (igual) |
| `Source Code Pro` | `Source Code Pro` | ❌ Não (igual) |
| `Fira Code` | `Fira Code` | ❌ Não (igual) |

---

## Fallback Universal

Se nenhuma fonte da lista for encontrada no mapa:
- **Figma Font:** `Inter`
- **Substituição:** Sempre (qualquer fonte desconhecida)
- **Relatório:** O usuário é avisado sobre quais fontes foram substituídas

---

## Fontes Não Suportadas

As seguintes fontes **não estão no mapa** e serão substituídas por `Inter`:

- Variable fonts (`Inter Variable`, `Roboto Flex`, etc.)
- Fontes proprietárias de empresas (SF Pro, Circular, etc.)
- Icon fonts (Font Awesome, Material Icons, etc.)
- Fontes com nomes com espaço não cadastradas

---

## Como Adicionar uma Fonte ao Mapa

Edite `src/plugin/src/utils/fontFallback.ts`:

```typescript
export const FONT_FALLBACK_MAP: Record<string, string> = {
  // ...
  'Minha Fonte': 'Figma Equivalente',  // adicione aqui
};
```

Abra um PR com o mapeamento e justificativa.

---

## Verificar se uma Fonte Está no Figma

1. Abra o Figma Desktop
2. Crie um text node
3. No painel direito, clique no nome da fonte
4. Pesquise o nome da fonte
5. Se aparecer na lista, adicione ao mapa com o nome exato

> ⚠️ O nome no Figma deve ser exatamente igual ao retornado pela API (case-sensitive).
