# BeLiabe - Proposta Estratégica Digital

Site institucional da BeLiabe com proposta de soluções digitais estratégicas para instituições de futebol.

## 🚀 Deploy Automático com GitHub Pages

Este projeto está configurado para deploy automático no GitHub Pages usando GitHub Actions.

### 📦 Como Funciona

1. **Push Automático**: Sempre que você fizer push para a branch `main`, o site é automaticamente deployado
2. **Validação**: O workflow verifica a integridade do HTML e recursos
3. **Deploy**: Se tudo estiver correto, o site é publicado no GitHub Pages

### 🛠️ Como Fazer Deploy

#### Método 1: Script Automático (Recomendado)
```bash
# Deploy com mensagem automática
./deploy.sh

# Deploy com mensagem personalizada
./deploy.sh "Adicionar efeitos parallax"
```

#### Método 2: Manual
```bash
# Adicionar arquivos
git add .

# Fazer commit
git commit -m "Sua mensagem de commit"

# Fazer push (isso triggera o deploy automático)
git push origin main
```

### 🔗 URLs do Site

- **Produção**: `https://patrikrufino.github.io/Orc_IFB/`
- **Repositório**: `https://github.com/patrikrufino/Orc_IFB`
- **Actions**: `https://github.com/patrikrufino/Orc_IFB/actions`

### 📋 Status do Deploy

Você pode acompanhar o status do deploy na aba **Actions** do GitHub. O processo geralmente leva 2-5 minutos.

## 🎨 Características do Site

- ✨ Efeitos parallax sutis e responsivos
- 📱 Design responsivo (mobile-first)
- 🌐 Suporte multilíngue (PT/EN)
- ⚡ Performance otimizada
- ♿ Acessível (respeita `prefers-reduced-motion`)

## 🏗️ Estrutura do Projeto

```
/
├── index.html              # Página principal
├── README.md              # Documentação
├── deploy.sh              # Script de deploy
├── .github/
│   └── workflows/
│       ├── deploy-github-pages.yml    # Workflow simples
│       └── advanced-deploy.yml        # Workflow com validações
└── .deployignore          # Arquivos ignorados no deploy
```

## 🔧 Configuração do GitHub Pages

Para ativar o GitHub Pages com GitHub Actions:

1. Vá para **Settings** > **Pages** no seu repositório
2. Em **Source**, selecione **GitHub Actions**
3. O workflow será executado automaticamente no próximo push

## 📞 Suporte

Para dúvidas sobre o projeto ou deploy, entre em contato através do WhatsApp configurado no site.

---

**Desenvolvido com ❤️ para instituições de futebol que fazem a diferença na comunidade**