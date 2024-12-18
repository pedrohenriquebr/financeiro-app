# Documentação do Frontend - Especificação de Requisitos

## 1. Visão Geral
O FinanceiroApp é um sistema de gerenciamento financeiro pessoal que permite aos usuários controlar suas finanças de forma eficiente e intuitiva. O sistema oferece funcionalidades para gerenciar transações, categorias, contas bancárias, metas financeiras e análises detalhadas.

### 1.1 Objetivos
- Fornecer uma visão clara e organizada das finanças do usuário
- Automatizar o processo de categorização de transações
- Facilitar o acompanhamento de metas financeiras
- Gerar relatórios e análises financeiras
- Permitir o gerenciamento de múltiplas contas bancárias

### 1.2 Requisitos Técnicos
- Angular 15+
- Material Design para UI/UX
- Responsividade para diferentes dispositivos
- Integração com API RESTful
- Autenticação JWT
- Armazenamento local para cache
- Suporte a PWA (Progressive Web App)

### 1.3 Arquitetura do Sistema
- Arquitetura modular baseada em componentes
- Gerenciamento de estado centralizado
- Lazy loading de módulos
- Interceptadores HTTP para autenticação e tratamento de erros
- Serviços compartilhados para lógica de negócios
- Guards para proteção de rotas
- Resolvers para pré-carregamento de dados

### 1.4 Padrões de Design
- Material Design para consistência visual
- Layout responsivo com grid system
- Feedback visual imediato para ações do usuário
- Tooltips e hints para melhor UX
- Cores semânticas para status e ações
- Ícones consistentes em todo o sistema
- Animações suaves para transições

## 2. Módulos do Sistema

### 2.1 Dashboard (/dashboard)
Principal interface do sistema que apresenta uma visão consolidada das finanças do usuário.

#### 2.1.1 Visão Geral
##### Componentes Principais
1. **Indicadores Financeiros**
   - Saldo total consolidado com variação percentual
   - Receitas e despesas do período
   - Variação mensal com indicador visual (positivo/negativo)
   - Taxa de economia

2. **Filtros Avançados**
   - Seleção de período com date range picker
   - Múltipla seleção de contas bancárias
   - Agrupamento por dia/semana/mês
   - Atualização em tempo real dos indicadores

3. **Gráficos e Visualizações**
   - Gráfico de evolução do saldo
   - Distribuição de despesas por categoria
   - Comparativo mensal de receitas e despesas
   - Tendências e projeções

#### 2.1.2 Funcionalidades
##### Filtros e Controles
1. **Filtro de Período**
   - Data inicial e final
   - Atalhos para períodos comuns (mês atual, último mês, ano)
   - Atualização automática dos dados

2. **Filtros Adicionais**
   - Contas bancárias específicas
   - Categorias
   - Agrupamento (dia, semana, mês)

##### Interatividade
1. **Gráficos**
   - Zoom e pan
   - Tooltips detalhados
   - Legenda interativa
   - Exportação de dados
   - Personalização de cores

2. **Metas Financeiras**
   - Criação rápida
   - Atualização de progresso
   - Visualização de detalhes
   - Projeção de atingimento

3. **Transações Agendadas**
   - Visualização em lista
   - Confirmação rápida
   - Edição inline
   - Filtros específicos

#### 2.1.3 Componentes Específicos
##### Financial Goal Dialog
1. **Campos do Formulário**
   - Nome da meta
   - Valor alvo
   - Valor atual
   - Data alvo
   - Cálculo automático de:
     - Percentual completo
     - Valor mensal necessário
     - Meses restantes

2. **Validações**
   - Nome obrigatório
   - Valores positivos
   - Data alvo futura
   - Valor atual não maior que valor alvo

##### Scheduled Transaction Dialog
1. **Campos do Formulário**
   - Descrição
   - Valor
   - Data programada
   - Categoria
   - Conta bancária
   - Recorrência
   - Observações

2. **Validações**
   - Descrição obrigatória
   - Valor diferente de zero
   - Data futura
   - Categoria e conta obrigatórias

#### 2.1.4 Comportamentos
##### Atualizações
- Carregamento inicial dos dados
- Atualização automática a cada alteração de filtro
- Cache de dados para performance
- Loading states durante atualizações

##### Responsividade
- Layout adaptativo
- Gráficos redimensionáveis
- Visualização otimizada para mobile
- Touch-friendly

##### Feedback Visual
- Loading spinners
- Mensagens de erro
- Tooltips informativos
- Animações suaves
- Snackbars para confirmações

##### Integrações
- Serviço de transações
- Serviço de contas bancárias
- Serviço de categorias
- Serviço de metas financeiras
- Serviço de transações agendadas

#### 2.1.5 Performance
- Lazy loading de componentes
- Caching de dados
- Otimização de consultas
- Debounce em filtros
- Paginação de listas longas

#### 2.1.6 Estados de Erro
- Erro de carregamento
- Erro de atualização
- Erro de submissão
- Timeout de requisição
- Erro de validação

### 2.2 Transações (/transactions)

#### 2.2.1 Lista de Transações
##### Requisitos Funcionais
- Listar todas as transações com paginação
- Filtrar por período, categoria, conta e tipo
- Permitir ordenação por qualquer coluna
- Exportar dados para Excel/CSV
- Seleção múltipla para operações em lote

##### Comportamentos
- Paginação server-side (20 itens por página)
- Atualização automática ao aplicar filtros
- Highlight de transações recentes
- Preview de anexos (recibos/comprovantes)
- Modo de edição inline

##### Campos Exibidos
- Data e hora
- Descrição
- Valor (vermelho para despesas, verde para receitas)
- Categoria (com ícone)
- Conta bancária
- Status (efetivada/pendente)
- Ações (editar, excluir, duplicar)

#### 2.2.2 Formulário de Transação
##### Requisitos Funcionais
- Criar/editar transações
- Suporte a transações recorrentes
- Upload de comprovantes
- Sugestão automática de categoria
- Divisão de transação em múltiplas categorias
- Suporte a transferências entre contas
- Status da transação (Pendente/Concluído/Cancelado)
- Campo para observações
- Formatação de moeda (R$) com separadores
- Suporte a valores positivos (receitas) e negativos (despesas)

##### Validações
- Valor obrigatório e diferente de zero
- Data não futura (exceto agendamentos)
- Categoria obrigatória (exceto para transferências)
- Conta bancária obrigatória
- Descrição mínima de 3 caracteres
- Conta de destino obrigatória para transferências
- Não permitir mesma conta de origem e destino em transferências
- Status obrigatório
- Validação de datas de recorrência
- Frequência de recorrência válida

##### Comportamentos
- Auto-save do rascunho
- Preenchimento automático baseado em transações similares
- Preview do saldo após a transação
- Confirmação antes de salvar valores altos
- Alternância dinâmica entre transação normal e transferência
  - Quando marcado como transferência:
    - Oculta campo de categoria
    - Exibe campo de conta de destino
    - Ajusta validações necessárias
- Formatação automática de valores monetários
- Feedback visual de campos obrigatórios
- Feedback de erros por campo
- Desabilitação do botão de salvar durante submissão
- Máscara de moeda com configurações brasileiras:
  - Prefixo: "R$ "
  - Separador decimal: ","
  - Separador de milhar: "."
  - Precisão: 2 casas decimais
  - Alinhamento à direita

##### Campos do Formulário
1. **Data**
   - Tipo: Date Picker
   - Obrigatório: Sim
   - Formato: DD/MM/YYYY

2. **Valor**
   - Tipo: Input com máscara de moeda
   - Obrigatório: Sim
   - Formato: R$ #.###,##
   - Hint: "Use valores positivos para receitas e negativos para despesas"

3. **Descrição**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Tamanho máximo: 100 caracteres

4. **Conta**
   - Tipo: Select
   - Obrigatório: Sim
   - Dados: Lista de contas bancárias ativas

5. **É Transferência**
   - Tipo: Checkbox
   - Padrão: Falso
   - Altera comportamento do formulário

6. **Conta de Destino**
   - Tipo: Select
   - Obrigatório: Se for transferência
   - Dados: Lista de contas bancárias ativas
   - Visível: Apenas se "É Transferência" for verdadeiro

7. **Categoria**
   - Tipo: Select
   - Obrigatório: Se não for transferência
   - Dados: Lista de categorias ativas
   - Visível: Apenas se "É Transferência" for falso

8. **Status**
   - Tipo: Select
   - Obrigatório: Sim
   - Opções: 
     - Pendente (padrão)
     - Concluído
     - Cancelado

9. **Observações**
   - Tipo: Textarea
   - Obrigatório: Não
   - Linhas: 3
   - Tamanho máximo: 500 caracteres

10. **Recorrência** (quando implementado)
    - É Recorrente: Checkbox
    - Tipo de Recorrência: Select (Diário, Semanal, Mensal, Anual)
    - Frequência: Number Input
    - Data Final: Date Picker

##### Estados do Formulário
1. **Estado Inicial**
   - Data preenchida com data atual
   - Status "Pendente"
   - Demais campos vazios

2. **Estado de Edição**
   - Todos os campos preenchidos com dados da transação
   - Validações ativas
   - Botão "Salvar" habilitado

3. **Estado de Submissão**
   - Campos desabilitados
   - Botões desabilitados
   - Loading spinner visível

4. **Estado de Erro**
   - Mensagens de erro exibidas por campo
   - Campos inválidos destacados
   - Botão "Salvar" desabilitado

##### Mensagens de Erro
- Data: "Data é obrigatória"
- Valor: 
  - "Valor é obrigatório"
  - "Valor deve ser diferente de zero"
- Descrição: "Descrição é obrigatória"
- Conta: "Conta é obrigatória"
- Conta de Destino: "Conta de destino é obrigatória"
- Categoria: "Categoria é obrigatória"
- Status: "Status é obrigatório"

##### Feedback Visual
- Loading spinner durante submissão
- Snackbar de sucesso após salvar
- Snackbar de erro em caso de falha
- Highlight de campos com erro
- Tooltips informativos nos campos

##### Integrações
- Validação de nome único por tipo
- Verificação de uso da categoria em transações antes de exclusão
- Cache de dados para melhor performance

##### Responsividade
- Layout adaptativo para diferentes telas
- Botões e campos otimizados para touch
- Modal responsivo
- Scrolling suave em listas longas

##### Atalhos de Teclado
- Enter: Submeter formulário
- Esc: Fechar modal
- Tab: Navegação entre campos
- Ctrl + S: Salvar

### 2.3 Categorias (/categories)

#### 2.3.1 Lista de Categorias
##### Requisitos Funcionais
- Exibição em tabela com paginação e ordenação
- Filtro global para busca em todos os campos
- Ações de editar e excluir por categoria
- Confirmação antes de excluir
- Feedback de carregamento e erros

##### Campos Exibidos
1. **Nome da Categoria**
   - Nome descritivo da categoria
   - Ordenável
   - Principal campo de busca

2. **Tipo**
   - Receita ou Despesa
   - Ordenável
   - Indicador visual por tipo
   - Filtro rápido

3. **Ações**
   - Botão de editar
   - Botão de excluir
   - Tooltips informativos

##### Comportamentos
- Paginação com opções padrão
- Ordenação por qualquer coluna
- Filtro em tempo real
- Loading spinner durante carregamento
- Feedback visual de erros via snackbar
- Atualização automática após operações CRUD
- Mensagem quando não há dados
- Mensagem quando filtro não retorna resultados
- Confirmação de exclusão com detalhes da categoria

#### 2.3.2 Formulário de Categoria
##### Requisitos Funcionais
- Modal de criação/edição
- Validação em tempo real
- Feedback visual de erros
- Estado de carregamento durante submissão
- Navegação entre campos via Tab
- Suporte a atalhos de teclado

##### Campos do Formulário
1. **Nome**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Placeholder: "Ex: Alimentação"
   - Validações:
     - Campo obrigatório
     - Mínimo 3 caracteres
     - Máximo 100 caracteres
     - Nome único por tipo

2. **Tipo**
   - Tipo: Select
   - Obrigatório: Sim
   - Opções: 
     - Receita (Income)
     - Despesa (Expense)
   - Validações:
     - Campo obrigatório

3. **Descrição**
   - Tipo: Textarea
   - Obrigatório: Não
   - Placeholder: "Descrição detalhada da categoria"
   - Máximo: 500 caracteres

##### Estados do Formulário
1. **Estado Inicial**
   - Campos vazios
   - Botões habilitados
   - Sem mensagens de erro

2. **Estado de Edição**
   - Campos preenchidos com dados da categoria
   - Validações ativas
   - Botão "Salvar" habilitado

3. **Estado de Submissão**
   - Campos desabilitados
   - Botões desabilitados
   - Loading spinner visível

4. **Estado de Erro**
   - Campos habilitados
   - Mensagens de erro exibidas
   - Botão "Salvar" habilitado

##### Mensagens de Erro
- Nome: 
  - "Nome da categoria é obrigatório"
  - "Nome deve ter pelo menos 3 caracteres"
  - "Nome já existe para este tipo de categoria"
- Tipo: "Tipo de categoria é obrigatório"
- Descrição: "Descrição não pode exceder 500 caracteres"

##### Feedback Visual
- Loading spinner durante submissão
- Snackbar de sucesso após salvar
- Snackbar de erro em caso de falha
- Highlight de campos com erro
- Tooltips informativos nos campos

##### Integrações
- Validação de nome único por tipo
- Verificação de uso da categoria em transações antes de exclusão
- Cache de dados para melhor performance

##### Responsividade
- Layout adaptativo para diferentes telas
- Botões e campos otimizados para touch
- Modal responsivo
- Scrolling suave em listas longas

##### Atalhos de Teclado
- Enter: Submeter formulário
- Esc: Fechar modal
- Tab: Navegação entre campos
- Ctrl + S: Salvar

### 2.4 Contas Bancárias (/bank-accounts)

#### 2.4.1 Lista de Contas
##### Requisitos Funcionais
- Exibição em tabela com paginação e ordenação
- Filtro global para busca em todos os campos
- Ações de editar e excluir por conta
- Confirmação antes de excluir
- Feedback de carregamento e erros

##### Campos Exibidos
1. **Banco**
   - Nome do banco vinculado
   - Ordenável

2. **Nome da Conta**
   - Nome personalizado da conta
   - Ordenável

3. **Agência**
   - Número da agência formatado (0000-0)
   - Ordenável

4. **Número da Conta**
   - Número da conta formatado (00000-0)
   - Ordenável

5. **Saldo**
   - Formatado em reais (R$)
   - Alinhado à direita
   - Negativo em vermelho
   - Ordenável

6. **Ações**
   - Botão de editar com ícone
   - Botão de excluir com ícone
   - Tooltips informativos

##### Comportamentos
- Paginação com opções de 5, 10 ou 25 itens
- Ordenação por qualquer coluna
- Filtro em tempo real
- Mensagem específica quando não há dados
- Mensagem específica quando filtro não retorna resultados
- Loading spinner durante carregamento
- Feedback visual de erros via snackbar
- Atualização automática após operações CRUD

#### 2.4.2 Formulário de Conta
##### Requisitos Funcionais
- Criar nova conta bancária
- Editar conta existente
- Seleção de banco via dropdown
- Formatação automática de agência e conta
- Validação em tempo real
- Feedback visual de erros
- Loading state durante carregamento de bancos

##### Campos do Formulário
1. **Nome da Conta**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Placeholder: "Ex: Conta Corrente"
   - Validação: Campo obrigatório

2. **Banco**
   - Tipo: Select
   - Obrigatório: Sim
   - Dados: Lista de bancos cadastrados
   - Validação: Campo obrigatório
   - Loading state próprio

3. **Agência**
   - Tipo: Text Input com máscara
   - Obrigatório: Sim
   - Formato: 0000-0
   - Máximo: 6 caracteres
   - Validações:
     - Campo obrigatório
     - Apenas números e hífen
     - Formato específico
   - Formatação automática durante digitação

4. **Número da Conta**
   - Tipo: Text Input com máscara
   - Obrigatório: Sim
   - Formato: 00000-0
   - Máximo: 7 caracteres
   - Validações:
     - Campo obrigatório
     - Apenas números e hífen
     - Formato específico
   - Formatação automática durante digitação

5. **Saldo Inicial**
   - Tipo: Number Input
   - Obrigatório: Sim
   - Prefixo: "R$ "
   - Step: 0.01 (duas casas decimais)
   - Validação: Campo obrigatório

##### Estados do Formulário
1. **Estado de Carregamento**
   - Spinner de loading
   - Mensagem "Carregando bancos..."
   - Formulário desabilitado

2. **Estado Inicial**
   - Campos vazios
   - Botões habilitados
   - Sem mensagens de erro

3. **Estado de Edição**
   - Campos preenchidos com dados existentes
   - Validações ativas
   - Botão "Salvar" habilitado se válido

4. **Estado de Submissão**
   - Campos desabilitados
   - Botões desabilitados
   - Loading spinner visível

##### Validações
- Nome da conta obrigatório
- Banco obrigatório
- Agência:
  - Obrigatória
  - Formato 0000-0
  - Apenas números e hífen
- Número da conta:
  - Obrigatório
  - Formato 00000-0
  - Apenas números e hífen
- Saldo inicial obrigatório

##### Mensagens de Erro
- Nome: "Nome é obrigatório"
- Banco: "Banco é obrigatório"
- Agência: 
  - "Agência é obrigatória"
  - "Formato inválido"
- Número da conta:
  - "Número da conta é obrigatório"
  - "Formato inválido"
- Saldo: "Saldo inicial é obrigatório"

##### Feedback ao Usuário
- Loading spinner durante submissão
- Snackbar de sucesso após salvar
- Snackbar de erro em caso de falha
- Indicador visual de campos inválidos
- Mensagens de erro específicas por campo
- Loading states para operações assíncronas

##### Comportamentos Especiais
- Formatação automática de agência durante digitação
- Formatação automática de número da conta durante digitação
- Desabilitação do formulário durante submissão
- Fechamento automático após sucesso
- Atualização da lista após operações
- Confirmação antes de cancelar com dados não salvos

### 2.5 Mapeamento de Descrições (/description-mappings)

#### 2.5.1 Lista de Mapeamentos
##### Requisitos Funcionais
- Exibição em tabela com ordenação
- Padrões de expressão regular
- Prioridade de aplicação
- Teste de correspondência
- Importação/exportação de regras
- Ações de criar, editar e excluir mapeamentos
- Confirmação antes de excluir
- Feedback de carregamento e erros
- Atualização automática após operações CRUD

##### Campos Exibidos
1. **Padrão**
   - Texto do padrão para correspondência
   - Ordenável
   - Principal campo de busca

2. **Categoria**
   - Nome da categoria associada
   - Ordenável
   - Referência à categoria existente

3. **Ações**
   - Botão de editar com ícone
   - Botão de excluir com ícone
   - Tooltips informativos

##### Comportamentos
- Loading spinner durante carregamento
- Feedback visual de erros via snackbar
- Atualização automática após operações CRUD
- Mensagem quando não há dados
- Confirmação de exclusão com detalhes do mapeamento
- Validação de conflitos
- Sugestão de padrões
- Histórico de aplicações
- Preview em tempo real

#### 2.5.2 Formulário de Mapeamento
##### Requisitos Funcionais
- Modal de criação/edição
- Editor de expressões regulares
- Seleção de categoria
- Regras condicionais
- Período de validade
- Validação em tempo real
- Feedback visual de erros
- Estado de carregamento durante submissão
- Navegação entre campos via Tab
- Suporte a atalhos de teclado

##### Campos do Formulário
1. **Padrão**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Placeholder: "Digite o padrão"
   - Validações:
     - Campo obrigatório
     - Expressão regular válida
     - Sem conflitos com regras existentes

2. **Categoria**
   - Tipo: Select
   - Obrigatório: Sim
   - Opções: Lista de categorias disponíveis
   - Validações:
     - Campo obrigatório
     - Categoria ativa

##### Estados do Formulário
1. **Estado Inicial**
   - Campos vazios
   - Botões habilitados
   - Sem mensagens de erro

2. **Estado de Edição**
   - Campos preenchidos com dados do mapeamento
   - Validações ativas
   - Botão "Atualizar" habilitado

3. **Estado de Submissão**
   - Campos desabilitados
   - Botões desabilitados
   - Loading spinner visível

4. **Estado de Erro**
   - Campos habilitados
   - Mensagens de erro exibidas
   - Botão "Salvar" habilitado

##### Mensagens de Erro
- Padrão: 
  - "Padrão é obrigatório"
  - "Expressão regular inválida"
  - "Padrão conflita com regra existente"
- Categoria: "Categoria é obrigatória"

##### Feedback Visual
- Loading spinner durante submissão
- Snackbar de sucesso após salvar
- Snackbar de erro em caso de falha
- Highlight de campos com erro
- Tooltips informativos nos campos

##### Integrações
- Validação de campos obrigatórios
- Integração com serviço de categorias
- Cache de dados para melhor performance
- Validação de expressões regulares em tempo real

##### Responsividade
- Layout adaptativo para diferentes telas
- Botões e campos otimizados para touch
- Modal responsivo
- Scrolling suave em listas longas

##### Atalhos de Teclado
- Enter: Submeter formulário
- Esc: Fechar modal
- Tab: Navegação entre campos

### 2.6 Metas Financeiras (/financial-goals)

#### 2.6.1 Lista de Metas
##### Requisitos Funcionais
- Exibição em tabela com paginação e ordenação
- Barra de progresso visual para cada meta
- Ações de criar, editar e excluir metas
- Confirmação antes de excluir
- Feedback de carregamento e erros
- Atualização automática após operações CRUD

##### Campos Exibidos
1. **Nome da Meta**
   - Nome descritivo da meta financeira
   - Ordenável
   - Principal campo de busca

2. **Valor Alvo**
   - Valor total desejado
   - Formatado em reais (R$)
   - Ordenável

3. **Valor Atual**
   - Valor já acumulado
   - Formatado em reais (R$)
   - Ordenável

4. **Data Limite**
   - Data objetivo para atingir a meta
   - Formato DD/MM/YYYY
   - Ordenável

5. **Progresso**
   - Barra de progresso visual
   - Cores dinâmicas baseadas no progresso:
     - Vermelho: < 30%
     - Amarelo: 30-70%
     - Verde: > 70%

6. **Ações**
   - Botão de editar
   - Botão de excluir
   - Tooltips informativos

##### Comportamentos
- Paginação com opções padrão
- Ordenação por qualquer coluna
- Loading spinner durante carregamento
- Feedback visual de erros via snackbar
- Atualização automática após operações CRUD
- Mensagem quando não há metas cadastradas
- Confirmação de exclusão com detalhes da meta

#### 2.6.2 Formulário de Meta
##### Requisitos Funcionais
- Modal de criação/edição
- Validação em tempo real
- Feedback visual de erros
- Estado de carregamento durante submissão
- Navegação entre campos via Tab
- Suporte a atalhos de teclado

##### Campos do Formulário
1. **Nome**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Placeholder: "Ex: Viagem de férias"
   - Validações:
     - Campo obrigatório
     - Mínimo 3 caracteres
     - Máximo 100 caracteres

2. **Valor Alvo**
   - Tipo: Currency Input
   - Obrigatório: Sim
   - Máscara: R$ 0.000,00
   - Validações:
     - Campo obrigatório
     - Valor maior que zero

3. **Valor Atual**
   - Tipo: Currency Input
   - Obrigatório: Sim
   - Máscara: R$ 0.000,00
   - Validações:
     - Campo obrigatório
     - Valor maior ou igual a zero
     - Valor menor ou igual ao valor alvo

4. **Data Limite**
   - Tipo: Date Picker
   - Obrigatório: Sim
   - Validações:
     - Campo obrigatório
     - Data futura

5. **Descrição**
   - Tipo: Textarea
   - Obrigatório: Não
   - Placeholder: "Descrição detalhada da meta"
   - Máximo: 500 caracteres

##### Estados do Formulário
1. **Estado Inicial**
   - Campos vazios
   - Botões habilitados
   - Sem mensagens de erro

2. **Estado de Edição**
   - Campos preenchidos com dados da meta
   - Validações ativas
   - Botão "Salvar" habilitado

3. **Estado de Submissão**
   - Campos desabilitados
   - Botões desabilitados
   - Loading spinner visível

4. **Estado de Erro**
   - Campos habilitados
   - Mensagens de erro exibidas
   - Botão "Salvar" habilitado

##### Mensagens de Erro
- Nome: 
  - "Nome da meta é obrigatório"
  - "Nome deve ter pelo menos 3 caracteres"
- Valor Alvo: 
  - "Valor alvo é obrigatório"
  - "Valor alvo deve ser maior que zero"
- Valor Atual:
  - "Valor atual é obrigatório"
  - "Valor atual não pode ser negativo"
  - "Valor atual não pode ser maior que o valor alvo"
- Data Limite:
  - "Data limite é obrigatória"
  - "Data limite deve ser uma data futura"
- Descrição: "Descrição não pode exceder 500 caracteres"

##### Feedback Visual
- Loading spinner durante submissão
- Snackbar de sucesso após salvar
- Snackbar de erro em caso de falha
- Highlight de campos com erro
- Tooltips informativos nos campos

##### Integrações
- Cálculo automático de progresso
- Validações em tempo real
- Cache de dados para melhor performance

##### Responsividade
- Layout adaptativo para diferentes telas
- Botões e campos otimizados para touch
- Modal responsivo
- Scrolling suave em listas longas

##### Atalhos de Teclado
- Enter: Submeter formulário
- Esc: Fechar modal
- Tab: Navegação entre campos
- Ctrl + S: Salvar

### 2.7 Bancos (/banks)

#### 2.7.1 Lista de Bancos
##### Requisitos Funcionais
- Exibição em tabela com paginação e ordenação
- Filtro global para busca em todos os campos
- Ações de editar e excluir por banco
- Confirmação antes de excluir
- Feedback de carregamento e erros

##### Campos Exibidos
1. **Nome do Banco**
   - Nome completo do banco
   - Ordenável
   - Principal campo de busca

2. **Código**
   - Código identificador do banco
   - Ordenável
   - Formato numérico

3. **Ações**
   - Botão de editar
   - Botão de excluir
   - Tooltips informativos

##### Comportamentos
- Paginação server-side
- Ordenação por qualquer coluna
- Filtro em tempo real
- Loading spinner durante carregamento
- Feedback visual de erros via snackbar
- Atualização automática após operações CRUD
- Mensagem quando não há dados
- Mensagem quando filtro não retorna resultados

#### 2.7.2 Formulário de Banco
##### Requisitos Funcionais
- Modal de criação/edição
- Validação em tempo real
- Feedback visual de erros
- Estado de carregamento durante submissão

##### Campos do Formulário
1. **Nome do Banco**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Placeholder: "Ex: Banco do Brasil"
   - Validações:
     - Campo obrigatório
     - Mínimo 3 caracteres
     - Máximo 100 caracteres

2. **Código**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Placeholder: "Ex: 001"
   - Validações:
     - Campo obrigatório
     - Apenas números
     - Máximo 3 caracteres

##### Estados do Formulário
1. **Estado Inicial**
   - Campos vazios
   - Botões habilitados
   - Sem mensagens de erro

2. **Estado de Edição**
   - Campos preenchidos com dados do banco
   - Validações ativas
   - Botão "Salvar" habilitado

3. **Estado de Submissão**
   - Campos desabilitados
   - Botões desabilitados
   - Loading spinner visível

4. **Estado de Erro**
   - Campos habilitados
   - Mensagens de erro exibidas
   - Botão "Salvar" habilitado

##### Mensagens de Erro
- Nome: "Nome do banco é obrigatório"
- Código: 
  - "Código do banco é obrigatório"
  - "Código deve conter apenas números"
  - "Código deve ter no máximo 3 caracteres"

##### Feedback Visual
- Loading spinner durante submissão
- Snackbar de sucesso após salvar
- Snackbar de erro em caso de falha
- Highlight de campos com erro
- Tooltips informativos nos campos

##### Integrações
- Validação de código único
- Verificação de uso do banco em contas bancárias antes de exclusão
- Cache de dados para melhor performance

##### Responsividade
- Layout adaptativo para diferentes telas
- Botões e campos otimizados para touch
- Modal responsivo
- Scrolling suave em listas longas

### 2.8 Mapeamento de Descrições (/description-mapping)

#### 2.8.1 Lista de Mapeamentos
##### Requisitos Funcionais
- Exibição em tabela com ordenação
- Padrões de expressão regular
- Prioridade de aplicação
- Teste de correspondência
- Importação/exportação de regras
- Ações de criar, editar e excluir mapeamentos
- Confirmação antes de excluir
- Feedback de carregamento e erros
- Atualização automática após operações CRUD

##### Campos Exibidos
1. **Padrão**
   - Texto do padrão para correspondência
   - Ordenável
   - Principal campo de busca

2. **Categoria**
   - Nome da categoria associada
   - Ordenável
   - Referência à categoria existente

3. **Ações**
   - Botão de editar com ícone
   - Botão de excluir com ícone
   - Tooltips informativos

##### Comportamentos
- Loading spinner durante carregamento
- Feedback visual de erros via snackbar
- Atualização automática após operações CRUD
- Mensagem quando não há dados
- Confirmação de exclusão com detalhes do mapeamento
- Validação de conflitos
- Sugestão de padrões
- Histórico de aplicações
- Preview em tempo real

#### 2.8.2 Formulário de Mapeamento
##### Requisitos Funcionais
- Modal de criação/edição
- Editor de expressões regulares
- Seleção de categoria
- Regras condicionais
- Período de validade
- Validação em tempo real
- Feedback visual de erros
- Estado de carregamento durante submissão
- Navegação entre campos via Tab
- Suporte a atalhos de teclado

##### Campos do Formulário
1. **Padrão**
   - Tipo: Text Input
   - Obrigatório: Sim
   - Placeholder: "Digite o padrão"
   - Validações:
     - Campo obrigatório
     - Expressão regular válida
     - Sem conflitos com regras existentes

2. **Categoria**
   - Tipo: Select
   - Obrigatório: Sim
   - Opções: Lista de categorias disponíveis
   - Validações:
     - Campo obrigatório
     - Categoria ativa

##### Estados do Formulário
1. **Estado Inicial**
   - Campos vazios
   - Botões habilitados
   - Sem mensagens de erro

2. **Estado de Edição**
   - Campos preenchidos com dados do mapeamento
   - Validações ativas
   - Botão "Atualizar" habilitado

3. **Estado de Submissão**
   - Campos desabilitados
   - Botões desabilitados
   - Loading spinner visível

4. **Estado de Erro**
   - Campos habilitados
   - Mensagens de erro exibidas
   - Botão "Salvar" habilitado

##### Mensagens de Erro
- Padrão: 
  - "Padrão é obrigatório"
  - "Expressão regular inválida"
  - "Padrão conflita com regra existente"
- Categoria: "Categoria é obrigatória"

##### Feedback Visual
- Loading spinner durante submissão
- Snackbar de sucesso após salvar
- Snackbar de erro em caso de falha
- Highlight de campos com erro
- Tooltips informativos nos campos

##### Integrações
- Validação de campos obrigatórios
- Integração com serviço de categorias
- Cache de dados para melhor performance
- Validação de expressões regulares em tempo real

##### Responsividade
- Layout adaptativo para diferentes telas
- Botões e campos otimizados para touch
- Modal responsivo
- Scrolling suave em listas longas

##### Atalhos de Teclado
- Enter: Submeter formulário
- Esc: Fechar modal
- Tab: Navegação entre campos

## 3. Componentes Compartilhados

### 3.1 Menu de Navegação
#### Requisitos
- Responsivo (desktop/mobile)
- Breadcrumbs
- Atalhos personalizáveis
- Indicador de notificações
- Menu de contexto

### 3.2 Componentes de Formulário
#### Requisitos
- Validação em tempo real
- Máscaras de entrada
- Auto-complete
- Persistência de dados
- Histórico de alterações

### 3.3 Componentes de Lista
#### Requisitos
- Ordenação múltipla
- Filtros avançados
- Seleção em lote
- Exportação de dados
- Personalização de colunas

## 4. Requisitos Não Funcionais

### 4.1 Desempenho
- Tempo de carregamento inicial < 3s
- Tempo de resposta < 1s
- Cache de dados frequentes
- Lazy loading de módulos
- Otimização de imagens

### 4.2 Segurança
- Autenticação JWT
- Renovação automática de token
- Proteção contra XSS/CSRF
- Criptografia de dados sensíveis
- Logs de auditoria

### 4.3 Usabilidade
- Interface intuitiva
- Feedback visual claro
- Atalhos de teclado
- Ajuda contextual
- Tour guiado para novos usuários

### 4.4 Disponibilidade
- Funcionamento offline
- Sincronização automática
- Backup automático
- Recuperação de erros
- Manutenção sem downtime

## 5. Integrações

### 5.1 API Backend
- Endpoints RESTful
- Autenticação via token
- Rate limiting
- Versionamento
- Documentação Swagger

### 5.2 Serviços Externos
- Cotações de moeda
- Integração bancária
- Backup em nuvem
- Exportação contábil
- Notificações push

## 6. Temas e Personalização

### 6.1 Temas
- Claro/Escuro
- Cores personalizáveis
- Contraste ajustável
- Fontes configuráveis
- Densidade de informação

### 6.2 Layout
- Responsivo
- Grid configurável
- Widgets móveis
- Favoritos
- Atalhos personalizados

## 7. Relatórios

### 7.1 Tipos de Relatório
- Fluxo de Caixa
- Análise por Categoria
- Orçamento vs Realizado

### 7.2 Funcionalidades
- Filtros avançados por período
- Múltiplos formatos de exportação
- Gráficos interativos
- Drill-down para detalhes
- Compartilhamento de relatórios
- Agendamento de geração
- Templates personalizáveis

## 8. Configurações

### 8.1 Preferências do Usuário
- Moeda padrão
- Formato de data
- Tema do sistema (claro/escuro)
- Notificações
- Página inicial
- Idioma

### 8.2 Configurações de Conta
- Dados do perfil
- Alteração de senha
- Dispositivos conectados
- Histórico de atividades
- Backup de dados

### 8.3 Configurações do Sistema
- Regras de categorização
- Templates de importação
- Configurações de relatórios
- Integrações externas
- Cache e performance

## 9. Segurança e Privacidade

### 9.1 Autenticação
- Login com email/senha
- Autenticação em dois fatores
- Recuperação de senha
- Bloqueio após tentativas inválidas
- Sessão com timeout

### 9.2 Autorização
- Controle de acesso baseado em perfis
- Proteção de rotas
- Validação de tokens
- Renovação automática de sessão
- Logout em múltiplos dispositivos

### 9.3 Proteção de Dados
- Criptografia de dados sensíveis
- Mascaramento de informações
- Política de retenção
- Backup automático
- Logs de auditoria

## 10. Performance e Otimização

### 10.1 Carregamento
- Lazy loading de módulos
- Preload de dados críticos
- Caching estratégico
- Compressão de assets
- Minificação de código

### 10.2 Renderização
- Virtual scrolling para listas grandes
- Debounce em inputs de busca
- Throttling em eventos de scroll
- Otimização de imagens
- Code splitting

### 10.3 Rede
- Interceptação de requisições
- Retry em falhas de rede
- Cache de requisições
- Compressão de payload
- Batch de requisições

## 11. Acessibilidade

### 11.1 Navegação
- Suporte a teclado
- Skip links
- Landmarks ARIA
- Focus management
- Breadcrumbs

### 11.2 Visual
- Contraste adequado
- Tamanho de fonte ajustável
- Ícones com labels
- Estados focados visíveis
- Temas de alto contraste

### 11.3 Assistiva
- Screen reader friendly
- Descrições alternativas
- Mensagens de erro claras
- Formulários semânticos
- Tabelas acessíveis

## 12. Transações

### 12.1 Lista de Transações
##### Requisitos Funcionais
1. **Visualização**
   - Listar todas as transações com paginação
   - Filtrar por período, categoria, conta e tipo
   - Permitir ordenação por qualquer coluna
   - Seleção múltipla para operações em lote
   - Indicador visual de tipo de transação (receita/despesa)
   - Formatação de valores em moeda local (BRL)

2. **Ações**
   - Adicionar nova transação
   - Importar transações via arquivo
   - Exportar orçamento para Excel
   - Editar transação existente
   - Excluir transação(ões)
   - Categorizar transações em lote

3. **Exportação para Excel**
   - Exportação do orçamento mensal
   - Categorias organizadas com totalizadores
   - Valores planejados vs realizados
   - Formatação condicional para status
   - Primeira coluna congelada para melhor visualização
   - Agrupamento por mês com espaçamento
   - Suporte a transações sem categoria

4. **Importação de Transações**
   - Suporte a arquivos CSV
   - Mapeamento automático de colunas
   - Validação de formato e dados
   - Categorização automática baseada em regras
   - Detecção de transações duplicadas
   - Preview antes da importação
   - Feedback visual do progresso

##### Interface do Usuário
1. **Tabela Principal**
   - Checkbox para seleção múltipla
   - Colunas: Data, Descrição, Valor, Categoria, Conta, Ações
   - Ordenação por qualquer coluna
   - Paginação com opções de itens por página
   - Filtro global de busca

2. **Barra de Ações**
   - Botão "Nova Transação"
   - Botão "Importar"
   - Botão "Exportar Excel"
   - Ações em lote para itens selecionados

3. **Formulário de Transação**
   - Campos: Data, Descrição, Valor, Tipo, Categoria, Conta
   - Validação em tempo real
   - Autocompletar para categorias
   - Sugestão automática baseada em descrição

##### Feedback Visual
- Preview de transações afetadas
- Highlight de matches em tempo real
- Indicadores de sucesso/erro
- Contadores de aplicação
- Loading states

### 2.4 Categorias (/categories)

#### 2.4.1 Lista de Categorias
##### Requisitos Funcionais
1. **Visualização**
   - Lista hierárquica de categorias
   - Filtros por tipo (receita/despesa)
   - Ordenação personalizada
   - Indicadores visuais de uso
   - Status de automação

2. **Gerenciamento**
   - Criar categoria/subcategoria
   - Editar categoria existente
   - Desativar/reativar categoria
   - Mesclar categorias
   - Reorganizar hierarquia

3. **Automação**
   - Regras de categorização automática
   - Aprendizado com histórico
   - Sugestões inteligentes
   - Validação de regras

##### Interface do Usuário
1. **Árvore de Categorias**
   - Estrutura expansível
   - Drag-and-drop para reorganização
   - Ícones personalizados
   - Indicadores de valor planejado/realizado
   - Status de automação

2. **Barra de Ações**
   - Nova Categoria
   - Importar/Exportar
   - Gerenciar Automação
   - Análise de Uso

3. **Painel de Detalhes**
   - Estatísticas de uso
   - Transações vinculadas
   - Histórico de alterações
   - Regras associadas

#### 2.4.2 Formulário de Categoria
##### Campos
1. **Informações Básicas**
   - Nome
   - Tipo (Receita/Despesa)
   - Categoria pai
   - Ícone personalizado
   - Cor identificadora

2. **Configurações**
   - Valor planejado mensal
   - Limite de gastos
   - Alertas personalizados
   - Regras de automação

3. **Integrações**
   - Mapeamentos automáticos
   - Sincronização com metas
   - Tags para relatórios
   - Notificações

##### Validações
1. **Campos Obrigatórios**
   - Nome único por tipo
   - Tipo de categoria
   - Hierarquia válida

2. **Regras de Negócio**
   - Evitar loops hierárquicos
   - Validar valores planejados
   - Verificar dependências
   - Consistência de automação

#### 2.4.3 Automação
##### Configurações
1. **Regras de Categorização**
   - Padrões de texto
   - Valores típicos
   - Frequência
   - Prioridade

2. **Aprendizado**
   - Base histórica
   - Confirmação de sugestões
   - Ajuste de precisão
   - Feedback de erros

3. **Monitoramento**
   - Taxa de acerto
   - Logs de categorização
   - Ajustes necessários
   - Performance

##### Interface
1. **Editor de Regras**
   - Construtor visual
   - Testes em tempo real
   - Importação em lote
   - Templates predefinidos

2. **Dashboard de Automação**
   - Métricas de eficiência
   - Alertas de problemas
   - Sugestões de melhoria
   - Histórico de alterações

### 2.5 Bancos e Contas (/banks)

#### 2.5.1 Lista de Bancos
##### Requisitos Funcionais
1. **Visualização**
   - Lista de bancos cadastrados
   - Contas associadas
   - Saldo consolidado
   - Status de integração
   - Última sincronização

2. **Gerenciamento**
   - Adicionar novo banco
   - Configurar integração
   - Gerenciar conexões
   - Sincronização manual

3. **Segurança**
   - Autenticação dois fatores
   - Tokens de acesso
   - Logs de atividade
   - Backup de dados

##### Interface do Usuário
1. **Lista Principal**
   - Logo do banco
   - Número de contas
   - Status de conexão
   - Saldo total
   - Ações disponíveis

2. **Painel de Controle**
   - Status de serviços
   - Agenda de sincronização
   - Alertas de segurança
   - Configurações

#### 2.5.2 Contas Bancárias
##### Funcionalidades
1. **Gerenciamento**
   - Criar nova conta
   - Vincular ao banco
   - Definir limites
   - Configurar alertas

2. **Monitoramento**
   - Saldo atual
   - Extrato em tempo real
   - Conciliação automática
   - Alertas de movimentação

3. **Automação**
   - Sincronização automática
   - Categorização de transações
   - Regras de importação
   - Notificações
```
### 2.5 Mapeamento de Descrições (/description-mappings)

#### 2.5.1 Lista de Mapeamentos
##### Requisitos Funcionais
1. **Gerenciamento de Regras**
   - Criação de regras com expressões regulares
   - Aplicação automática em novas transações
   - Priorização de regras
   - Testes de regras em tempo real
   - Histórico de aplicações

2. **Visualização**
   - Lista de mapeamentos com filtros avançados
   - Editor de expressões regulares com preview
   - Indicador visual de regras ativas/inativas
   - Status de última aplicação
   - Contador de transações afetadas

3. **Ações**
   - Criar novo mapeamento
   - Editar mapeamento existente
   - Aplicar mapeamentos selecionados
   - Ativar/desativar regras
   - Duplicar regras existentes
   - Exportar/importar regras

##### Interface do Usuário
1. **Tabela Principal**
   - Padrão de expressão regular
   - Categoria alvo
   - Status (ativo/inativo)
   - Data da última aplicação
   - Quantidade de transações afetadas
   - Ações disponíveis

2. **Barra de Ações**
   - Botão "Novo Mapeamento"
   - Botão "Aplicar Selecionados"
   - Botão "Ajuda" com guia de regex
   - Opções de importação/exportação

3. **Editor de Regras**
   - Campo de teste com highlight
   - Validação em tempo real
   - Sugestões de padrões comuns
   - Visualização de matches

##### Feedback Visual
- Preview de transações afetadas
- Highlight de matches em tempo real
- Indicadores de sucesso/erro
- Contadores de aplicação
- Loading states

### 2.6 Metas Financeiras (/financial-goals)

#### 2.6.1 Lista de Metas
##### Requisitos Funcionais
1. **Definição de Metas**
   - Metas de economia
   - Metas de investimento
   - Metas de redução de gastos
   - Metas recorrentes
   - Metas compostas

2. **Acompanhamento**
   - Progresso visual (gráficos)
   - Projeções de atingimento
   - Alertas de desvios
   - Sugestões de ajuste
   - Histórico de progresso

3. **Categorização**
   - Metas por categoria
   - Metas por conta
   - Metas por período
   - Metas compostas
   - Tags personalizadas

##### Interface do Usuário
1. **Dashboard de Metas**
   - Cards de progresso
   - Gráficos de evolução
   - Indicadores de status
   - Ações rápidas
   - Filtros de visualização

2. **Formulário de Meta**
   - Tipo de meta
   - Valor objetivo
   - Data limite
   - Categorias associadas
   - Estratégia de economia
   - Notificações

3. **Análise e Insights**
   - Sugestões personalizadas
   - Comparativo com metas similares
   - Projeções baseadas em histórico
   - Alertas inteligentes

##### Integrações
1. **Dashboard Principal**
   - Widgets de metas
   - Alertas de progresso
   - Resumo consolidado

2. **Transações**
   - Vinculação automática
   - Tracking de progresso
   - Categorização inteligente

3. **Relatórios**
   - Análise de atingimento
   - Histórico de progresso
   - Exportação de dados

### 2.7 Relatórios e Análises (/reports)

#### 2.7.1 Relatórios Personalizados
##### Funcionalidades
1. **Tipos de Relatório**
   - Fluxo de caixa detalhado
   - Análise de tendências
   - Comparativos períodos
   - Projeções financeiras
   - Análise de categorias

2. **Visualizações**
   - Gráficos interativos
   - Dashboards customizáveis
   - Tabelas dinâmicas
   - Exportação em múltiplos formatos
   - Templates personalizados

3. **Insights Automáticos**
   - Detecção de padrões de gasto
   - Sugestões de economia
   - Alertas de anomalias
   - Recomendações personalizadas
   - Análise preditiva

##### Interface do Usuário
1. **Gerador de Relatórios**
   - Seleção de período
   - Escolha de métricas
   - Filtros avançados
   - Preview em tempo real
   - Opções de exportação

2. **Dashboard Analítico**
   - KPIs personalizáveis
   - Gráficos interativos
   - Drill-down de dados
   - Compartilhamento
   - Agendamento

3. **Centro de Insights**
   - Feed de recomendações
   - Alertas importantes
   - Dicas personalizadas
   - Histórico de análises

```
### 2.5 Mapeamento de Descrições (/description-mappings)

#### 2.5.1 Lista de Mapeamentos
##### Requisitos Funcionais
1. **Gerenciamento de Regras**
   - Criação de regras com expressões regulares
   - Aplicação automática em novas transações
   - Priorização de regras
   - Testes de regras em tempo real
   - Histórico de aplicações

2. **Visualização**
   - Lista de mapeamentos com filtros avançados
   - Editor de expressões regulares com preview
   - Indicador visual de regras ativas/inativas
   - Status de última aplicação
   - Contador de transações afetadas

3. **Ações**
   - Criar novo mapeamento
   - Editar mapeamento existente
   - Aplicar mapeamentos selecionados
   - Ativar/desativar regras
   - Duplicar regras existentes
   - Exportar/importar regras

##### Interface do Usuário
1. **Tabela Principal**
   - Padrão de expressão regular
   - Categoria alvo
   - Status (ativo/inativo)
   - Data da última aplicação
   - Quantidade de transações afetadas
   - Ações disponíveis

2. **Barra de Ações**
   - Botão "Novo Mapeamento"
   - Botão "Aplicar Selecionados"
   - Botão "Ajuda" com guia de regex
   - Opções de importação/exportação

3. **Editor de Regras**
   - Campo de teste com highlight
   - Validação em tempo real
   - Sugestões de padrões comuns
   - Visualização de matches

##### Feedback Visual
- Preview de transações afetadas
- Highlight de matches em tempo real
- Indicadores de sucesso/erro
- Contadores de aplicação
- Loading states

### 2.6 Metas Financeiras (/financial-goals)

#### 2.6.1 Lista de Metas
##### Requisitos Funcionais
1. **Definição de Metas**
   - Metas de economia
   - Metas de investimento
   - Metas de redução de gastos
   - Metas recorrentes
   - Metas compostas

2. **Acompanhamento**
   - Progresso visual (gráficos)
   - Projeções de atingimento
   - Alertas de desvios
   - Sugestões de ajuste
   - Histórico de progresso

3. **Categorização**
   - Metas por categoria
   - Metas por conta
   - Metas por período
   - Metas compostas
   - Tags personalizadas

##### Interface do Usuário
1. **Dashboard de Metas**
   - Cards de progresso
   - Gráficos de evolução
   - Indicadores de status
   - Ações rápidas
   - Filtros de visualização

2. **Formulário de Meta**
   - Tipo de meta
   - Valor objetivo
   - Data limite
   - Categorias associadas
   - Estratégia de economia
   - Notificações

3. **Análise e Insights**
   - Sugestões personalizadas
   - Comparativo com metas similares
   - Projeções baseadas em histórico
   - Alertas inteligentes

##### Integrações
1. **Dashboard Principal**
   - Widgets de metas
   - Alertas de progresso
   - Resumo consolidado

2. **Transações**
   - Vinculação automática
   - Tracking de progresso
   - Categorização inteligente

3. **Relatórios**
   - Análise de atingimento
   - Histórico de progresso
   - Exportação de dados

### 2.7 Relatórios e Análises (/reports)

#### 2.7.1 Relatórios Personalizados
##### Funcionalidades
1. **Tipos de Relatório**
   - Fluxo de caixa detalhado
   - Análise de tendências
   - Comparativos períodos
   - Projeções financeiras
   - Análise de categorias

2. **Visualizações**
   - Gráficos interativos
   - Dashboards customizáveis
   - Tabelas dinâmicas
   - Exportação em múltiplos formatos
   - Templates personalizados

3. **Insights Automáticos**
   - Detecção de padrões de gasto
   - Sugestões de economia
   - Alertas de anomalias
   - Recomendações personalizadas
   - Análise preditiva

##### Interface do Usuário
1. **Gerador de Relatórios**
   - Seleção de período
   - Escolha de métricas
   - Filtros avançados
   - Preview em tempo real
   - Opções de exportação

2. **Dashboard Analítico**
   - KPIs personalizáveis
   - Gráficos interativos
   - Drill-down de dados
   - Compartilhamento
   - Agendamento

3. **Centro de Insights**
   - Feed de recomendações
   - Alertas importantes
   - Dicas personalizadas
   - Histórico de análises

```
### 2.5 Mapeamento de Descrições (/description-mappings)

#### 2.5.1 Lista de Mapeamentos
##### Requisitos Funcionais
1. **Gerenciamento de Regras**
   - Criação de regras com expressões regulares
   - Aplicação automática em novas transações
   - Priorização de regras
   - Testes de regras em tempo real
   - Histórico de aplicações

2. **Visualização**
   - Lista de mapeamentos com filtros avançados
   - Editor de expressões regulares com preview
   - Indicador visual de regras ativas/inativas
   - Status de última aplicação
   - Contador de transações afetadas

3. **Ações**
   - Criar novo mapeamento
   - Editar mapeamento existente
   - Aplicar mapeamentos selecionados
   - Ativar/desativar regras
   - Duplicar regras existentes
   - Exportar/importar regras

##### Interface do Usuário
1. **Tabela Principal**
   - Padrão de expressão regular
   - Categoria alvo
   - Status (ativo/inativo)
   - Data da última aplicação
   - Quantidade de transações afetadas
   - Ações disponíveis

2. **Barra de Ações**
   - Botão "Novo Mapeamento"
   - Botão "Aplicar Selecionados"
   - Botão "Ajuda" com guia de regex
   - Opções de importação/exportação

3. **Editor de Regras**
   - Campo de teste com highlight
   - Validação em tempo real
   - Sugestões de padrões comuns
   - Visualização de matches

##### Feedback Visual
- Preview de transações afetadas
- Highlight de matches em tempo real
- Indicadores de sucesso/erro
- Contadores de aplicação
- Loading states

### 2.6 Metas Financeiras (/financial-goals)

#### 2.6.1 Lista de Metas
##### Requisitos Funcionais
1. **Definição de Metas**
   - Metas de economia
   - Metas de investimento
   - Metas de redução de gastos
   - Metas recorrentes
   - Metas compostas

2. **Acompanhamento**
   - Progresso visual (gráficos)
   - Projeções de atingimento
   - Alertas de desvios
   - Sugestões de ajuste
   - Histórico de progresso

3. **Categorização**
   - Metas por categoria
   - Metas por conta
   - Metas por período
   - Metas compostas
   - Tags personalizadas

##### Interface do Usuário
1. **Dashboard de Metas**
   - Cards de progresso
   - Gráficos de evolução
   - Indicadores de status
   - Ações rápidas
   - Filtros de visualização

2. **Formulário de Meta**
   - Tipo de meta
   - Valor objetivo
   - Data limite
   - Categorias associadas
   - Estratégia de economia
   - Notificações

3. **Análise e Insights**
   - Sugestões personalizadas
   - Comparativo com metas similares
   - Projeções baseadas em histórico
   - Alertas inteligentes

##### Integrações
1. **Dashboard Principal**
   - Widgets de metas
   - Alertas de progresso
   - Resumo consolidado

2. **Transações**
   - Vinculação automática
   - Tracking de progresso
   - Categorização inteligente

3. **Relatórios**
   - Análise de atingimento
   - Histórico de progresso
   - Exportação de dados

### 2.7 Relatórios e Análises (/reports)

#### 2.7.1 Relatórios Personalizados
##### Funcionalidades
1. **Tipos de Relatório**
   - Fluxo de caixa detalhado
   - Análise de tendências
   - Comparativos períodos
   - Projeções financeiras
   - Análise de categorias

2. **Visualizações**
   - Gráficos interativos
   - Dashboards customizáveis
   - Tabelas dinâmicas
   - Exportação em múltiplos formatos
   - Templates personalizados

3. **Insights Automáticos**
   - Detecção de padrões de gasto
   - Sugestões de economia
   - Alertas de anomalias
   - Recomendações personalizadas
   - Análise preditiva

##### Interface do Usuário
1. **Gerador de Relatórios**
   - Seleção de período
   - Escolha de métricas
   - Filtros avançados
   - Preview em tempo real
   - Opções de exportação

2. **Dashboard Analítico**
   - KPIs personalizáveis
   - Gráficos interativos
   - Drill-down de dados
   - Compartilhamento
   - Agendamento

3. **Centro de Insights**
   - Feed de recomendações
   - Alertas importantes
   - Dicas personalizadas
   - Histórico de análises

```
### 2.4 Categorias (/categories)

#### 2.4.1 Lista de Categorias
##### Requisitos Funcionais
1. **Visualização**
   - Lista hierárquica de categorias
   - Filtros por tipo (receita/despesa)
   - Ordenação personalizada
   - Indicadores visuais de uso
   - Status de automação

2. **Gerenciamento**
   - Criar categoria/subcategoria
   - Editar categoria existente
   - Desativar/reativar categoria
   - Mesclar categorias
   - Reorganizar hierarquia

3. **Automação**
   - Regras de categorização automática
   - Aprendizado com histórico
   - Sugestões inteligentes
   - Validação de regras

##### Interface do Usuário
1. **Árvore de Categorias**
   - Estrutura expansível
   - Drag-and-drop para reorganização
   - Ícones personalizados
   - Indicadores de valor planejado/realizado
   - Status de automação

2. **Barra de Ações**
   - Nova Categoria
   - Importar/Exportar
   - Gerenciar Automação
   - Análise de Uso

3. **Painel de Detalhes**
   - Estatísticas de uso
   - Transações vinculadas
   - Histórico de alterações
   - Regras associadas

#### 2.4.2 Formulário de Categoria
##### Campos
1. **Informações Básicas**
   - Nome
   - Tipo (Receita/Despesa)
   - Categoria pai
   - Ícone personalizado
   - Cor identificadora

2. **Configurações**
   - Valor planejado mensal
   - Limite de gastos
   - Alertas personalizados
   - Regras de automação

3. **Integrações**
   - Mapeamentos automáticos
   - Sincronização com metas
   - Tags para relatórios
   - Notificações

##### Validações
1. **Campos Obrigatórios**
   - Nome único por tipo
   - Tipo de categoria
   - Hierarquia válida

2. **Regras de Negócio**
   - Evitar loops hierárquicos
   - Validar valores planejados
   - Verificar dependências
   - Consistência de automação

#### 2.4.3 Automação
##### Configurações
1. **Regras de Categorização**
   - Padrões de texto
   - Valores típicos
   - Frequência
   - Prioridade

2. **Aprendizado**
   - Base histórica
   - Confirmação de sugestões
   - Ajuste de precisão
   - Feedback de erros

3. **Monitoramento**
   - Taxa de acerto
   - Logs de categorização
   - Ajustes necessários
   - Performance

##### Interface
1. **Editor de Regras**
   - Construtor visual
   - Testes em tempo real
   - Importação em lote
   - Templates predefinidos

2. **Dashboard de Automação**
   - Métricas de eficiência
   - Alertas de problemas
   - Sugestões de melhoria
   - Histórico de alterações

### 2.5 Bancos e Contas (/banks)

#### 2.5.1 Lista de Bancos
##### Requisitos Funcionais
1. **Visualização**
   - Lista de bancos cadastrados
   - Contas associadas
   - Saldo consolidado
   - Status de integração
   - Última sincronização

2. **Gerenciamento**
   - Adicionar novo banco
   - Configurar integração
   - Gerenciar conexões
   - Sincronização manual

3. **Segurança**
   - Autenticação dois fatores
   - Tokens de acesso
   - Logs de atividade
   - Backup de dados

##### Interface do Usuário
1. **Lista Principal**
   - Logo do banco
   - Número de contas
   - Status de conexão
   - Saldo total
   - Ações disponíveis

2. **Painel de Controle**
   - Status de serviços
   - Agenda de sincronização
   - Alertas de segurança
   - Configurações

#### 2.5.2 Contas Bancárias
##### Funcionalidades
1. **Gerenciamento**
   - Criar nova conta
   - Vincular ao banco
   - Definir limites
   - Configurar alertas

2. **Monitoramento**
   - Saldo atual
   - Extrato em tempo real
   - Conciliação automática
   - Alertas de movimentação

3. **Automação**
   - Sincronização automática
   - Categorização de transações
   - Regras de importação
   - Notificações
```
### 2.5 Mapeamento de Descrições (/description-mappings)

#### 2.5.1 Lista de Mapeamentos
##### Requisitos Funcionais
1. **Gerenciamento de Regras**
   - Criação de regras com expressões regulares
   - Aplicação automática em novas transações
   - Priorização de regras
   - Testes de regras em tempo real
   - Histórico de aplicações

2. **Visualização**
   - Lista de mapeamentos com filtros avançados
   - Editor de expressões regulares com preview
   - Indicador visual de regras ativas/inativas
   - Status de última aplicação
   - Contador de transações afetadas

3. **Ações**
   - Criar novo mapeamento
   - Editar mapeamento existente
   - Aplicar mapeamentos selecionados
   - Ativar/desativar regras
   - Duplicar regras existentes
   - Exportar/importar regras

##### Interface do Usuário
1. **Tabela Principal**
   - Padrão de expressão regular
   - Categoria alvo
   - Status (ativo/inativo)
   - Data da última aplicação
   - Quantidade de transações afetadas
   - Ações disponíveis

2. **Barra de Ações**
   - Botão "Novo Mapeamento"
   - Botão "Aplicar Selecionados"
   - Botão "Ajuda" com guia de regex
   - Opções de importação/exportação

3. **Editor de Regras**
   - Campo de teste com highlight
   - Validação em tempo real
   - Sugestões de padrões comuns
   - Visualização de matches

##### Feedback Visual
- Preview de transações afetadas
- Highlight de matches em tempo real
- Indicadores de sucesso/erro
- Contadores de aplicação
- Loading states

### 2.6 Metas Financeiras (/financial-goals)

#### 2.6.1 Lista de Metas
##### Requisitos Funcionais
1. **Definição de Metas**
   - Metas de economia
   - Metas de investimento
   - Metas de redução de gastos
   - Metas recorrentes
   - Metas compostas

2. **Acompanhamento**
   - Progresso visual (gráficos)
   - Projeções de atingimento
   - Alertas de desvios
   - Sugestões de ajuste
   - Histórico de progresso

3. **Categorização**
   - Metas por categoria
   - Metas por conta
   - Metas por período
   - Metas compostas
   - Tags personalizadas

##### Interface do Usuário
1. **Dashboard de Metas**
   - Cards de progresso
   - Gráficos de evolução
   - Indicadores de status
   - Ações rápidas
   - Filtros de visualização

2. **Formulário de Meta**
   - Tipo de meta
   - Valor objetivo
   - Data limite
   - Categorias associadas
   - Estratégia de economia
   - Notificações

3. **Análise e Insights**
   - Sugestões personalizadas
   - Comparativo com metas similares
   - Projeções baseadas em histórico
   - Alertas inteligentes

##### Integrações
1. **Dashboard Principal**
   - Widgets de metas
   - Alertas de progresso
   - Resumo consolidado

2. **Transações**
   - Vinculação automática
   - Tracking de progresso
   - Categorização inteligente

3. **Relatórios**
   - Análise de atingimento
   - Histórico de progresso
   - Exportação de dados

### 2.7 Relatórios e Análises (/reports)

#### 2.7.1 Relatórios Personalizados
##### Funcionalidades
1. **Tipos de Relatório**
   - Fluxo de caixa detalhado
   - Análise de tendências
   - Comparativos períodos
   - Projeções financeiras
   - Análise de categorias

2. **Visualizações**
   - Gráficos interativos
   - Dashboards customizáveis
   - Tabelas dinâmicas
   - Exportação em múltiplos formatos
   - Templates personalizados

3. **Insights Automáticos**
   - Detecção de padrões de gasto
   - Sugestões de economia
   - Alertas de anomalias
   - Recomendações personalizadas
   - Análise preditiva

##### Interface do Usuário
1. **Gerador de Relatórios**
   - Seleção de período
   - Escolha de métricas
   - Filtros avançados
   - Preview em tempo real
   - Opções de exportação

2. **Dashboard Analítico**
   - KPIs personalizáveis
   - Gráficos interativos
   - Drill-down de dados
   - Compartilhamento
   - Agendamento

3. **Centro de Insights**
   - Feed de recomendações
   - Alertas importantes
   - Dicas personalizadas
   - Histórico de análises
