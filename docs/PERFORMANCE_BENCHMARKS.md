# ⚡ Performance Benchmarks — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026  
**Status:** Benchmarks de referência (baseados em estimativas + testes unitários; testes em hardware real pendentes)

---

## 1. Limites Estabelecidos

| Limite | Valor | Motivo |
|---|---|---|
| Elementos por captura | **100** | Previne travamento do Figma |
| Tamanho máximo de JSON | **2 MB** | Previne estouro de memória no content script |
| Histórico local | **10 capturas** | Evita crescimento ilimitado do IndexedDB |
| Chunk de renderização | **50 nós** | Mantém Figma responsivo entre batches |
| Pausa entre chunks | **0ms (setTimeout 0)** | Libera event loop sem delay perceptível |

---

## 2. Benchmarks Estimados (Fase 1)

Baseados na documentação da API do Figma e na análise do código:

| Cenário | Elementos | Tempo Estimado | Status |
|---|---|---|---|
| Componente pequeno | 10 | < 0,5s | ✅ Permitido |
| Componente médio | 50 | < 2s | ✅ Permitido |
| Componente grande | 100 | < 5s (captura) + < 10s (render) | ✅ Limite máximo |
| Componente muito grande | 200 | > 10s / possível lentidão | ❌ Bloqueado |
| Componente gigante | 500+ | Travamento provável | ❌ Bloqueado |

---

## 3. Breakdown por Operação

### 3.1 Chrome Extension — Captura

| Operação | Tempo Estimado |
|---|---|
| `getComputedStyle()` por elemento | ~1-2ms |
| `getBoundingClientRect()` por elemento | ~0,5ms |
| `DOMPurify.sanitize()` | ~2-5ms (HTML completo) |
| `JSON.stringify()` de 100 elementos | ~10-50ms |
| `TextEncoder` (verificação 2 MB) | ~1ms |
| `IndexedDB.put()` | ~5-20ms |
| **Total para 100 elementos** | **~200-500ms** |

### 3.2 Figma Plugin — Importação

| Operação | Tempo Estimado |
|---|---|
| `JSON.parse()` de 1 MB | ~50ms |
| Validação de schema | ~5ms |
| `resolveFontName()` por elemento | ~0,1ms |
| Criação de nó Figma por elemento | ~10-50ms |
| 50 nós (1 chunk) | ~500ms-2,5s |
| 100 nós (2 chunks) | ~1-5s |
| **Total para 100 elementos** | **~2-10s** |

---

## 4. Testes de Performance Pendentes

Os seguintes testes precisam ser executados em hardware real:

- [ ] Captura de 100 elementos em Chrome (Macbook M1, Windows Intel)
- [ ] Renderização de 100 elementos no Figma Desktop
- [ ] Renderização de 50 elementos no Figma Web
- [ ] Medição de memory usage com Chrome DevTools Memory tab
- [ ] Teste de 500 elementos com Modo Lightweight
- [ ] Benchmark de `DOMPurify.sanitize()` em páginas com 10MB+ de HTML

**Como executar:**
```bash
# Abrir Chrome com DevTools
# Ativar "Performance" tab
# Acionar captura e gravar
# Analisar flame chart
```

---

## 5. Modo Lightweight

O **Modo Lightweight** (checkbox na UI do plugin) importa apenas a estrutura do componente:
- ✅ Hierarquia de elementos preservada
- ✅ Dimensões e posições preservadas
- ❌ Cores e estilos não aplicados
- ❌ Tipografia não aplicada

**Uso:** Para componentes com mais de 50 elementos onde a performance é crítica.

---

## 6. Memory Usage

| Cenário | Uso de Memória Estimado |
|---|---|
| Extension com 10 capturas no IndexedDB | ~5-20 MB |
| Plugin processando JSON de 1 MB | ~5-15 MB |
| Plugin criando 100 nós Figma | ~10-30 MB |

**Limite Figma:** ~2 GB por aba (limite do browser). Mantemos uso < 100 MB.

---

## 7. Otimizações Implementadas

1. **Renderização em chunks de 50:** Evita bloquear o event loop do Figma.
2. **Limite de 100 elementos:** Garantia de performance previsível.
3. **Limite de 2 MB:** Evita serialização/desserialização de JSONs enormes.
4. **LRU de 10 capturas:** IndexedDB não cresce indefinidamente.
5. **`setTimeout(0)` entre chunks:** Libera o event loop para resposta da UI.
