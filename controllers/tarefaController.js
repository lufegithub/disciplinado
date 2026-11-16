const Tarefa = require('../models/tarefaModel');

async function listar(req, res) {
  const filtro = req.query.status || 'pendente';
  const tarefas = await Tarefa.listar(filtro);
  res.render('index', { tarefas, filtro });
}

function formularioNova(req, res) {
  res.render('form', { tarefa: {}, erros: [], acao: '/tarefas' });
}

async function criar(req, res) {
  const resultado = await Tarefa.criar(req.body);
  if (resultado.erros) {
    return res.render('form', { tarefa: resultado.dados, erros: resultado.erros, acao: '/tarefas' });
  }
  res.redirect('/?msg=criada');
}

async function detalhes(req, res) {
  const tarefa = await Tarefa.buscarPorId(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.render('detalhes', { tarefa });
}

async function formularioEditar(req, res) {
  const tarefa = await Tarefa.buscarPorId(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.render('form', { tarefa, erros: [], acao: `/tarefas/${tarefa.id}/editar` });
}

async function editar(req, res) {
  const resultado = await Tarefa.editar(req.params.id, req.body);
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

async function concluir(req, res) {
  const tarefa = await Tarefa.concluir(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.redirect('/?msg=concluida');
}

async function confirmarExclusao(req, res) {
  const tarefa = await Tarefa.buscarPorId(req.params.id);
  if (!tarefa) return res.status(404).render('404');
  res.render('excluir', { tarefa });
}

async function excluir(req, res) {
  if (!(await Tarefa.excluir(req.params.id))) return res.status(404).render('404');
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
