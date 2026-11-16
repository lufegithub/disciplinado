const express = require('express');
const tarefaRoutes = require('./routes/tarefaRoutes');
const db = require('./db/mysql');

const app = express();
const PORT = process.env.PORT || 3000;

const AVISOS = {
  criada: { texto: 'Tarefa criada com sucesso!', tipo: 'sucesso', icone: 'check' },
  editada: { texto: 'Alterações salvas.', tipo: 'sucesso', icone: 'check' },
  concluida: { texto: 'Tarefa concluída! Bom trabalho.', tipo: 'sucesso', icone: 'check' },
  excluida: { texto: 'Tarefa excluída.', tipo: 'info', icone: 'lixeira' }
};

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use((req, res, next) => {
  res.locals.aviso = AVISOS[req.query.msg] || null;
  next();
});

app.use('/', tarefaRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Erro interno no servidor. Verifique o console.');
});

db.verificarConexao()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Disciplinado rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Não foi possível conectar ao MySQL:', err.message || err.code || err);
    if (err.code === 'ER_BAD_DB_ERROR' || err.code === 'ER_NO_SUCH_TABLE') {
      console.error('O banco ou a tabela não existem. Rode: npm run db:criar');
    } else {
      console.error('Confira se o MySQL está rodando e se DB_HOST, DB_USER e DB_PASSWORD no .env estão certos.');
    }
    process.exit(1);
  });
