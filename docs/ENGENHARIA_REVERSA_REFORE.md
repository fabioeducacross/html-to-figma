# 🔍 Engenharia Reversa: Refore HTML to Figma

**Data:** Fevereiro 2026  
**Objetivo:** Identificar arquitetura, tecnologias e fluxos do Refore para clonar funcionalidades

---

## 1. Metodologia de Engenharia Reversa

### 1.1 Técnicas Disponíveis

| Técnica | Descrição | Dificuldade | Legibilidade |
| :--- | :--- | :--- | :--- |
| **Análise de Requisições HTTP** | Interceptar requisições da extensão e plugin | Média | Alta |
| **Análise de Código Minificado** | Desminificar JavaScript da extensão | Alta | Baixa |
| **Análise de Estrutura JSON** | Examinar formato de dados trocados | Baixa | Alta |
| **Análise de Comportamento** | Testar funcionalidades e documentar | Baixa | Alta |
| **Análise de Manifests** | Examinar manifest.json da extensão | Baixa | Alta |
| **Análise de Storage** | Verificar IndexedDB, LocalStorage, etc. | Média | Alta |

### 1.2 Ferramentas Necessárias

```bash
# Análise de Rede
- Chrome DevTools (Network tab)
- Burp Suite Community (Proxy)
- Fiddler (Interceptor)

# Análise de Código
- Chrome DevTools (Sources tab)
- js-beautifier.org (Desminificar)
- Decompyle++ (Descompactar)

# Análise de Extensão
- Chrome Extensions folder (local files)
- crx4chrome.com (Download extensão como ZIP)
- unzip (Extrair arquivos)

# Análise de Dados
- JSON.parse() + console.log
- IndexedDB Inspector (Chrome DevTools)
- Local Storage Inspector (Chrome DevTools)
```

---

## 2. Arquitetura Inferida do Refore

### 2.1 Componentes Principais (Baseado em Documentação + Análise)

```
┌─────────────────────────────────────────────────────────────┐
│                  REFORE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  CHROME EXTENSION (Proprietary)                      │  │
│  │  ├── Popup UI (React)                               │  │
│  │  ├── Content Script (DOM Capture)                   │  │
│  │  ├── Background Service Worker                      │  │
│  │  └── Storage (IndexedDB + LocalStorage)             │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  BACKEND SERVER (refore.ai)                         │  │
│  │  ├── API Endpoint: /api/capture                     │  │
│  │  ├── API Endpoint: /api/import                      │  │
│  │  ├── Database (PostgreSQL?)                         │  │
│  │  └── File Storage (S3?)                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FIGMA PLUGIN (Proprietary)                         │  │
│  │  ├── UI (React)                                     │  │
│  │  ├── JSON Parser                                    │  │
│  │  ├── Style Mapper                                   │  │
│  │  ├── Node Creator                                   │  │
│  │  └── Figma API Integration                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FIGMA CANVAS (Editable Layers)                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Fluxo de Dados (Inferido)

```
1. CAPTURA (Extension)
   └─ Usuário clica no elemento
   └─ Content Script captura:
      ├─ HTML structure
      ├─ Computed styles
      ├─ Pseudo-elements
      ├─ Images (URLs ou Base64)
      └─ Bounding box
   └─ JSON é gerado
   └─ Enviado para servidor (ou armazenado localmente)

2. ARMAZENAMENTO (Backend)
   └─ Servidor recebe JSON
   └─ Valida e sanitiza
   └─ Armazena em banco de dados
   └─ Retorna ID de captura
   └─ Armazena em IndexedDB local (para offline)

3. IMPORTAÇÃO (Plugin)
   └─ Usuário abre plugin no Figma
   └─ Seleciona captura (ID ou histórico)
   └─ Plugin busca JSON (local ou servidor)
   └─ Valida JSON
   └─ Mapeia estilos CSS → Figma
   └─ Renderiza nós em chunks
   └─ Aplica Auto Layout (se possível)
   └─ Exibe resultado na canvas
```

---

## 3. Técnicas de Engenharia Reversa por Componente

### 3.1 Chrome Extension

#### **Passo 1: Baixar a Extensão**

```bash
# Opção 1: Via crx4chrome.com
# 1. Ir em https://crx4chrome.com/
# 2. Buscar "Refore HTML to Figma"
# 3. Copiar ID da extensão: amcccnldajjnngnaoinemnaloklogjak
# 4. Construir URL: https://crx4chrome.com/crx.php?id=amcccnldajjnngnaoinemnaloklogjak
# 5. Download automático

# Opção 2: Via Chrome Extensions folder
# 1. Abrir Chrome
# 2. Ir em chrome://extensions/
# 3. Ativar "Developer mode"
# 4. Copiar caminho da extensão
# 5. Navegar em: /Users/[user]/Library/Application Support/Google/Chrome/Default/Extensions/amcccnldajjnngnaoinemnaloklogjak/
```

#### **Passo 2: Extrair Arquivos**

```bash
unzip refore-extension.crx -d refore-extension/
cd refore-extension/
ls -la

# Estrutura esperada:
# ├── manifest.json
# ├── popup.html
# ├── popup.js (minificado)
# ├── content.js (minificado)
# ├── background.js (minificado)
# ├── styles.css
# └── assets/
```

#### **Passo 3: Analisar Manifest.json**

```json
{
  "manifest_version": 3,
  "name": "Refore HTML to Figma",
  "version": "X.X.X",
  "permissions": [
    "activeTab",
    "scripting",
    "storage",
    "webRequest"  // ← Intercepta requisições
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ],
  "action": {
    "default_popup": "popup.html"
  }
}
```

**Insights:**
- Usa Manifest v3 (moderno).
- Tem acesso a todas as URLs.
- Content Script injeta código em todas as páginas.
- Background Service Worker gerencia estado global.

#### **Passo 4: Desminificar JavaScript**

```bash
# Desminificar popup.js
npm install -g js-beautify
js-beautify popup.js > popup.beautified.js

# Analisar estrutura
grep -n "function\|class\|const.*=.*function" popup.beautified.js | head -50
```

**O que procurar:**
- `captureElement()` ou similar → Função de captura.
- `sendToServer()` ou `uploadCapture()` → Envio de dados.
- `localStorage.setItem()` ou `indexedDB` → Armazenamento local.
- `chrome.runtime.sendMessage()` → Comunicação com background.

#### **Passo 5: Analisar Content Script**

```javascript
// Procurar por:

// 1. Injeção de Overlay
document.addEventListener('mouseover', (e) => {
  // Destaca elemento
  e.target.style.outline = '2px solid blue';
});

// 2. Captura de Estilos
const styles = window.getComputedStyle(element);

// 3. Captura de Pseudo-elementos
const beforeStyles = window.getComputedStyle(element, '::before');

// 4. Geração de JSON
const json = {
  version: "1.0",
  element: { /* ... */ }
};

// 5. Envio para Background
chrome.runtime.sendMessage({ type: 'CAPTURE', data: json });
```

#### **Passo 6: Analisar Background Service Worker**

```javascript
// Procurar por:

// 1. Recebimento de mensagens
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CAPTURE') {
    // Validar JSON
    // Sanitizar dados
    // Enviar para servidor
    fetch('https://api.refore.ai/capture', {
      method: 'POST',
      body: JSON.stringify(request.data)
    });
  }
});

// 2. Armazenamento local
chrome.storage.local.set({ captures: [...] });

// 3. Autenticação
const token = localStorage.getItem('auth_token');
```

---

### 3.2 Figma Plugin

#### **Passo 1: Baixar o Plugin**

```bash
# Opção 1: Via Figma Community
# 1. Ir em https://www.figma.com/community/plugin/1385944139259302061/
# 2. Clicar em "Open in Figma"
# 3. Clicar em "Install"
# 4. Abrir Figma e ir em Plugins → Manage plugins
# 5. Clicar em "Edit" no plugin
# 6. Ir em "Development" → "View source code"

# Opção 2: Via Chrome DevTools
# 1. Abrir o plugin no Figma
# 2. Abrir Chrome DevTools (F12)
# 3. Ir em "Sources"
# 4. Procurar por "plugin.js" ou "code.js"
# 5. Copiar código minificado
```

#### **Passo 2: Desminificar Plugin Code**

```bash
# Copiar código minificado do DevTools
# Colar em js-beautifier.org
# Ou usar CLI:
js-beautify plugin.js > plugin.beautified.js
```

#### **Passo 3: Analisar Estrutura do Plugin**

```typescript
// Procurar por:

// 1. Recebimento de JSON
figma.ui.onmessage = (msg) => {
  if (msg.type === 'IMPORT') {
    const json = msg.data;
    // Validar JSON
    // Mapear estilos
    // Criar nós
  }
};

// 2. Criação de Nós
const frame = figma.createFrame();
frame.name = json.element.id;
frame.fills = [{ type: 'SOLID', color: { r, g, b } }];

// 3. Auto Layout
frame.layoutMode = 'HORIZONTAL'; // ou 'VERTICAL'
frame.itemSpacing = 10;

// 4. Renderização em Chunks
const CHUNK_SIZE = 50;
for (let i = 0; i < elements.length; i += CHUNK_SIZE) {
  const chunk = elements.slice(i, i + CHUNK_SIZE);
  // Renderizar chunk
  await new Promise(resolve => setTimeout(resolve, 100));
}
```

#### **Passo 4: Analisar UI do Plugin**

```typescript
// Procurar por:

// 1. Componentes React
function App() {
  const [json, setJson] = useState('');
  const [status, setStatus] = useState('idle');
  
  const handleImport = () => {
    // Validar JSON
    // Enviar para code.ts
    parent.postMessage({ type: 'IMPORT', data: json }, '*');
  };
}

// 2. Drag-and-drop
document.addEventListener('drop', (e) => {
  const file = e.dataTransfer.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    const json = JSON.parse(event.target.result);
    // Processar JSON
  };
});

// 3. Histórico
const captures = JSON.parse(localStorage.getItem('captures') || '[]');
```

---

### 3.3 Formato de JSON (Inferido)

#### **Passo 1: Analisar Estrutura**

```json
{
  "version": "1.0",
  "timestamp": "2026-02-28T10:30:00Z",
  "url": "https://example.com",
  "viewport": {
    "width": 1440,
    "height": 900
  },
  "element": {
    "id": "element-id",
    "tagName": "button",
    "className": "btn btn-primary",
    "text": "Click me",
    "styles": {
      "display": "flex",
      "padding": "12px 24px",
      "backgroundColor": "#007bff",
      "color": "#ffffff",
      "fontFamily": "Inter, sans-serif",
      "fontSize": "16px"
    },
    "pseudo": {
      "before": {
        "content": "→",
        "marginRight": "8px"
      }
    },
    "children": [
      {
        "tagName": "span",
        "text": "Icon",
        "styles": { /* ... */ }
      }
    ],
    "boundingBox": {
      "x": 100,
      "y": 200,
      "width": 120,
      "height": 40
    }
  }
}
```

#### **Passo 2: Interceptar Requisições**

```bash
# Usar Burp Suite ou Chrome DevTools

# 1. Abrir Chrome DevTools (F12)
# 2. Ir em "Network"
# 3. Capturar a extensão
# 4. Procurar por requisições POST para:
#    - https://api.refore.ai/capture
#    - https://api.refore.ai/import
#    - https://api.refore.ai/fonts

# 5. Analisar payload (JSON enviado)
# 6. Analisar response (resultado retornado)
```

#### **Passo 3: Analisar Endpoints da API**

```
POST /api/capture
├── Request:
│   ├── Authorization: Bearer {token}
│   ├── Content-Type: application/json
│   └── Body: { version, element, viewport, ... }
├── Response:
│   ├── captureId: "abc123"
│   ├── status: "success"
│   └── message: "Capture saved"

POST /api/import
├── Request:
│   ├── Authorization: Bearer {token}
│   ├── Content-Type: application/json
│   └── Body: { captureId }
├── Response:
│   ├── figmaJson: { /* Figma-compatible JSON */ }
│   ├── fonts: [ /* Lista de fontes */ ]
│   └── warnings: [ /* Avisos */ ]

GET /api/captures
├── Request:
│   ├── Authorization: Bearer {token}
├── Response:
│   └── captures: [ /* Lista de capturas */ ]
```

---

## 4. Técnicas de Análise de Comportamento

### 4.1 Testar e Documentar Funcionalidades

```bash
# 1. Capturar um elemento simples (botão)
# Documentar:
# - Tempo de captura
# - Tamanho do JSON
# - Campos incluídos
# - Campos excluídos

# 2. Capturar um elemento com pseudo-elemento
# Documentar:
# - Como pseudo-elemento é representado
# - Se content é capturado
# - Se estilos são capturados

# 3. Capturar um elemento com imagem
# Documentar:
# - Se imagem é Base64 ou URL
# - Tamanho da imagem
# - Como é representada no JSON

# 4. Capturar um elemento com Flexbox
# Documentar:
# - Como display: flex é representado
# - Como gap é representado
# - Como flex-direction é representado

# 5. Importar no Figma
# Documentar:
# - Tempo de renderização
# - Fidelidade visual
# - Erros ou avisos
```

### 4.2 Usar Chrome DevTools para Análise

```javascript
// Abrir Console (F12 → Console)

// 1. Inspecionar IndexedDB
// Ir em Application → IndexedDB → refore-extension
// Procurar por:
// - captures (histórico local)
// - settings (configurações)
// - cache (cache de dados)

// 2. Inspecionar LocalStorage
// Ir em Application → Local Storage → https://refore.ai
// Procurar por:
// - auth_token
// - user_id
// - preferences

// 3. Inspecionar Network
// Ir em Network
// Capturar requisições POST
// Analisar headers e payload

// 4. Executar código no Console
const captures = await indexedDB.databases();
console.log(captures);

// 5. Monitorar mensagens entre scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message:', request);
  console.log('Sender:', sender);
});
```

---

## 5. Mapeamento de Funcionalidades Refore → Nossa Solução

### 5.1 Funcionalidades Identificadas

| Funcionalidade | Refore | Nossa Solução | Dificuldade |
| :--- | :--- | :--- | :--- |
| **Element Picker** | ✅ Overlay com highlight | ✅ Implementar | Baixa |
| **Captura de Estilos** | ✅ getComputedStyle | ✅ Implementar | Baixa |
| **Pseudo-elementos** | ✅ ::before, ::after | ✅ Implementar | Média |
| **Histórico Local** | ✅ IndexedDB | ✅ Implementar | Média |
| **Sanitização** | ✅ Remove scripts | ✅ Implementar | Média |
| **Validação JSON** | ✅ Schema validation | ✅ Implementar | Baixa |
| **Auto Layout** | ✅ Flexbox → Auto Layout | ✅ Implementar | Alta |
| **Font Fallback** | ✅ Mapeamento de fontes | ✅ Implementar | Média |
| **Relatórios** | ❌ Não oferece | ✅ Implementar | Média |
| **Product Tour** | ✅ Múltiplas páginas | ⏳ Fase 2 | Alta |
| **AI Features** | ✅ Auto-rename | ⏳ Fase 3 | Alta |

### 5.2 Priorização de Implementação

```
Fase 1 (MVP - 28-41h):
├── Element Picker (Baixa dificuldade)
├── Captura de Estilos (Baixa dificuldade)
├── Pseudo-elementos (Média dificuldade)
├── Histórico Local (Média dificuldade)
├── Sanitização (Média dificuldade)
├── Validação JSON (Baixa dificuldade)
├── Auto Layout (Alta dificuldade)
├── Font Fallback (Média dificuldade)
└── Relatórios (Média dificuldade)

Fase 2 (MVP+ - 20-30h):
├── Product Tour (Alta dificuldade)
├── Captura de Interações (Alta dificuldade)
└── Múltiplas Seleções (Média dificuldade)

Fase 3 (Produção - 30-40h):
├── AI Auto-rename (Alta dificuldade)
├── AI Intelligent Search (Alta dificuldade)
└── Integração com Design Tokens (Alta dificuldade)
```

---

## 6. Checklist de Engenharia Reversa

### 6.1 Chrome Extension

- [ ] Baixar extensão via crx4chrome.com
- [ ] Extrair arquivos (unzip)
- [ ] Analisar manifest.json
- [ ] Desminificar popup.js
- [ ] Desminificar content.js
- [ ] Desminificar background.js
- [ ] Identificar função de captura
- [ ] Identificar função de envio de dados
- [ ] Identificar armazenamento local
- [ ] Documentar estrutura do JSON
- [ ] Testar funcionalidades

### 6.2 Figma Plugin

- [ ] Abrir plugin no Figma
- [ ] Acessar source code via DevTools
- [ ] Desminificar código
- [ ] Identificar função de importação
- [ ] Identificar função de renderização
- [ ] Identificar mapeamento de estilos
- [ ] Identificar Auto Layout logic
- [ ] Testar funcionalidades
- [ ] Documentar estrutura

### 6.3 Backend API

- [ ] Interceptar requisições com Burp Suite
- [ ] Documentar endpoints
- [ ] Documentar payloads
- [ ] Documentar responses
- [ ] Testar autenticação
- [ ] Testar validação

### 6.4 Documentação

- [ ] Criar diagrama de arquitetura
- [ ] Documentar fluxo de dados
- [ ] Documentar formato de JSON
- [ ] Documentar endpoints da API
- [ ] Documentar limitações
- [ ] Criar guia de implementação

---

## 7. Riscos Legais e Éticos

### 7.1 Considerações Legais

⚠️ **Engenharia Reversa é Legal, MAS:**

1. **Não copie código:** Análise é legal, copiar código é não.
2. **Não viole ToS:** Refore proíbe engenharia reversa em seus ToS.
3. **Não distribua:** Não distribua código copiado de Refore.
4. **Crie algo novo:** Use insights para criar solução diferente.

### 7.2 Recomendações

- ✅ Analisar funcionalidades e fluxos.
- ✅ Documentar aprendizados.
- ✅ Implementar de forma independente.
- ✅ Criar diferenciais (relatórios, segurança, transparência).
- ❌ Não copiar código.
- ❌ Não violar ToS.
- ❌ Não distribuir código copiado.

---

## 8. Conclusão

A engenharia reversa do Refore é **viável e legal** se feita corretamente:

1. **Análise de Funcionalidades:** Identificar o que Refore faz.
2. **Análise de Arquitetura:** Entender como Refore implementa.
3. **Implementação Independente:** Criar nossa própria solução.
4. **Diferenciais:** Adicionar features que Refore não tem.

**Próximo passo:** Executar este plano de engenharia reversa e documentar descobertas.

