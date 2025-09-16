#!/bin/bash

# Script para configurar e deployar o projeto no GitHub Pages
# Uso: ./deploy.sh [commit_message]

set -e

echo "🚀 GitHub Pages Deploy Script"
echo "=============================="

# Verificar se estamos em um repositório Git
if [ ! -d ".git" ]; then
    echo "❌ Este não é um repositório Git!"
    exit 1
fi

# Verificar se há mudanças para commit
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Não há mudanças para commit"
else
    echo "📝 Adicionando arquivos modificados..."
    git add .
    
    # Usar mensagem personalizada ou padrão
    COMMIT_MSG="${1:-"Update site content $(date +'%Y-%m-%d %H:%M')"}"
    
    echo "💾 Fazendo commit: $COMMIT_MSG"
    git commit -m "$COMMIT_MSG"
fi

# Verificar a branch atual
CURRENT_BRANCH=$(git branch --show-current)
echo "🌿 Branch atual: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Você não está na branch main. O deploy automático só funciona na branch main."
    echo "   Deseja continuar mesmo assim? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "❌ Deploy cancelado"
        exit 1
    fi
fi

# Fazer push para o GitHub
echo "⬆️  Fazendo push para o GitHub..."
git push origin "$CURRENT_BRANCH"

echo ""
echo "✅ Push realizado com sucesso!"
echo ""
echo "🔄 O GitHub Actions irá processar o deploy automaticamente."
echo "   Você pode acompanhar o progresso em:"
echo "   https://github.com/$(git remote get-url origin | sed 's/.*github.com[\/:]//; s/.git$//')/actions"
echo ""
echo "📍 Após o deploy, seu site estará disponível em:"
echo "   https://$(git remote get-url origin | sed 's/.*github.com[\/:]//; s/.git$//' | sed 's/\//.github.io\//')/"
echo ""
echo "⏰ O deploy geralmente leva 2-5 minutos para ser concluído."