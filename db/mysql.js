const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'disciplinado',
  waitForConnections: true,
  connectionLimit: 10
});

const COLUNAS = 'id, titulo, descricao, disciplina, status';

async function listar(status) {
  if (status) {
    const [linhas] = await pool.query(
      `SELECT ${COLUNAS} FROM tarefas WHERE status = ? ORDER BY id`,
      [status]
    );
    return linhas;
  }
  const [linhas] = await pool.query(`SELECT ${COLUNAS} FROM tarefas ORDER BY id`);
  return linhas;
}

async function buscarPorId(id) {
  const [linhas] = await pool.query(`SELECT ${COLUNAS} FROM tarefas WHERE id = ?`, [id]);
  return linhas[0] || null;
}

async function inserir({ titulo, descricao, disciplina }) {
  const [resultado] = await pool.query(
    'INSERT INTO tarefas (titulo, descricao, disciplina) VALUES (?, ?, ?)',
    [titulo, descricao, disciplina]
  );
  return buscarPorId(resultado.insertId);
}

const PERMITIDAS = ['titulo', 'descricao', 'disciplina', 'status'];

async function atualizar(id, campos) {
  const nomes = Object.keys(campos).filter(c => PERMITIDAS.includes(c));
  if (nomes.length) {
    const sets = nomes.map(c => `${c} = ?`).join(', ');
    const valores = nomes.map(c => campos[c]);
    const [resultado] = await pool.query(`UPDATE tarefas SET ${sets} WHERE id = ?`, [...valores, id]);
    if (resultado.affectedRows === 0) return null;
  }
  return buscarPorId(id);
}

async function remover(id) {
  const [resultado] = await pool.query('DELETE FROM tarefas WHERE id = ?', [id]);
  return resultado.affectedRows > 0;
}

async function verificarConexao() {
  await pool.query('SELECT 1 FROM tarefas LIMIT 1');
}

module.exports = { listar, buscarPorId, inserir, atualizar, remover, verificarConexao };
