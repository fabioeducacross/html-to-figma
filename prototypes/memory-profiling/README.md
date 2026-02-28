# Prototype: memory-profiling

**Status:** ✅ Implementado

## Objetivo

Estimar o uso de memória ao processar CaptureData de diferentes tamanhos, validando que ficamos dentro do limite de 100 MB para evitar travar o Figma.

## Como Executar

```bash
node prototypes/memory-profiling/profile.js
```

Requer Node.js ≥ 18.

## Resultados

Os resultados de uso de memória por cenário são exibidos no console.
