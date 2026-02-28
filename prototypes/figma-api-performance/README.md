# Prototype: figma-api-performance

**Status:** ✅ Implementado

## Objetivo

Medir o tempo de criação de nós em diferentes cargas (10, 50, 100 elementos) simulando a API do Figma com objetos simples, validando que o limite de 100 elementos e a estratégia de chunks de 50 são adequados para performance aceitável.

## Como Executar

```bash
node prototypes/figma-api-performance/benchmark.js
```

Requer Node.js ≥ 18.

## Resultados

Os resultados são exibidos no console ao executar o script.
