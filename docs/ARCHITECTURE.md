# 🏗️ Arquitetura — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026

---

## 1. Visão Geral

O projeto é composto por dois artefatos independentes que se comunicam via JSON:

```
[ Website ]
     │  usuário clica num elemento
     ▼
[ Chrome Extension ]   ─── JSON ───▶   [ Figma Plugin ]
  content.ts                            code.ts / ui.html
  popup.tsx                             jsonParser.ts
  domPurify.ts                          styleMapper.ts
  storage.ts (IndexedDB)                rendering.ts
  exportJson.ts                         fontFallback.ts
```

---

## 2. Chrome Extension

### 2.1 Fluxo de dados

```
popup.tsx  ─TOGGLE_PICKER→  content.ts
                │
                ▼
        sanitizeElement()        ← domPurify.ts
                │
                ▼
        scanImages()             ← imageHandler.ts (CORS check)
                │
                ▼
        generateCaptureJSON()    ← exportJson.ts
                │
          exportAsJSON()         ← verifica limite 2 MB
                │
                ▼
        saveCapture()            ← storage.ts (IndexedDB)
                │
     ─CAPTURE_COMPLETE→  popup.tsx
```

### 2.2 Componentes

| Arquivo | Responsabilidade |
|---|---|
| `popup.tsx` | UI: ativar inspetor, offline mode, histórico, progress bar |
| `content.ts` | Injeção na página, overlay de hover, captura ao clicar |
| `background.ts` | Service worker — bridge entre popup e content script |
| `utils/domPurify.ts` | Sanitização via DOMPurify, remoção de attrs sensíveis |
| `utils/imageHandler.ts` | Detecção de CORS em imagens, fallback |
| `utils/exportJson.ts` | Geração do JSON tipado, limite de 2 MB |
| `utils/storage.ts` | Persistência IndexedDB, LRU de 10 capturas |

### 2.3 Manifest (MV3)

- `world: ISOLATED` — Content Script roda em Isolated World (isolado do JS da página)
- CSP strict: `script-src 'self'; object-src 'none'; base-uri 'none'`
- Permissions mínimas: `activeTab`, `storage`, `scripting`
- Sem `host_permissions` — a extensão não acessa servidores externos

---

## 3. Figma Plugin

### 3.1 Fluxo de dados

```
ui.html/ui.ts  ─IMPORT_JSON→  code.ts
                                │
                           parseJSON()           ← jsonParser.ts
                                │
                        validateImportData()      ← validation.ts
                                │
                        assertNodeLimit()         ← rendering.ts (max 100)
                                │
                       resolveFontName()          ← fontFallback.ts
                                │
                       mapLayoutMode()            ← styleMapper.ts
                       parseColor()
                                │
                      renderInChunks()            ← rendering.ts (50/chunk)
                                │
               ─IMPORT_SUCCESS (report)→  ui.html
```

### 3.2 Componentes

| Arquivo | Responsabilidade |
|---|---|
| `ui.html` + `ui.ts` | Interface: textarea, drag-and-drop, progress, relatório |
| `parser/jsonParser.ts` | Parse + validação de schema do CaptureData |
| `parser/styleMapper.ts` | CSS → Figma: cores, radius, layout, opacidade |
| `utils/fontFallback.ts` | Mapa web fonts → fontes disponíveis no Figma |
| `utils/rendering.ts` | Renderização em chunks de 50, limite de 100 nós |
| `utils/validation.ts` | Validação rigorosa de campos obrigatórios |

---

## 4. Formato do JSON de Captura

Veja `docs/JSON_SCHEMA.md` para o schema completo.

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
    "styles": { "background-color": "rgb(255,255,255)", "display": "flex" },
    "pseudo": { "before": {}, "after": {} },
    "children": [],
    "boundingBox": { "x": 0, "y": 0, "width": 1440, "height": 600 }
  }
}
```

---

## 5. Decisões de Design

| Decisão | Motivo |
|---|---|
| JSON como protocolo de comunicação | Independente de plataforma, versionável, auditável |
| DOMPurify para sanitização | Biblioteca madura e auditada; mais segura que regex manual |
| IndexedDB para histórico | Funciona offline; sem servidor; privacidade garantida |
| Isolated World para content script | Isolado do JS malicioso da página host |
| Chunks de 50 nós no plugin | Previne travamento do Figma (limite ~2 GB de memória) |
| Limite de 100 elementos | Balanceia fidelidade vs. performance do Figma |
| Limite de 2 MB por JSON | Previne estouro de memória no content script |
| Offline Mode | Nenhum dado sai do dispositivo do usuário |

---

## 6. Segurança

Veja `docs/SECURITY_MODEL.md` para detalhes completos.

**Resumo:**
- Dados nunca saem do dispositivo (sem servidor)
- Content script em Isolated World
- DOMPurify + remoção de `data-token`, `data-key`, `data-password`, etc.
- CSP strict no manifest
- Sem `eval`, sem inline scripts

---

## 7. Performance

Veja `docs/PERFORMANCE_BENCHMARKS.md` para benchmarks reais.

**Resumo:**
- Captura de 100 elementos: < 5s
- Renderização de 100 elementos no Figma: < 10s
- Chunks de 50 nós com pause entre eles
- Limite rígido de 100 elementos e 2 MB de JSON
