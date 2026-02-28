#!/bin/bash
set -e

echo "🔍 Validando projeto..."

echo "→ Linting..."
npm run lint

echo "→ Testes..."
npm run test

echo "✓ Validação concluída com sucesso!"
