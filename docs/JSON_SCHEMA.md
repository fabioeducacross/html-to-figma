# 📋 JSON Schema — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026

O JSON gerado pela extensão Chrome segue o schema `CaptureData` versão `1.0`.

---

## Schema Completo (TypeScript)

```typescript
interface CaptureData {
  id: string;          // "capture_1709130000000_abc1234"
  version: '1.0';      // sempre "1.0"
  timestamp: string;   // ISO 8601 — "2026-02-28T12:00:00.000Z"
  url: string;         // URL da página capturada
  viewport: {
    width: number;     // largura do viewport em px
    height: number;    // altura do viewport em px
  };
  element: CaptureElement;
}

interface CaptureElement {
  id: string;                            // valor do atributo id (ou "")
  tagName: string;                       // tag em minúsculas — "div", "button", "svg"
  styles: Record<string, string>;        // estilos computados (todos os props CSS)
  pseudo: {
    before: Record<string, string>;      // getComputedStyle(el, '::before')
    after: Record<string, string>;       // getComputedStyle(el, '::after')
  };
  children: CaptureElement[];            // filhos diretos, recursivo (vazio para SVG)
  boundingBox: {
    x: number;         // getBoundingClientRect().x
    y: number;         // getBoundingClientRect().y
    width: number;     // getBoundingClientRect().width
    height: number;    // getBoundingClientRect().height
  };
  /** Inline SVG markup — presente apenas quando tagName === 'svg' (Fase 2). */
  svgContent?: string;
  /** Atributos ARIA/acessibilidade — presente quando ao menos um atributo existe (Fase 2). */
  accessibility?: {
    role?: string;         // aria-role
    label?: string;        // aria-label | aria-labelledby
    description?: string;  // aria-describedby
    hidden?: boolean;      // aria-hidden === 'true'
  };
}
```

---

## Exemplo Mínimo Válido

```json
{
  "id": "capture_1709130000000_abc1234",
  "version": "1.0",
  "timestamp": "2026-02-28T12:00:00.000Z",
  "url": "https://example.com/",
  "viewport": { "width": 1440, "height": 900 },
  "element": {
    "id": "hero",
    "tagName": "section",
    "styles": {
      "background-color": "rgb(255, 255, 255)",
      "display": "flex",
      "flex-direction": "column",
      "padding": "48px"
    },
    "pseudo": { "before": {}, "after": {} },
    "children": [
      {
        "id": "hero-title",
        "tagName": "h1",
        "styles": {
          "font-family": "Roboto, sans-serif",
          "font-size": "48px",
          "color": "rgb(30, 30, 30)"
        },
        "pseudo": { "before": {}, "after": {} },
        "children": [],
        "boundingBox": { "x": 96, "y": 148, "width": 600, "height": 60 }
      }
    ],
    "boundingBox": { "x": 0, "y": 100, "width": 1440, "height": 600 }
  }
}
```

---

## Campos Obrigatórios

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | `string` | Identificador único gerado automaticamente |
| `version` | `"1.0"` | Versão do schema; deve ser exatamente `"1.0"` |
| `timestamp` | `string` | Data/hora ISO 8601 da captura |
| `url` | `string` | URL completa da página |
| `viewport.width` | `number` | Largura do viewport em pixels |
| `viewport.height` | `number` | Altura do viewport em pixels |
| `element` | `CaptureElement` | Elemento raiz capturado |
| `element.id` | `string` | Atributo `id` (pode ser vazio `""`) |
| `element.tagName` | `string` | Nome da tag em minúsculas |
| `element.styles` | `Record<string,string>` | Estilos computados |
| `element.pseudo` | `object` | Estilos de `::before` e `::after` |
| `element.children` | `CaptureElement[]` | Filhos recursivos (pode ser `[]`) |
| `element.boundingBox` | `object` | Bounding box do `getBoundingClientRect()` |

---

## Campos `styles` Mais Relevantes para o Plugin

| Propriedade CSS | Uso no Plugin |
|---|---|
| `background-color` | Cor de preenchimento do frame |
| `color` | Cor do texto |
| `font-family` | Fonte (resolvida via `FONT_FALLBACK_MAP`) |
| `font-size` | Tamanho do texto em px |
| `font-weight` | Peso da fonte |
| `line-height` | Altura da linha do texto |
| `display` | Detecta flex para Auto Layout |
| `flex-direction` | Direção do Auto Layout |
| `gap` | Espaçamento do Auto Layout |
| `border-radius` | Raio de borda do frame |
| `opacity` | Opacidade do nó |
| `width`, `height` | Dimensões (validadas com `boundingBox`) |

---

## Limites

| Limite | Valor |
|---|---|
| Tamanho máximo do JSON | 2 MB (bytes UTF-8) |
| Profundidade máxima de `children` | Sem limite explícito (limitado pelo max 100 elementos) |
| Número máximo de `children` total (recursivo) | 100 |

---

## Versioning

Versões futuras do schema incrementarão o campo `version`:
- `"1.0"` — Fase 1 MVP (atual)
- `"2.0"` — Fase 2 (planejado): adiciona `shadowTree`, `mediaQueries`, `accessibilityTree`
