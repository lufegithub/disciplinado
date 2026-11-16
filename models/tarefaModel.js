const db = require('../db/mysql');

function validar({ titulo, descricao, disciplina }) {
  const erros = [];

  if (titulo.length < 3 || titulo.length > 100) {
    erros.push('O título deve ter entre 3 e 100 caracteres.');
  }
  if (descricao.length > 500) {
    erros.push('A descrição deve ter no máximo 500 caracteres.');
  }
  if (disciplina.length < 2 || disciplina.length > 80) {
    erros.push('A disciplina deve ter entre 2 e 80 caracteres.');
  }

  return erros;
}

function limpar(dados) {
  return {
    titulo: (dados.titulo || '').trim(),
    descricao: (dados.descricao || '').trim(),
    disciplina: (dados.disciplina || '').trim()
  };
}

function idValido(id) {
  const numero = Number(id);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

async function listar(filtro) {
  if (filtro === 'pendente' || filtro === 'concluida') return db.listar(filtro);
  return db.listar();
}

async function buscarPorId(id) {
  const numero = idValido(id);
  return numero ? db.buscarPorId(numero) : null;
}

async function criar(dados) {
  const campos = limpar(dados);
  const erros = validar(campos);
  if (erros.length) return { erros, dados: campos };

  const tarefa = await db.inserir(campos);
  return { tarefa };
}

async function editar(id, dados) {
  const tarefa = await buscarPorId(id);
  if (!tarefa) return { erros: ['Tarefa não encontrada.'] };

  const campos = limpar(dados);
  const erros = validar(campos);
  if (erros.length) return { erros, dados: { ...tarefa, ...campos } };

  return { tarefa: await db.atualizar(tarefa.id, campos) };
}

async function concluir(id) {
  const numero = idValido(id);
  return numero ? db.atualizar(numero, { status: 'concluida' }) : null;
}

async function excluir(id) {
  const numero = idValido(id);
  return numero ? db.remover(numero) : false;
}

module.exports = { listar, buscarPorId, criar, editar, concluir, excluir };
