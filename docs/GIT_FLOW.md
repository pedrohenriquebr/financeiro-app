# Git Flow - FinanceiroApp

## Branches Principais

### `master` (produção)
- Branch protegida
- Contém código estável e pronto para produção
- Merge apenas via Pull Request com aprovação
- Tags para cada release

### `develop` (desenvolvimento)
- Branch principal de desenvolvimento
- Base para features e hotfixes
- Integração contínua ativa

## Branches de Suporte

### Feature Branches (`feature/*`)
- Criadas a partir de: `develop`
- Merge para: `develop`
- Nomenclatura: `feature/nome-da-feature`

### Release Branches (`release/*`)
- Criadas a partir de: `develop`
- Merge para: `master` e `develop`
- Nomenclatura: `release/v1.0.0`

### Hotfix Branches (`hotfix/*`)
- Criadas a partir de: `master`
- Merge para: `master` e `develop`
- Nomenclatura: `hotfix/descricao-do-fix`

## Fluxo de Trabalho

1. **Desenvolvimento de Feature**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nova-funcionalidade
   # desenvolvimento...
   git push origin feature/nova-funcionalidade
   # criar PR para develop
   ```

2. **Preparação de Release**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b release/v1.0.0
   # ajustes finais, versioning...
   git push origin release/v1.0.0
   # criar PR para main e develop
   ```

3. **Hotfix**
   ```bash
   git checkout main
   git pull origin main
   git checkout -b hotfix/descricao
   # correções...
   git push origin hotfix/descricao
   # criar PR para main e develop
   ```

## Convenções de Commit

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc.
- `refactor`: Refatoração de código
- `test`: Testes
- `chore`: Manutenção, deps, etc.

### Formato
```
tipo(escopo): descrição curta

Descrição longa (opcional)

Footer (opcional)
```

Exemplo:
```
feat(auth): implementa autenticação com Google

- Adiciona OAuth2 com Google
- Implementa persistência do token
- Adiciona testes de integração

Closes #123
```

## Proteções de Branch

### `master` e `develop`
- Requer PR aprovado
- Requer CI/CD passar
- Proibido push direto
- Requer commits assinados

## Releases e Versionamento

- Semantic Versioning (MAJOR.MINOR.PATCH)
- Tags em cada merge para main
- Changelog automático
- Release notes obrigatórias
