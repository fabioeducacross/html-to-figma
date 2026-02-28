# Prototype: cors-testing

**Status:** ✅ Implementado

## Objetivo

Simular detecção de problemas de CORS em imagens cross-origin, validando que o `imageHandler.ts` classifica corretamente URLs same-origin, cross-origin e data URIs.

## Como Executar

```bash
node prototypes/cors-testing/simulate.js
```

Requer Node.js ≥ 18.

## Resultados

Os resultados por URL são exibidos no console com status CORS_ISSUE / OK / MISSING.
