# 🔐 Modelo de Segurança — HTML-to-Figma Converter

**Versão:** 1.0  
**Data:** Fevereiro 2026

---

## 1. Princípios de Segurança

1. **Local-First:** Nenhum dado sai do dispositivo do usuário sem consentimento explícito.
2. **Least Privilege:** A extensão solicita apenas as permissões estritamente necessárias.
3. **Defense in Depth:** Múltiplas camadas de sanitização e validação.
4. **Transparency:** Código open source; auditável por qualquer pessoa.

---

## 2. Superfície de Ataque

```
[ Website (não confiável) ]
        │
        ▼ DOM + Computed Styles
[ Content Script (Isolated World) ]
        │
        ▼ Sanitized HTML + JSON
[ Background Service Worker ]
        │
        ▼ Validated JSON
[ IndexedDB (Local) ]
        │
        ▼ JSON string
[ Figma Plugin Sandbox ]
```

---

## 3. Ameaças e Mitigações

### 3.1 Cross-Site Scripting (XSS)

**Ameaça:** Um website malicioso pode injetar código JavaScript em atributos HTML (ex: `onclick="maliciousCode()"`, `<img onerror="...">`).

**Mitigação:**
- **DOMPurify** (`domPurify.ts`) sanitiza todo o HTML antes de processar.
- `FORBID_TAGS: ['script', 'iframe', 'object', 'embed']`
- `FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover']`
- Post-processamento adicional remove `javascript:` URLs que possam sobreviver em atributos `style`.
- Content Script roda em **Isolated World** — o JS da página não tem acesso ao escopo da extensão.

**Teste:** `tests/security/xss.test.ts` — 17 payloads XSS validados.

---

### 3.2 Data Exfiltration

**Ameaça:** Dados sensíveis presentes em atributos HTML (tokens de autenticação, senhas, CPF, números de cartão) podem ser capturados acidentalmente.

**Mitigação:**
- **Remoção de data attributes sensíveis** antes da sanitização:
  - `data-token`, `data-key`, `data-secret`, `data-password`, `data-auth`
  - `data-cpf`, `data-card`
- **Offline Mode:** Toggle que garante que nenhuma requisição externa seja feita durante a captura.
- Dados são armazenados apenas no **IndexedDB local** — nunca em servidor.

**Teste:** `tests/security/dataExfiltration.test.ts` — 9 cenários validados.

---

### 3.3 Privilege Escalation via Content Script

**Ameaça:** Um website poderia tentar usar mensagens (`postMessage` ou `chrome.runtime.sendMessage`) para influenciar o comportamento do Content Script.

**Mitigação:**
- Content Script usa `chrome.runtime.onMessage` que só aceita mensagens do popup/background (mesma extensão).
- `world: "ISOLATED"` no `manifest.json` garante isolamento do JS da página.
- Content Script não expõe APIs ao contexto da página.

---

### 3.4 Injection via JSON no Plugin

**Ameaça:** Um JSON malicioso pode tentar executar código no contexto do Figma Plugin.

**Mitigação:**
- **Validação de schema** (`jsonParser.ts`) — rejeita JSONs com campos inválidos.
- **Sanitização de URLs** (`validation.ts`) — strip de `javascript:` e `data:` em campos de URL.
- Figma Plugin roda em **sandbox isolado** — não tem acesso ao DOM do Figma.
- Tratamento de erros robusto — nunca usa `eval()` ou `Function()`.

**Teste:** `tests/unit/jsonParser.test.ts`, `tests/security/xss.test.ts`.

---

## 4. Content Security Policy (CSP)

```json
"content_security_policy": {
  "extension_pages": "script-src 'self'; object-src 'none'; base-uri 'none';"
}
```

- `script-src 'self'` — apenas scripts empacotados pela extensão
- `object-src 'none'` — nenhum plugin Flash/Java
- `base-uri 'none'` — previne ataques de base tag injection

---

## 5. Permissões do Manifest

| Permissão | Motivo | Alternativa removida |
|---|---|---|
| `activeTab` | Injetar content script na tab ativa | `tabs` (muito ampla) |
| `storage` | Offline Mode toggle | — |
| `scripting` | Injetar content script programaticamente | `content_scripts` estático |

**Removido:** `host_permissions` — nenhum acesso a URLs específicas necessário.

---

## 6. Checklist de Segurança (Antes de Publicar)

- [x] DOMPurify implementado e testado (17 payloads XSS).
- [x] Data exfiltration prevention testado (9 cenários).
- [x] CSP strict no `manifest.json`.
- [x] `world: "ISOLATED"` no content script.
- [x] Sem `eval()`, `Function()`, `innerHTML` sem sanitização.
- [x] Validação rigorosa de JSON no plugin.
- [x] Permissões mínimas no manifest.
- [ ] Security audit externo (OWASP Top 10) — pendente antes de publicação.
- [ ] Publicação com Chrome Web Store security review.

---

## 7. Reporte de Vulnerabilidades

Para reportar vulnerabilidades de segurança, abra uma issue com a label `security` ou envie e-mail para o maintainer. **Não divulgue vulnerabilidades publicamente** antes de um fix estar disponível.
