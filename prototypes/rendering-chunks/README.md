# Prototype: rendering-chunks

**Status:** ✅ Implementado

## Objetivo

Validar que a estratégia de renderização em chunks de 50 nós mantém cada chunk abaixo de 500 ms e que o sistema de progresso funciona corretamente para 10, 50 e 100 elementos.

## Como Executar

```bash
node prototypes/rendering-chunks/simulate.js
```

Requer Node.js ≥ 18.

## Resultados

Os resultados de timing por chunk são exibidos no console.
