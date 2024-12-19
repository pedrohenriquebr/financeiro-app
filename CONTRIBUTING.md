# Contribuindo para o FinanceiroApp

Obrigado por considerar contribuir com o FinanceiroApp! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## 🌳 Git Flow

Seguimos um fluxo de trabalho baseado em branches para manter o desenvolvimento organizado:

### Branches Principais
- `master`: Código em produção
- `develop`: Branch principal de desenvolvimento

### Branches de Feature
1. Crie sua branch a partir de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/sua-feature
   ```

2. Desenvolva sua feature seguindo nossas convenções de código

3. Commit suas mudanças:
   ```bash
   git commit -m "feat(escopo): descrição da mudança"
   ```

4. Push para o repositório:
   ```bash
   git push origin feature/sua-feature
   ```

5. Abra um Pull Request para `develop`

### Convenções de Commit

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação
- `refactor`: Refatoração
- `test`: Testes
- `chore`: Manutenção

Exemplo:
```bash
feat(auth): adiciona login com Google
fix(dashboard): corrige cálculo de saldo
docs(readme): atualiza instruções de instalação
```

## 🚀 Processo de Desenvolvimento

1. **Antes de Começar**
   - Verifique se há uma issue relacionada
   - Discuta grandes mudanças na issue primeiro

2. **Desenvolvimento**
   - Siga os padrões de código
   - Adicione testes quando relevante
   - Mantenha a documentação atualizada

3. **Pull Request**
   - Descreva claramente as mudanças
   - Referencie issues relacionadas
   - Aguarde review e CI passar

## 🧪 Testes

- Execute testes antes de submeter PR:
  ```bash
  # Backend
  dotnet test

  # Frontend
  cd FinanceiroApp.FrontEnd
  pnpm test
  ```

## 📝 Documentação

- Atualize a documentação afetada
- Mantenha o README.md atualizado
- Documente novas features

## 🔍 Review

Seu PR será revisado para:
- Qualidade do código
- Cobertura de testes
- Documentação
- Convenções de commit
- CI/CD passar

## 📜 Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto.

## 🤝 Código de Conduta

- Seja respeitoso
- Aceite feedback construtivo
- Foque na qualidade
- Ajude outros contribuidores

## ❓ Dúvidas

Para dúvidas ou discussões:
- Abra uma issue
- Comente em PRs existentes
- Entre em contato: pedrohenriquebraga735@gmail.com
