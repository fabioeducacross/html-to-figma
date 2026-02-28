# Prototype: content-script-isolation

**Status:** ✅ Implementado

## Objetivo

Documentar e verificar programaticamente que o Content Script roda em Isolated World, separado do JavaScript da página host. O teste valida a configuração do `manifest.json` e gera um relatório de conformidade.

## Como Executar

```bash
node prototypes/content-script-isolation/verify.js
```

Requer Node.js ≥ 18.

## Resultados

Os resultados da verificação são exibidos no console.
