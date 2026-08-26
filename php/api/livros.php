<?php
/**
 * CRUD de livros para o banco biblioteca.
 */

declare(strict_types=1);

require_once __DIR__ . '/_bootstrap.php';

try {
    $db = getDatabaseConnection();

    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $statement = $db->query(
                'SELECT id_livro, titulo, id_autor, editora,
                        CAST(ano_publicacao AS UNSIGNED) AS ano_publicacao,
                        paginas
                 FROM livros
                 ORDER BY id_livro DESC'
            );
            jsonResponse($statement->fetchAll());

        case 'POST':
            $data = readJsonBody();
            $titulo = requireText($data, 'titulo', 150);
            $idAutor = requirePositiveInt($data, 'id_autor');
            $editora = requireText($data, 'editora', 100);
            $ano = requireYear($data, 'ano_publicacao');
            $paginas = requirePositiveInt($data, 'paginas');

            $statement = $db->prepare(
                'INSERT INTO livros (titulo, id_autor, editora, ano_publicacao, paginas)
                 VALUES (:titulo, :id_autor, :editora, :ano_publicacao, :paginas)'
            );
            $statement->execute([
                'titulo' => $titulo,
                'id_autor' => $idAutor,
                'editora' => $editora,
                'ano_publicacao' => $ano,
                'paginas' => $paginas,
            ]);

            jsonResponse([
                'id_livro' => (int)$db->lastInsertId(),
                'titulo' => $titulo,
                'id_autor' => $idAutor,
                'editora' => $editora,
                'ano_publicacao' => $ano,
                'paginas' => $paginas,
            ], 201);

        case 'PUT':
            $data = readJsonBody();
            $id = requirePositiveInt($data, 'id_livro');
            $titulo = requireText($data, 'titulo', 150);
            $idAutor = requirePositiveInt($data, 'id_autor');
            $editora = requireText($data, 'editora', 100);
            $ano = requireYear($data, 'ano_publicacao');
            $paginas = requirePositiveInt($data, 'paginas');

            $statement = $db->prepare(
                'UPDATE livros
                 SET titulo = :titulo, id_autor = :id_autor, editora = :editora,
                     ano_publicacao = :ano_publicacao, paginas = :paginas
                 WHERE id_livro = :id'
            );
            $statement->execute([
                'titulo' => $titulo,
                'id_autor' => $idAutor,
                'editora' => $editora,
                'ano_publicacao' => $ano,
                'paginas' => $paginas,
                'id' => $id,
            ]);
            if ($statement->rowCount() === 0) {
                $exists = $db->prepare('SELECT id_livro FROM livros WHERE id_livro = :id');
                $exists->execute(['id' => $id]);
                if (!$exists->fetch()) {
                    jsonResponse(['erro' => 'Livro não encontrado.'], 404);
                }
            }
            jsonResponse([
                'id_livro' => $id,
                'titulo' => $titulo,
                'id_autor' => $idAutor,
                'editora' => $editora,
                'ano_publicacao' => $ano,
                'paginas' => $paginas,
            ]);

        case 'DELETE':
            $id = requestId('id_livro');
            $statement = $db->prepare('DELETE FROM livros WHERE id_livro = :id');
            $statement->execute(['id' => $id]);
            if ($statement->rowCount() === 0) {
                jsonResponse(['erro' => 'Livro não encontrado.'], 404);
            }
            jsonResponse(['mensagem' => 'Livro removido com sucesso.']);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            jsonResponse(['erro' => 'Método não permitido.'], 405);
    }
} catch (PDOException $error) {
    $isForeignKeyError = $error->getCode() === '23000';
    if ($isForeignKeyError) {
        jsonResponse(['erro' => 'O autor informado não existe ou o registro está relacionado a outro item.'], 422);
    }
    handleDatabaseError($error);
} catch (Throwable $error) {
    handleDatabaseError($error);
}
