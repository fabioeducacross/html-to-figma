# Prototype: dompurify-integration

**Status:** ✅ Implementado

## Objetivo

Validar que a integração DOMPurify + remoção de atributos sensíveis bloqueia 20+ payloads XSS e data-exfiltration, complementando os testes unitários com saída de relatório detalhada.

## Como Executar

```bash
node prototypes/dompurify-integration/validate.js
```

Requer Node.js ≥ 18 e `npm install` na raiz do projeto (usa `dompurify` + `jsdom`).

## Resultados

Os resultados com cada payload e status BLOCKED/PASSED são exibidos no console.
