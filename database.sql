-- Banco de dados da aplicação Estante
CREATE DATABASE IF NOT EXISTS biblioteca
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE biblioteca;

CREATE TABLE IF NOT EXISTS autores (
    id_autor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS livros (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    id_autor INT NOT NULL,
    editora VARCHAR(100) NOT NULL,
    ano_publicacao YEAR NOT NULL,
    paginas INT NOT NULL,
    CONSTRAINT fk_livros_autores
        FOREIGN KEY (id_autor)
        REFERENCES autores(id_autor)
        ON DELETE CASCADE
) ENGINE=InnoDB;
