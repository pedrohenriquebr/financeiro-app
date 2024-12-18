# FinanceiroApp

Uma aplicação desktop moderna para controle financeiro pessoal, construída com Tauri, .NET 6 e Angular. Focada em privacidade, permite gerenciar suas finanças offline com a opção de backup seguro no Google Drive (em breve).

<p align="center">
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#%EF%B8%8F-tecnologias">Tecnologias</a> •
  <a href="#-requisitos-do-sistema">Requisitos</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-configuração">Configuração</a> •
  <a href="#-desenvolvimento">Desenvolvimento</a> •
  <a href="#-contribuindo">Contribuindo</a>
</p>

## ✨ Funcionalidades

### Implementadas
- 💰 Gerenciamento de contas bancárias
  - Cadastro de múltiplas contas
  - Controle de saldo
  - Histórico de transações
- 📊 Controle de receitas e despesas
  - Registro de transações
  - Filtros avançados
  - Visualização por período
- 🏷️ Categorização de transações
  - Categorias personalizáveis
  - Subcategorias
  - Ícones personalizados
- 📅 Agendamento de transações recorrentes
  - Agendamento diário, semanal, mensal ou anual
  - Notificações de vencimento
  - Processamento automático
- 📈 Relatórios e estatísticas
  - Gráficos de gastos por categoria
  - Evolução patrimonial
  - Análise de tendências
- 🔒 Funciona offline por padrão
  - Banco de dados local
  - Sem dependência de serviços externos
  - Privacidade garantida

### Em Desenvolvimento
- 💾 Backup automático no Google Drive
- 🔄 Atualizações automáticas
- 📱 Sincronização com aplicativo móvel
- 📊 Relatórios personalizados
- 🎯 Metas financeiras
- 💳 Importação de extratos bancários

## 🛠️ Tecnologias

### Frontend
- [Angular](https://angular.io/) (v15.2.0)
  - [Angular Material](https://material.angular.io/) (v15.2.0)
  - [RxJS](https://rxjs.dev/) (v7.8.0)
  - [TypeScript](https://www.typescriptlang.org/) (v4.9.5)
  - [SCSS](https://sass-lang.com/) para estilização

### Backend
- [.NET 6](https://dotnet.microsoft.com/download/dotnet/6.0) (v6.0.416 ou superior)
  - [Entity Framework Core](https://docs.microsoft.com/ef/core/) (v6.0.25)
  - [SQLite](https://www.sqlite.org/) (v6.0.25)
  - [Serilog](https://serilog.net/) (v3.1.1)

### Desktop
- [Tauri](https://tauri.app/) (v1.5.3)
  - [Rust](https://www.rust-lang.org/) (v1.74.0 ou superior)
  - [WebView2](https://developer.microsoft.com/microsoft-edge/webview2/)

### Ferramentas de Desenvolvimento
- [Node.js](https://nodejs.org/) (v18.19.0 LTS recomendado)
- [pnpm](https://pnpm.io/) (v8.12.0 ou superior)
- [Git](https://git-scm.com/) (v2.43.0 ou superior)
- [Visual Studio 2022](https://visualstudio.microsoft.com/) ou [VS Code](https://code.visualstudio.com/)

## 💻 Requisitos do Sistema

### Windows
- Windows 10 ou superior (x64)
- WebView2 Runtime
- Visual Studio 2022 com:
  - Desenvolvimento para Desktop com .NET
  - Desenvolvimento Web e ASP.NET
- Rust toolchain (via rustup)
- Node.js e pnpm

### Requisitos de Hardware
- Processador: 2 cores, 2.0 GHz
- Memória RAM: 4 GB mínimo (8 GB recomendado)
- Armazenamento: 1 GB de espaço livre

## 🚀 Instalação

### 1. Preparação do Ambiente

#### Windows
1. Instale o Visual Studio 2022
   ```powershell
   winget install Microsoft.VisualStudio.2022.Community
   ```
   Durante a instalação, selecione:
   - ASP.NET and web development
   - .NET desktop development
   - C++ desktop development (necessário para Rust)

2. Instale o Rust
   ```powershell
   winget install Rustlang.Rustup
   rustup default stable
   ```

3. Instale o Node.js e pnpm
   ```powershell
   winget install OpenJS.NodeJS.LTS
   npm install -g pnpm@8.12.0
   ```

4. Instale o WebView2
   ```powershell
   winget install Microsoft.EdgeWebView2Runtime
   ```

### 2. Clone e Configuração

1. Clone o repositório
   ```bash
   git clone https://github.com/pedrohenriquebr/FinanceiroApp.git
   cd FinanceiroApp
   ```

2. Instale as dependências do frontend
   ```bash
   cd FinanceiroApp.FrontEnd
   pnpm install
   ```

3. Restaure as dependências do backend
   ```bash
   cd ../Financeiro.API
   dotnet restore
   ```

4. Configure as variáveis de ambiente (veja a seção Configuração)

## ⚙️ Configuração

### Variáveis de Ambiente

1. Frontend (Angular)
   ```bash
   cp FinanceiroApp.FrontEnd/src/environments/environment.example.ts FinanceiroApp.FrontEnd/src/environments/environment.ts
   cp FinanceiroApp.FrontEnd/src/environments/environment.example.ts FinanceiroApp.FrontEnd/src/environments/environment.development.ts
   ```

2. Backend (.NET)
   ```bash
   cp Financeiro.API/appsettings.example.json Financeiro.API/appsettings.json
   cp Financeiro.API/appsettings.example.json Financeiro.API/appsettings.Development.json
   ```

### Google OAuth (Em breve)
1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative as APIs:
   - Google Drive API
   - Google OAuth2
3. Configure as credenciais OAuth
4. Adicione as credenciais nos arquivos de configuração

## 🔧 Desenvolvimento

### Estrutura do Projeto
```
FinanceiroApp/
├── Financeiro.API/           # Backend .NET API
│   ├── Controllers/          # Controllers da API
│   ├── Models/               # Modelos de dados
|   |── DTOs/                 # DTOs
│   ├── Program.cs            # Programa principal
├── Financeiro.Core/          # Biblioteca compartilhada
│   |── Data/                 # Contexto e migrations
│   ├── Entities/             # Modelos de domínio
│   ├── Extensions/           # Extensões personalizadas
│   ├── Migrations/           # Migrations
│   ├── Models/               # Modelos de dados
│   ├── ViewModels/           # ViewModels
│   └── Services/             # Serviços de negócio
├── FinanceiroApp.FrontEnd/   # Frontend Angular
│   ├── src/
│   │   ├── app/              # Código fonte Angular
│   │   ├── assets/           # Recursos estáticos
│   │   └── environments/     # Configurações
└── src-tauri/                # Configuração Tauri
    ├── src/                  # Código Rust
    └── target/               # Build outputs

### Comandos Úteis

#### Desenvolvimento
```bash
# Inicia o ambiente de desenvolvimento
pnpm run dev

# Compila o frontend
cd FinanceiroApp.FrontEnd
pnpm run build

# Executa os testes
pnpm run test

# Compila a API
cd Financeiro.API
dotnet build

# Executa as migrations
dotnet ef database update
```

#### Produção
```bash
# Build completo
pnpm run build

# Gera o instalador
pnpm run tauri build
```

## 🤝 Contribuindo

Adoramos receber contribuições! Aqui está como você pode ajudar:

### 1. Preparação
1. Faça um fork do projeto
2. Clone seu fork: `git clone https://github.com/seu-usuario/FinanceiroApp.git`
3. Adicione o upstream: `git remote add upstream https://github.com/pedrohenriquebr/FinanceiroApp.git`

### 2. Desenvolvimento
1. Crie uma branch: `git checkout -b feature/sua-feature`
2. Faça suas alterações
3. Siga os padrões de código:
   - Use [Conventional Commits](https://www.conventionalcommits.org/)
   - Mantenha a consistência com o estilo existente
   - Adicione testes quando relevante

### 3. Submissão
1. Atualize sua branch: `git pull upstream main`
2. Resolva conflitos se necessário
3. Push: `git push origin feature/sua-feature`
4. Abra um Pull Request

### 4. Diretrizes
- Mantenha PRs pequenos e focados
- Documente novas funcionalidades
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🐛 Reportando Bugs

1. Use o [GitHub Issues](https://github.com/pedrohenriquebr/FinanceiroApp/issues)
2. Descreva o problema detalhadamente
3. Inclua passos para reproduzir
4. Adicione logs e screenshots se possível

## 📚 Documentação Adicional

- [Wiki do Projeto](https://github.com/pedrohenriquebr/FinanceiroApp/wiki)
- [Guia de Contribuição](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## ✨ Agradecimentos

- [Tauri](https://tauri.app/)
- [Angular](https://angular.io/)
- [.NET](https://dotnet.microsoft.com/)
- Todos os [contribuidores](https://github.com/pedrohenriquebr/FinanceiroApp/graphs/contributors)

## 📞 Suporte

- GitHub Issues: Para bugs e features
- Discussions: Para dúvidas e discussões
- Email: Para contato direto

---
Feito com ❤️ pela comunidade
