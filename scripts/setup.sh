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
