<?php
/**
 * Configuração PDO da Biblioteca.
 *
 * Defina as variáveis de ambiente DB_HOST, DB_NAME, DB_USER e DB_PASS no servidor.
 * Os valores abaixo são úteis apenas para desenvolvimento local — substitua-os
 * antes de publicar a aplicação em produção.
 */

declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_NAME = 'biblioteca';
const DB_USER = 'root';
const DB_PASS = '';

function getDatabaseConnection(): PDO
{
    static $connection = null;

    if ($connection instanceof PDO) {
        return $connection;
    }

    $host = getenv('DB_HOST') ?: DB_HOST;
    $name = getenv('DB_NAME') ?: DB_NAME;
    $user = getenv('DB_USER') ?: DB_USER;
    $pass = getenv('DB_PASS');
    $pass = $pass === false ? DB_PASS : $pass;

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $host, $name);

    $connection = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $connection;
}
