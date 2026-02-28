#!/bin/bash

################################################################################
# HTML-to-Figma Refore Clone - Project Initialization Script
# 
# Este script automatiza a criação completa da estrutura do projeto,
# incluindo pastas, arquivos de configuração, documentação e Git setup.
#
# Uso: bash init-project.sh [project-name] [github-username]
# 
# Exemplo: bash init-project.sh html-to-figma-refore-clone seu-usuario
################################################################################

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variáveis
PROJECT_NAME="${1:-html-to-figma-refore-clone}"
GITHUB_USERNAME="${2:-seu-usuario}"
PROJECT_DIR="$HOME/projects/$PROJECT_NAME"
TIMESTAMP=$(date +%Y-%m-%d\ %H:%M:%S)

################################################################################
# Funções Auxiliares
################################################################################

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_step() {
    echo -e "\n${BLUE}→ $1${NC}"
}

################################################################################
# Validações Iniciais
################################################################################

validate_prerequisites() {
    print_header "Validando Pré-requisitos"
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        print_error "Git não está instalado"
        exit 1
    fi
    print_success "Git instalado"
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js não está instalado"
        exit 1
    fi
    print_success "Node.js instalado ($(node --version))"
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        print_error "npm não está instalado"
        exit 1
    fi
    print_success "npm instalado ($(npm --version))"
    
    # Verificar GitHub CLI (opcional)
    if ! command -v gh &> /dev/null; then
        print_info "GitHub CLI não está instalado (opcional)"
    else
        print_success "GitHub CLI instalado"
    fi
}

################################################################################
# Criar Estrutura de Pastas
################################################################################

create_directory_structure() {
    print_header "Criando Estrutura de Pastas"
    
    # Verificar se pasta já existe
    if [ -d "$PROJECT_DIR" ]; then
        print_error "Pasta $PROJECT_DIR já existe"
        read -p "Deseja continuar? (s/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Ss]$ ]]; then
            exit 1
        fi
    else
        mkdir -p "$PROJECT_DIR"
        print_success "Pasta criada: $PROJECT_DIR"
    fi
    
    cd "$PROJECT_DIR"
    
    # Criar estrutura de pastas
    print_step "Criando diretórios..."
    
    mkdir -p .github/workflows
    mkdir -p .github/ISSUE_TEMPLATE
    mkdir -p .vscode
    mkdir -p docs
    mkdir -p src/extension/src/utils
    mkdir -p src/extension/public/icons
    mkdir -p src/extension/public/styles
    mkdir -p src/plugin/src/parser
    mkdir -p src/plugin/src/utils
    mkdir -p tests/unit
    mkdir -p tests/integration
    mkdir -p tests/security
    mkdir -p prototypes/figma-api-performance
    mkdir -p prototypes/content-script-isolation
    mkdir -p prototypes/dompurify-integration
    mkdir -p prototypes/cors-testing
    mkdir -p prototypes/memory-profiling
    mkdir -p prototypes/rendering-chunks
    mkdir -p scripts
    
    print_success "Estrutura de pastas criada"
}

################################################################################
# Criar Arquivos de Configuração
################################################################################

create_config_files() {
    print_header "Criando Arquivos de Configuração"
    
    # .gitignore
    print_step "Criando .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build outputs
dist/
build/
*.tsbuildinfo
out/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# OS
Thumbs.db
.DS_Store

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Environment
.env
.env.local
.env.*.local

# Test coverage
coverage/
.nyc_output/

# Prototypes (resultados)
prototypes/*/results/
prototypes/*/*.json

# Temporary
tmp/
temp/
.cache/

# IDE specific
.vscode/settings.json
.vscode/extensions.json
EOF
    print_success ".gitignore criado"
    
    # .editorconfig
    print_step "Criando .editorconfig..."
    cat > .editorconfig << 'EOF'
# EditorConfig helps maintain consistent coding styles

root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true

[*.{js,jsx,ts,tsx}]
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false
indent_size = 2

[*.json]
indent_style = space
indent_size = 2

[*.yml,*.yaml]
indent_style = space
indent_size = 2
EOF
    print_success ".editorconfig criado"
    
    # .eslintrc.json
    print_step "Criando .eslintrc.json..."
    cat > .eslintrc.json << 'EOF'
{
  "env": {
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "no-debugger": "warn",
    "@typescript-eslint/explicit-function-return-types": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
EOF
    print_success ".eslintrc.json criado"
    
    # .prettierrc
    print_step "Criando .prettierrc..."
    cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
EOF
    print_success ".prettierrc criado"
    
    # .copilot-instructions
    print_step "Criando .copilot-instructions..."
    cat > .copilot-instructions << 'EOF'
# GitHub Copilot Instructions

## Projeto: HTML-to-Figma Converter (Refore Clone)

### Contexto
Este é um projeto de conversão de HTML para Figma com foco em segurança, performance e documentação.

### Stack Técnico
- **Frontend:** React + TypeScript + TailwindCSS
- **Extension:** Plasmo (Chrome Extension Framework)
- **Plugin:** Figma Plugin API
- **Segurança:** DOMPurify, CSP, Content Script Isolation
- **Testes:** Vitest, Testing Library

### Padrões de Código
1. **TypeScript Strict:** Sempre usar tipos explícitos
2. **Segurança:** Sanitizar entrada com DOMPurify
3. **Performance:** Usar chunks de 50 nós
4. **Testes:** Cobertura mínima 80%
5. **Documentação:** JSDoc para funções públicas

### Convenções de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Testes
- `refactor:` Refatoração
- `perf:` Performance
- `security:` Segurança

### Exemplo de Commit
```
feat(extension): add DOMPurify sanitization

- Implement DOMPurify for HTML sanitization
- Add tests for XSS payloads
- Update SECURITY.md with implementation details

Closes #123
```

### Instruções para Copilot
1. Sempre adicionar tipos TypeScript
2. Sempre adicionar comentários para lógica complexa
3. Sempre adicionar testes para novas funcionalidades
4. Sempre atualizar documentação
5. Sempre considerar segurança
6. Sempre considerar performance

### Estrutura de Pastas
- `/docs` - Documentação
- `/src/extension` - Chrome Extension
- `/src/plugin` - Figma Plugin
- `/tests` - Testes
- `/prototypes` - Prototipos de validação
- `/scripts` - Scripts de automação

### Próximas Prioridades
1. Validar Figma API performance (Fase 1)
2. Implementar DOMPurify (Fase 1)
3. Testar CORS (Fase 1)
4. Fazer security audit (Fase 1)
EOF
    print_success ".copilot-instructions criado"
    
    # .vscode/settings.json
    print_step "Criando .vscode/settings.json..."
    mkdir -p .vscode
    cat > .vscode/settings.json << 'EOF'
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.inlineSuggest.enabled": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "github.copilot.enable": {
    "*": true,
    "plaintext": false,
    "markdown": true
  },
  "github.copilot.chat.localeOverride": "pt-BR"
}
EOF
    print_success ".vscode/settings.json criado"
    
    # .vscode/extensions.json
    print_step "Criando .vscode/extensions.json..."
    cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "eamodio.gitlens",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next"
  ]
}
EOF
    print_success ".vscode/extensions.json criado"
}

################################################################################
# Criar Arquivos de Documentação
################################################################################

create_documentation() {
    print_header "Criando Arquivos de Documentação"
    
    # README.md
    print_step "Criando README.md..."
    cat > README.md << EOF
# HTML-to-Figma Converter (Refore Clone)

Conversão de componentes HTML para Figma com foco em segurança, performance e documentação.

## 📚 Documentação

Veja a documentação completa em \`/docs\`:

- **[PRD_v3.3.md](./docs/PRD_v3.3.md)** - Product Requirements Document
- **[VALIDATION_PLAN.md](./docs/VALIDATION_PLAN.md)** - Plano de validação
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Arquitetura técnica
- **[SECURITY_MODEL.md](./docs/SECURITY_MODEL.md)** - Modelo de segurança

## 🚀 Quick Start

\`\`\`bash
# Instalar dependências
npm install

# Rodar testes
npm test

# Build
npm run build
\`\`\`

## 📁 Estrutura do Projeto

\`\`\`
├── docs/              # Documentação
├── src/
│   ├── extension/     # Chrome Extension
│   └── plugin/        # Figma Plugin
├── tests/             # Testes
├── prototypes/        # Prototipos de validação
└── scripts/           # Scripts de automação
\`\`\`

## 📊 Status

- PRD: ✅ Completo (v3.3)
- Validação: ⏳ Planejado
- Desenvolvimento: 🔴 Não iniciado

## 📝 Licença

MIT

## 👤 Autor

Criado em $TIMESTAMP
EOF
    print_success "README.md criado"
    
    # CONTRIBUTING.md
    print_step "Criando CONTRIBUTING.md..."
    cat > CONTRIBUTING.md << 'EOF'
# Guia de Contribuição

## Workflow

1. Crie uma branch para sua feature: `git checkout -b feat/sua-feature`
2. Faça commit das mudanças: `git commit -m "feat: descrição"`
3. Faça push para a branch: `git push origin feat/sua-feature`
4. Abra um Pull Request

## Convenções de Commit

- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `test:` Testes
- `refactor:` Refatoração
- `perf:` Performance
- `security:` Segurança

## Padrões de Código

- TypeScript com tipos explícitos
- ESLint + Prettier
- Testes para novas funcionalidades
- JSDoc para funções públicas
- Considerar segurança sempre

## Testes

```bash
npm test
```

## Build

```bash
npm run build
```
EOF
    print_success "CONTRIBUTING.md criado"
    
    # LICENSE
    print_step "Criando LICENSE (MIT)..."
    cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
    print_success "LICENSE criado"
    
    # Criar arquivos vazios de documentação
    print_step "Criando arquivos de documentação..."
    touch docs/README.md
    touch docs/PRD_v3.3.md
    touch docs/VALIDATION_PLAN.md
    touch docs/VALIDATION_RESULTS.md
    touch docs/ARCHITECTURE.md
    touch docs/SECURITY_MODEL.md
    touch docs/PERFORMANCE_BENCHMARKS.md
    touch docs/LIMITATIONS.md
    touch docs/ROADMAP.md
    touch docs/GLOSSARY.md
    print_success "Arquivos de documentação criados"
}

################################################################################
# Criar Arquivos de Configuração do Projeto
################################################################################

create_project_config() {
    print_header "Criando Configurações do Projeto"
    
    # package.json
    print_step "Criando package.json..."
    cat > package.json << EOF
{
  "name": "$PROJECT_NAME",
  "version": "0.1.0",
  "description": "HTML-to-Figma Converter - Refore Clone",
  "private": true,
  "license": "MIT",
  "author": "Seu Nome",
  "scripts": {
    "setup": "npm install && npm run build",
    "dev": "npm run dev:extension & npm run dev:plugin",
    "dev:extension": "cd src/extension && npm run dev",
    "dev:plugin": "cd src/plugin && npm run dev",
    "build": "npm run build:extension && npm run build:plugin",
    "build:extension": "cd src/extension && npm run build",
    "build:plugin": "cd src/plugin && npm run build",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext .ts,.tsx",
    "format": "prettier --write .",
    "validate": "npm run lint && npm run test"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "dependencies": {
    "dompurify": "^3.0.0"
  }
}
EOF
    print_success "package.json criado"
    
    # tsconfig.json
    print_step "Criando tsconfig.json..."
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF
    print_success "tsconfig.json criado"
}

################################################################################
# Criar Scripts de Automação
################################################################################

create_scripts() {
    print_header "Criando Scripts de Automação"
    
    # setup.sh
    print_step "Criando scripts/setup.sh..."
    cat > scripts/setup.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 Configurando projeto..."

# Instalar dependências root
npm install

# Instalar dependências da extension
cd src/extension
npm install
cd ../..

# Instalar dependências do plugin
cd src/plugin
npm install
cd ../..

echo "✓ Projeto configurado com sucesso!"
echo ""
echo "Próximos passos:"
echo "  npm run dev       - Iniciar desenvolvimento"
echo "  npm run build     - Build production"
echo "  npm test          - Rodar testes"
EOF
    chmod +x scripts/setup.sh
    print_success "scripts/setup.sh criado"
    
    # validate.sh
    print_step "Criando scripts/validate.sh..."
    cat > scripts/validate.sh << 'EOF'
#!/bin/bash
set -e

echo "🔍 Validando projeto..."

echo "→ Linting..."
npm run lint

echo "→ Testes..."
npm run test

echo "✓ Validação concluída com sucesso!"
EOF
    chmod +x scripts/validate.sh
    print_success "scripts/validate.sh criado"
    
    # build.sh
    print_step "Criando scripts/build.sh..."
    cat > scripts/build.sh << 'EOF'
#!/bin/bash
set -e

echo "🔨 Building projeto..."

echo "→ Extension..."
cd src/extension
npm run build
cd ../..

echo "→ Plugin..."
cd src/plugin
npm run build
cd ../..

echo "✓ Build concluído com sucesso!"
EOF
    chmod +x scripts/build.sh
    print_success "scripts/build.sh criado"
    
    # test.sh
    print_step "Criando scripts/test.sh..."
    cat > scripts/test.sh << 'EOF'
#!/bin/bash
set -e

echo "🧪 Rodando testes..."

npm run test

echo "✓ Testes concluídos!"
EOF
    chmod +x scripts/test.sh
    print_success "scripts/test.sh criado"
}

################################################################################
# Inicializar Git
################################################################################

init_git() {
    print_header "Inicializando Git"
    
    # Verificar se já é um repositório
    if [ -d .git ]; then
        print_info "Repositório Git já existe"
    else
        print_step "Inicializando repositório..."
        git init
        print_success "Repositório Git inicializado"
    fi
    
    # Configurar Git (se não estiver configurado)
    if [ -z "$(git config --global user.name)" ]; then
        print_info "Configurando Git..."
        read -p "Nome de usuário Git: " git_name
        read -p "Email Git: " git_email
        git config --global user.name "$git_name"
        git config --global user.email "$git_email"
        print_success "Git configurado"
    fi
    
    # Primeiro commit
    print_step "Fazendo primeiro commit..."
    git add .
    git commit -m "Initial commit: Project structure and documentation" || print_info "Nada para commitar"
    print_success "Primeiro commit realizado"
}

################################################################################
# Criar Repositório no GitHub (Opcional)
################################################################################

create_github_repo() {
    print_header "Criando Repositório no GitHub (Opcional)"
    
    if ! command -v gh &> /dev/null; then
        print_info "GitHub CLI não está instalado. Pulando criação de repositório."
        print_info "Para criar manualmente, visite: https://github.com/new"
        return
    fi
    
    read -p "Deseja criar repositório no GitHub? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        print_info "Pulando criação de repositório no GitHub"
        return
    fi
    
    print_step "Criando repositório no GitHub..."
    
    # Verificar se já existe
    if gh repo view "$GITHUB_USERNAME/$PROJECT_NAME" 2>/dev/null; then
        print_info "Repositório já existe no GitHub"
    else
        gh repo create "$PROJECT_NAME" --private --source=. --remote=origin --push
        print_success "Repositório criado no GitHub"
    fi
    
    # Fazer push
    print_step "Fazendo push para GitHub..."
    git push -u origin main 2>/dev/null || git push -u origin master 2>/dev/null || print_info "Push já realizado"
    print_success "Push para GitHub realizado"
}

################################################################################
# Resumo Final
################################################################################

print_summary() {
    print_header "✓ Projeto Criado com Sucesso!"
    
    echo ""
    echo "📁 Localização: $PROJECT_DIR"
    echo ""
    echo "📊 Estrutura criada:"
    echo "  ✓ Pastas do projeto"
    echo "  ✓ Arquivos de configuração (.gitignore, .editorconfig, etc.)"
    echo "  ✓ Documentação inicial"
    echo "  ✓ Scripts de automação"
    echo "  ✓ Repositório Git"
    echo ""
    echo "🚀 Próximos passos:"
    echo ""
    echo "1. Entrar na pasta:"
    echo "   cd $PROJECT_DIR"
    echo ""
    echo "2. Instalar dependências:"
    echo "   npm install"
    echo ""
    echo "3. Abrir no VS Code:"
    echo "   code ."
    echo ""
    echo "4. Instalar extensões recomendadas:"
    echo "   - GitHub Copilot"
    echo "   - GitHub Copilot Chat"
    echo "   - GitLens"
    echo "   - Prettier"
    echo "   - ESLint"
    echo ""
    echo "5. Começar desenvolvimento:"
    echo "   npm run dev"
    echo ""
    echo "📚 Documentação:"
    echo "   - Leia: $PROJECT_DIR/README.md"
    echo "   - Leia: $PROJECT_DIR/docs/PRD_v3.3.md"
    echo "   - Leia: $PROJECT_DIR/docs/VALIDATION_PLAN.md"
    echo ""
}

################################################################################
# Main
################################################################################

main() {
    echo ""
    print_header "HTML-to-Figma Refore Clone - Project Initialization"
    echo ""
    print_info "Projeto: $PROJECT_NAME"
    print_info "Diretório: $PROJECT_DIR"
    echo ""
    
    validate_prerequisites
    create_directory_structure
    create_config_files
    create_documentation
    create_project_config
    create_scripts
    init_git
    create_github_repo
    print_summary
}

# Executar main
main
