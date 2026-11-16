CREATE TABLE IF NOT EXISTS tarefas (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  titulo      VARCHAR(100) NOT NULL,
  descricao   VARCHAR(500) NOT NULL DEFAULT '',
  disciplina  VARCHAR(80)  NOT NULL,
  status      ENUM('pendente', 'concluida') NOT NULL DEFAULT 'pendente',
  criado_em   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
