<?php
/**
 * CRUD de autores para o banco biblioteca.
 */

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    $db = getDatabaseConnection();

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $statement = $db->query('SELECT id_autor, nome FROM autores ORDER BY nome ASC');
            jsonResponse($statement->fetchAll());

        case 'POST':
            $data = readJsonBody();
            $nome = requireText($data, 'nome', 100);
            $statement = $db->prepare('INSERT INTO autores (nome) VALUES (:nome)');
            $statement->execute(['nome' => $nome]);
            $id = (int)$db->lastInsertId();
            jsonResponse(['id_autor' => $id, 'nome' => $nome], 201);

        case 'PUT':
            $data = readJsonBody();
            $id = requirePositiveInt($data, 'id_autor');
            $nome = requireText($data, 'nome', 100);
            $statement = $db->prepare('UPDATE autores SET nome = :nome WHERE id_autor = :id');
            $statement->execute(['nome' => $nome, 'id' => $id]);
            if ($statement->rowCount() === 0) {
                $exists = $db->prepare('SELECT id_autor FROM autores WHERE id_autor = :id');
                $exists->execute(['id' => $id]);
                if (!$exists->fetch()) {
                    jsonResponse(['erro' => 'Autor não encontrado.'], 404);
                }
            }
            jsonResponse(['id_autor' => $id, 'nome' => $nome]);

        case 'DELETE':
            $id = requestId('id_autor');
            $statement = $db->prepare('DELETE FROM autores WHERE id_autor = :id');
            $statement->execute(['id' => $id]);
            if ($statement->rowCount() === 0) {
                jsonResponse(['erro' => 'Autor não encontrado.'], 404);
            }
            jsonResponse(['mensagem' => 'Autor removido com sucesso.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            jsonResponse(['erro' => 'Método não permitido.'], 405);
    }
} catch (Throwable $error) {
    handleDatabaseError($error);
}
