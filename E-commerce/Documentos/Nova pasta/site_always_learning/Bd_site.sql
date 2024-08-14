-- Criação do banco de dados 'users' se ainda não existir
CREATE DATABASE IF NOT EXISTS users;
USE users;


-- Criação da tabela 'cadastrar'
CREATE TABLE IF NOT EXISTS cadastrar (
    idUser INT NOT NULL AUTO_INCREMENT,
    usernome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    senha VARCHAR(50) NOT NULL,
    Cpf BIGINT NOT NULL,  
    PRIMARY KEY (idUser)
);
