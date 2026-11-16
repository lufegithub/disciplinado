const tarefas = [];
let proximoId = 1;

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

function listar(filtro) {
  if (filtro === 'pendente' || filtro === 'concluida') {
    return tarefas.filter(t => t.status === filtro);
  }
  return tarefas;
}

function buscarPorId(id) {
  return tarefas.find(t => t.id === Number(id));
}

function criar(dados) {
  const campos = limpar(dados);
  const erros = validar(campos);
  if (erros.length) return { erros, dados: campos };

  const tarefa = { id: proximoId++, ...campos, status: 'pendente' };
  tarefas.push(tarefa);
  return { tarefa };
}

function editar(id, dados) {
  const tarefa = buscarPorId(id);
  if (!tarefa) return { erros: ['Tarefa não encontrada.'] };

  const campos = limpar(dados);
  const erros = validar(campos);
  if (erros.length) return { erros, dados: { ...tarefa, ...campos } };

  Object.assign(tarefa, campos);
  return { tarefa };
}

function concluir(id) {
  const tarefa = buscarPorId(id);
  if (tarefa) tarefa.status = 'concluida';
  return tarefa;
}

function excluir(id) {
  const indice = tarefas.findIndex(t => t.id === Number(id));
  if (indice === -1) return false;
  tarefas.splice(indice, 1);
  return true;
}

module.exports = { listar, buscarPorId, criar, editar, concluir, excluir };
