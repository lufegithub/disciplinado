const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const nomeBanco = process.env.DB_NAME || 'disciplinado';

async function main() {
  const conexao = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  });

  try {
    await conexao.query(
      `CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(nomeBanco)}
       CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conexao.changeUser({ database: nomeBanco });

    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await conexao.query(schema);

    console.log(`Banco "${nomeBanco}" e tabela "tarefas" prontos.`);
    console.log('Agora rode npm run dev para iniciar a aplicação.');
  } finally {
    await conexao.end();
  }
}

main().catch(err => {
  console.error('Não foi possível criar o banco:', err.message || err.code || err);
  console.error('Confira se o MySQL está rodando e se DB_HOST, DB_USER e DB_PASSWORD no .env estão certos.');
  process.exit(1);
});
