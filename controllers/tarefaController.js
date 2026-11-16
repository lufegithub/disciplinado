const Tarefa = require('../models/tarefaModel');

function listar(req, res) {
  const filtro = req.query.status || 'pendente';
  const tarefas = Tarefa.listar(filtro);
  res.render('index', { tarefas, filtro });
}

function formularioNova(req, res) {
  res.render('form', { tarefa: {}, erros: [], acao: '/tarefas' });
}

function criar(req, res) {
  const resultado = Tarefa.criar(req.body);
  if (resultado.erros) {
    return res.render('form', { tarefa: resultado.dados, erros: resultado.erros, acao: '/tarefas' });
  }
  res.redirect('/?msg=criada');
}

function detalhes(req, res) {
  const tarefa = Tarefa.buscarPorId(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.render('detalhes', { tarefa });
}

function formularioEditar(req, res) {
  const tarefa = Tarefa.buscarPorId(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.render('form', { tarefa, erros: [], acao: `/tarefas/${tarefa.id}/editar` });
}

function editar(req, res) {
  const resultado = Tarefa.editar(req.params.id, req.body);
  if (resultado.erros && !resultado.dados) return res.status(404).render('404');
  if (resultado.erros) {
    return res.render('form', {
      tarefa: resultado.dados,
      erros: resultado.erros,
      acao: `/tarefas/${req.params.id}/editar`
    });
  }
  res.redirect(`/tarefas/${req.params.id}?msg=editada`);
}

function concluir(req, res) {
  const tarefa = Tarefa.concluir(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.redirect('/?msg=concluida');
}

function confirmarExclusao(req, res) {
  const tarefa = Tarefa.buscarPorId(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.render('excluir', { tarefa });
}

function excluir(req, res) {
  if (!Tarefa.excluir(req.params.id)) return res.status(404).render('404');
  res.redirect('/?msg=excluida');
}

module.exports = {
  listar,
  formularioNova,
  criar,
  detalhes,
  formularioEditar,
  editar,
  concluir,
  confirmarExclusao,
  excluir
};
