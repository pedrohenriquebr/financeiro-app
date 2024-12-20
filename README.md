# FinanceiroApp
[![CI/CD Pipeline](https://github.com/pedrohenriquebr/financeiro-app/actions/workflows/ci.yml/badge.svg)](https://github.com/pedrohenriquebr/financeiro-app/actions/workflows/ci.yml)
![Angular](https://img.shields.io/badge/Angular-17.0.0-red)
![.NET](https://img.shields.io/badge/.NET-8.0-purple)
![Tauri](https://img.shields.io/badge/Tauri-1.6.3-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

Uma aplicação desktop moderna para controle financeiro pessoal, construída com Tauri, .NET e Angular. Focada em privacidade, permite gerenciar suas finanças offline com a opção de backup seguro no Google Drive.

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#%EF%B8%8F-tecnologias">Tecnologias</a> •
  <a href="#-requisitos-do-sistema">Requisitos</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-desenvolvimento">Desenvolvimento</a> •
  <a href="#-contribuindo">Contribuindo</a>
</p>

## ✨ Funcionalidades

### Financeiro
- 💰 Gerenciamento de contas bancárias
  - Cadastro de múltiplas contas
  - Controle de saldo
  - Histórico de transações
- 📊 Controle de receitas e despesas
  - Registro de transações
  - Categorização automática
  - Filtros avançados
- 📈 Relatórios e gráficos
  - Análise de gastos
  - Projeções financeiras
  - Exportação para Excel

### Técnicas
- 🔒 Modo offline com SQLite local
- 💾 Backup automático no Google Drive
- 🎨 Interface moderna e responsiva
- 🌙 Tema claro/escuro
- 🔔 System Tray com controles rápidos
- 📊 Gráficos interativos
- 🔄 Sincronização automática

## 🛠️ Tecnologias

### Frontend
- [Angular](https://angular.io/) (v17.0.0)
  - [Angular Material](https://material.angular.io/) (v17.0.0)
  - [Chart.js](https://www.chartjs.org/) (v4.4.1)
  - [D3.js](https://d3js.org/) (v7.9.0)
  - [Plotly.js](https://plotly.com/javascript/) (v2.35.2)
  - [ng2-charts](https://valor-software.com/ng2-charts/) (v5.0.4)

### Backend
- [.NET](https://dotnet.microsoft.com/) (v8.0)
  - [Entity Framework Core](https://docs.microsoft.com/ef/core/) (v9.0.0)
  - [SQLite](https://www.sqlite.org/) (v1.0.119)
  - [Google.Apis.Drive.v3](https://developers.google.com/drive/api/v3/reference) (v1.68.0.3608)

### Desktop
- [Tauri](https://tauri.app/) (v1.6.3)
  - [Rust](https://www.rust-lang.org/) (v1.57 ou superior)
  - [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)

## 💻 Requisitos do Sistema

### Windows
- Windows 10 ou superior (x64)
- Visual Studio 2022 (v17.8 ou superior)
  - ASP.NET e desenvolvimento Web
  - Desenvolvimento para desktop com .NET
  - Desenvolvimento para desktop com C++
- .NET 8.0 SDK
- Node.js (v18.19.0 LTS)
- pnpm (v8.12.0)
- Rust toolchain (v1.57 ou superior)
- WebView2 Runtime

## 🚀 Instalação

### 1. Preparação do Ambiente
```powershell
# Visual Studio e SDKs
winget install Microsoft.VisualStudio.2022.Community
winget install Microsoft.DotNet.SDK.8
winget install OpenJS.NodeJS.LTS
winget install Microsoft.EdgeWebView2Runtime

# Rust e pnpm
winget install Rustlang.Rustup
rustup default stable
npm install -g pnpm@8.12.0
```

### 2. Configuração do Projeto
```powershell
# Clone e setup
git clone https://github.com/seu-usuario/FinanceiroApp.git
cd FinanceiroApp

# Configuração de ambiente
copy Financeiro.API\appsettings.example.json Financeiro.API\appsettings.json
copy Financeiro.API\credentials.example.json Financeiro.API\credentials.json
copy FinanceiroApp.FrontEnd\src\environments\environment.example.ts FinanceiroApp.FrontEnd\src\environments\environment.ts

# Instalação de dependências
pnpm install
dotnet restore
```

## 🔧 Desenvolvimento

### Comandos Principais
```powershell
# Desenvolvimento completo (recomendado)
pnpm dev  # Inicia API, frontend e Tauri

# Desenvolvimento individual
cd Financeiro.API
dotnet run  # API em http://localhost:5005

cd FinanceiroApp.FrontEnd
pnpm start  # Frontend em http://localhost:4200
```

### Build
```powershell
# Build completo
pnpm build  # Gera instalador em src-tauri/target/release/bundle

# Build individual
cd Financeiro.API
dotnet publish -c Release

cd FinanceiroApp.FrontEnd
pnpm build
```

## 📁 Estrutura do Projeto

```
FinanceiroApp/
├── Financeiro.API/           # Backend .NET API
│   ├── Controllers/          # Controllers da API
│   ├── Models/               # Modelos de dados
|   |── DTOs/                 # DTOs
│   └── Program.cs            # Programa principal
├── Financeiro.Core/          # Biblioteca compartilhada
│   |── Data/                 # Contexto e migrations
│   ├── Entities/             # Modelos de domínio
│   ├── Extensions/           # Extensões personalizadas
│   ├── Migrations/           # Migrations
│   ├── Models/               # Modelos de dados
│   ├── ViewModels/           # ViewModels
│   └── Services/             # Serviços de negócio
├── FinanceiroApp.FrontEnd/   # Frontend Angular
│   └── src/
│       ├── app/              # Código fonte Angular
│       ├── assets/           # Recursos estáticos
│       └── environments/     # Configurações
└── src-tauri/                # Configuração Tauri
    ├── src/                  # Código Rust
    └── target/               # Build outputs
```

## 👥 Contribuindo

Adoraríamos sua ajuda para melhorar o FinanceiroApp! 

### Git Flow

Usamos um fluxo de trabalho baseado em branches:
- `master`: Branch de produção
- `develop`: Branch de desenvolvimento
- `feature/*`: Novas funcionalidades
- `release/*`: Preparação de releases
- `hotfix/*`: Correções urgentes

Para contribuir:
1. Fork o repositório
2. Crie uma branch a partir de `develop`
3. Faça suas alterações
4. Abra um Pull Request

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para instruções detalhadas.

### Convenções de Commit

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):
```bash
feat(auth): adiciona login com Google
fix(dashboard): corrige cálculo de saldo
docs(readme): atualiza instruções
```

## 📝 Licença

Este projeto está atualmente em desenvolvimento privado. Uma licença open source apropriada será escolhida quando o projeto for tornado público.

Para discussões sobre colaboração:
- Email: pedrohenriquebraga735@gmail.com

---
Feito com ❤️ pela comunidade
