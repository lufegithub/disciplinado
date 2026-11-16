# Disciplinado

Aplicação web em Node.js para organizar tarefas acadêmicas. Permite cadastrar, listar, consultar, editar, concluir, excluir e filtrar tarefas, seguindo o padrão **MVC** (Model, View, Controller).

Os dados ficam armazenados **em memória**, em um array de objetos. Não há banco de dados: ao reiniciar o servidor, as tarefas cadastradas são perdidas.

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

## Como executar

1. Clone o repositório e instale as dependências:

   ```bash
   git clone <url-do-repositorio>
   cd disciplinado
   npm install
   ```

2. Crie o arquivo `.env` a partir do exemplo (opcional, a porta padrão é 3000):

   ```bash
   cp .env.example .env
   ```

3. Inicie a aplicação:

   ```bash
   npm run dev
   ```

   O `dev` reinicia sozinho a cada alteração no código. Para rodar sem isso, use `npm start`.

4. Acesse http://localhost:3000

## Variáveis de ambiente

| Variável | Padrão | Descrição |
|---|---|---|
| `PORT` | `3000` | Porta em que o servidor escuta |

O arquivo `.env` é lido pelo próprio Node (opção `--env-file-if-exists`), sem precisar de bibliotecas extras. Ele não é versionado; o `.env.example` serve de modelo.

## Estrutura do projeto

```
disciplinado/
├── app.js                         # Configura o Express e inicia o servidor
├── routes/
│   └── tarefaRoutes.js            # Liga cada URL a uma função do controller
├── controllers/
│   └── tarefaController.js        # Recebe a requisição, chama o model e escolhe a view
├── models/
│   └── tarefaModel.js             # Array em memória, validação e operações dos dados
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

- **Model** (`models/tarefaModel.js`): é a única parte que acessa o array de tarefas. Gera o `id`, valida os campos e executa as operações de criar, listar, buscar, editar, concluir e excluir. Não sabe nada sobre HTTP nem sobre HTML.
- **View** (`views/*.ejs`): só apresenta os dados que recebe do controller. Não acessa o array nem aplica regras.
- **Controller** (`controllers/tarefaController.js`): faz a ponte entre os dois. Lê os dados da requisição (`req.params`, `req.query`, `req.body`), chama o model e decide qual view renderizar ou para onde redirecionar.

Fluxo de uma requisição, usando o cadastro como exemplo:

```
Navegador ── POST /tarefas ──> Rota ──> Controller.criar
                                              │
                                              ▼
                                     Model.criar(dados)
                                     ├─ inválido → devolve os erros
                                     │     Controller renderiza form.ejs com os erros
                                     └─ válido → adiciona no array
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
