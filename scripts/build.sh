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
