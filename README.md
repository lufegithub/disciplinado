# Disciplinado

Aplicação web em Node.js para organizar tarefas acadêmicas. Permite cadastrar, listar, consultar, editar, concluir, excluir e filtrar tarefas, seguindo o padrão **MVC** (Model, View, Controller).

Os dados ficam guardados em um banco **MySQL**, que é obrigatório: a aplicação não guarda nada em memória e só inicia se conseguir se conectar ao banco.

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| Cadastrar | Insere uma tarefa com título, descrição e disciplina |
| Listar | Mostra as tarefas cadastradas e seus status |
| Consultar detalhes | Exibe todas as informações de uma tarefa |
| Editar | Altera título, descrição e disciplina |
| Concluir | Muda o status de pendente para concluída |
| Excluir | Remove uma tarefa após confirmação |
| Filtrar | Mostra todas as tarefas, só as pendentes ou só as concluídas |

## Dados de uma tarefa

| Campo | Regra |
|---|---|
| `id` | Gerado pela aplicação (número sequencial) |
| `titulo` | Obrigatório, entre 3 e 100 caracteres |
| `descricao` | Opcional, até 500 caracteres |
| `disciplina` | Obrigatório, entre 2 e 80 caracteres |
| `status` | `pendente` ou `concluida`; começa como `pendente` |

Quando algum campo não segue a regra, o formulário é exibido novamente com as mensagens de erro e com os valores que já tinham sido digitados.

## Tecnologias

- [Node.js](https://nodejs.org/) 22.9 ou superior
- [Express](https://expressjs.com/) 5, servidor web e rotas
- [EJS](https://ejs.co/), templates das views
- [mysql2](https://github.com/sidorares/node-mysql2), driver do MySQL (opcional)

## Como executar

Antes de começar, tenha o [MySQL](https://dev.mysql.com/downloads/) instalado e rodando. Sem ele a aplicação não inicia.

1. Clone o repositório e instale as dependências:

   ```bash
   git clone <url-do-repositorio>
   cd disciplinado
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo:

   ```bash
   cp .env.example .env
   ```

   Abra o `.env` e preencha os dados de acesso ao MySQL (`DB_USER`, `DB_PASSWORD` etc.).

3. Crie o banco de dados e a tabela:

   ```bash
   npm run db:criar
   ```

   Só precisa rodar na primeira vez. O comando cria o banco com o nome de `DB_NAME` e a tabela `tarefas`; se rodar de novo, nada é apagado.

4. Inicie a aplicação:

   ```bash
   npm run dev
   ```

   O `dev` reinicia sozinho a cada alteração no código. Para rodar sem isso, use `npm start`.

5. Acesse http://localhost:3000

Se o MySQL não estiver acessível ou o banco ainda não tiver sido criado, a aplicação não sobe e mostra no terminal o que conferir (por exemplo, pedindo para rodar `npm run db:criar`).

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta em que o servidor escuta |
| `DB_HOST` | `localhost` | Endereço do MySQL |
| `DB_PORT` | `3306` | Porta do MySQL |
| `DB_USER` | `root` | Usuário do MySQL |
| `DB_PASSWORD` | (vazio) | Senha do MySQL |
| `DB_NAME` | `disciplinado` | Nome do banco |

O arquivo `.env` é lido pelo próprio Node (opção `--env-file-if-exists`), sem precisar de bibliotecas extras. Ele não é versionado; o `.env.example` serve de modelo.

## Estrutura do projeto

```
disciplinado/
├── app.js                         # Configura o Express, confere o MySQL e inicia o servidor
├── routes/
│   └── tarefaRoutes.js            # Liga cada URL a uma função do controller
├── controllers/
│   └── tarefaController.js        # Recebe a requisição, chama o model e escolhe a view
├── models/
│   └── tarefaModel.js             # Validação e regras das tarefas
├── db/
│   ├── mysql.js                   # Conexão e consultas ao MySQL
│   ├── schema.sql                 # Estrutura da tabela tarefas
│   └── criar-banco.js             # Usado por npm run db:criar
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs             # Inclui o aviso (toast) depois das ações
│   │   └── icone.ejs              # Ícones SVG
│   ├── index.ejs                  # Lista com filtros
│   ├── form.ejs                   # Formulário de cadastro e edição
│   ├── detalhes.ejs               # Detalhes de uma tarefa
│   ├── excluir.ejs                # Confirmação de exclusão
│   └── 404.ejs                    # Tarefa não encontrada
└── public/
    └── style.css
```

## Como o MVC funciona aqui

- **Model** (`models/tarefaModel.js`): valida os campos e executa as operações de criar, listar, buscar, editar, concluir e excluir. Não sabe nada sobre HTTP nem sobre HTML, e também não escreve SQL: ele chama `db/mysql.js`, que faz as consultas ao banco.
- **View** (`views/*.ejs`): só apresenta os dados que recebe do controller. Não acessa o banco nem aplica regras.
- **Controller** (`controllers/tarefaController.js`): faz a ponte entre os dois. Lê os dados da requisição (`req.params`, `req.query`, `req.body`), chama o model e decide qual view renderizar ou para onde redirecionar.

Fluxo de uma requisição, usando o cadastro como exemplo:

```
Navegador ── POST /tarefas ──> Rota ──> Controller.criar
                                              │
                                              ▼
                                     Model.criar(dados)
                                     ├─ inválido → devolve os erros
                                     │     Controller renderiza form.ejs com os erros
                                     └─ válido → insere no MySQL
                                           Controller redireciona para /
```

## Rotas

| Método | Rota | Ação |
|---|---|---|
| GET | `/` | Lista as tarefas (aceita `?status=todas`, `pendente` ou `concluida`) |
| GET | `/tarefas/nova` | Formulário de cadastro |
| POST | `/tarefas` | Cadastra uma tarefa |
| GET | `/tarefas/:id` | Detalhes de uma tarefa |
| GET | `/tarefas/:id/editar` | Formulário de edição |
| POST | `/tarefas/:id/editar` | Salva a edição |
| POST | `/tarefas/:id/concluir` | Marca a tarefa como concluída |
| GET | `/tarefas/:id/excluir` | Página de confirmação da exclusão |
| POST | `/tarefas/:id/excluir` | Exclui a tarefa |

Formulários HTML só enviam requisições GET e POST, por isso editar, concluir e excluir usam POST.
