<?php
// Simple PHP REST API para examen2 — usa almacenamiento JSON (db.php)
header('Content-Type: application/json; charset=utf-8');

require __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// normalize path (could be served at root folder)
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && strpos($path, $scriptName) === 0) {
    $path = substr($path, strlen($scriptName));
}

$path = rtrim($path, '/');

function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// health
if ($path === '/api/health' && $method === 'GET') {
    jsonResponse(['status' => 'Backend PHP funcionando correctamente']);
}

// Register (datos simples / no verdaderos)
// Ahora sólo se exige `name`. Si faltan `email` o `password` se generan valores ficticios.
if ($path === '/api/auth/register' && $method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $name = isset($body['name']) ? trim($body['name']) : '';
    $email = isset($body['email']) ? trim($body['email']) : null;
    $password = isset($body['password']) ? $body['password'] : null;

    if ($name === '') {
        $name = 'user' . rand(1000, 9999);
    }

    if (!$email) {
        $slug = preg_replace('/[^a-z0-9]+/i', '-', strtolower($name));
        $slug = trim($slug, '-');
        if ($slug === '') $slug = 'user' . rand(1000, 9999);
        $email = $slug;
    }

    if (!$password) {
        $password = bin2hex(random_bytes(4));
    }

    $existing = findUserByEmail($email);
    if ($existing) {
        $user = [
            '_id' => $existing['_id'],
            'name' => $existing['name'] ?? $name,
            'email' => $existing['email'] ?? $email
        ];
        $token = bin2hex(random_bytes(16));
        updateUserById($existing['_id'], ['token' => $token]);
        jsonResponse(['token' => $token, 'user' => $user], 200);
    }

    $hash = password_hash($password, PASSWORD_BCRYPT);
    $token = bin2hex(random_bytes(16));

    $newId = insertUser([
        'name' => $name,
        'email' => $email,
        'password' => $hash,
        'token' => $token
    ]);

    $user = [
        '_id' => $newId,
        'name' => $name,
        'email' => $email
    ];

    jsonResponse(['token' => $token, 'user' => $user], 201);
}

// Login (acepta cualquier credencial — no se requieren datos reales)
// Si el usuario no existe se crea con datos ficticios; si existe se le asigna un token nuevo.
if ($path === '/api/auth/login' && $method === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $email = isset($body['email']) ? trim($body['email']) : null;
    $password = isset($body['password']) ? $body['password'] : null;
    $name = isset($body['name']) ? trim($body['name']) : null;

    if (!$email) {
        if ($name && $name !== '') {
            $slug = preg_replace('/[^a-z0-9]+/i', '-', strtolower($name));
            $slug = trim($slug, '-');
            if ($slug === '') $slug = 'user' . rand(1000, 9999);
            $email = $slug;
        } else {
            $email = 'user' . rand(1000,9999);
        }
    }

    $userDoc = findUserByEmail($email);

    if ($userDoc) {
        $token = bin2hex(random_bytes(16));
        updateUserById($userDoc['_id'], ['token' => $token]);
        $user = [
            '_id' => $userDoc['_id'],
            'name' => $userDoc['name'] ?? ($name ?? 'Usuario'),
            'email' => $userDoc['email']
        ];
        jsonResponse(['token' => $token, 'user' => $user]);
    }

    $generatedName = $name && $name !== '' ? $name : (strpos($email,'@')!==false? explode('@', $email)[0] : $email);
    $generatedPassword = $password ? $password : bin2hex(random_bytes(4));
    $hash = password_hash($generatedPassword, PASSWORD_BCRYPT);
    $token = bin2hex(random_bytes(16));

    $newId = insertUser([
        'name' => $generatedName,
        'email' => $email,
        'password' => $hash,
        'token' => $token
    ]);

    $user = [
        '_id' => $newId,
        'name' => $generatedName,
        'email' => $email
    ];

    jsonResponse(['token' => $token, 'user' => $user], 201);
}

// Albums: list
if ($path === '/api/albums' && $method === 'GET') {
    $albums = seedAlbumsIfEmpty();
    // Normalizar la salida a la misma forma
    $out = [];
    foreach ($albums as $doc) {
        $out[] = [
            '_id' => $doc['_id'] ?? '',
            'title' => $doc['title'] ?? '',
            'artist' => $doc['artist'] ?? '',
            'year' => $doc['year'] ?? 2023,
            'songs' => $doc['songs'] ?? 10,
            'image' => $doc['image'] ?? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'description' => $doc['description'] ?? ''
        ];
    }

    jsonResponse($out);
}

// If we reach here, route not found
jsonResponse(['message' => 'Not found'], 404);
