<?php
/**
 * Bootstrap compartilhado da API da Biblioteca.
 * Respostas JSON, CORS local e helpers de entrada/saída.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function jsonResponse(mixed $data, int $status = 200): never
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);
    if (!is_array($data)) {
        jsonResponse(['erro' => 'O corpo da requisição deve ser um JSON válido.'], 400);
    }

    return $data;
}

function requireText(array $data, string $field, int $maxLength): string
{
    $value = trim((string)($data[$field] ?? ''));
    if ($value === '') {
        jsonResponse(['erro' => sprintf('O campo "%s" é obrigatório.', $field)], 422);
    }
    if (mb_strlen($value) > $maxLength) {
        jsonResponse(['erro' => sprintf('O campo "%s" excede %d caracteres.', $field, $maxLength)], 422);
    }
    return $value;
}

function requirePositiveInt(array $data, string $field): int
{
    $value = filter_var($data[$field] ?? null, FILTER_VALIDATE_INT);
    if ($value === false || $value <= 0) {
        jsonResponse(['erro' => sprintf('O campo "%s" deve ser um inteiro positivo.', $field)], 422);
    }
    return $value;
}

function requireYear(array $data, string $field): int
{
    $value = requirePositiveInt($data, $field);
    if ($value < 1000 || $value > 2100) {
        jsonResponse(['erro' => sprintf('O campo "%s" deve estar entre 1000 e 2100.', $field)], 422);
    }
    return $value;
}

function requestId(string $field): int
{
    $body = readJsonBody();
    $candidate = $body[$field] ?? $_GET[$field] ?? null;
    $value = filter_var($candidate, FILTER_VALIDATE_INT);
    if ($value === false || $value <= 0) {
        jsonResponse(['erro' => sprintf('Informe um "%s" válido.', $field)], 422);
    }
    return $value;
}

function handleDatabaseError(Throwable $error): never
{
    error_log($error->getMessage());
    jsonResponse(['erro' => 'Não foi possível concluir a operação no catálogo.'], 500);
}
