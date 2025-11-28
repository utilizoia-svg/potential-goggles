<?php
// Simple file-based storage para demo local.
// Reemplaza la necesidad de MongoDB/Composer en entornos donde no están disponibles.

define('USERS_FILE', __DIR__ . '/data_users.json');// normalize output to same shapefe
define('ALBUMS_FILE', __DIR__ . '/data_albums.json');

function loadJson(string $path, $default = []) {
    if (!file_exists($path)) return $default;
    $content = file_get_contents($path);
    $data = json_decode($content, true);
    return $data === null ? $default : $data;
}

function saveJson(string $path, $data) {
    file_put_contents($path, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function findUserByEmail(string $email) {
    $users = loadJson(USERS_FILE, []);
    foreach ($users as $u) {
        if (isset($u['email']) && $u['email'] === $email) return $u;
    }
    return null;
}

function insertUser(array $user) {
    $users = loadJson(USERS_FILE, []);
    $id = uniqid('', true);
    $user['_id'] = $id;
    if (!isset($user['createdAt'])) $user['createdAt'] = date('c');
    $users[] = $user;
    saveJson(USERS_FILE, $users);
    return $id;
}

function updateUserById(string $id, array $patch) {
    $users = loadJson(USERS_FILE, []);
    $changed = false;
    foreach ($users as &$u) {
        if (isset($u['_id']) && $u['_id'] === $id) {
            $u = array_merge($u, $patch);
            $changed = true;
            break;
        }
    }
    if ($changed) saveJson(USERS_FILE, $users);
    return $changed;
}

function getAllUsers(): array {
    return loadJson(USERS_FILE, []);
}

function getAlbums(): array {
    return loadJson(ALBUMS_FILE, []);
}

function saveAlbums(array $albums) {
    saveJson(ALBUMS_FILE, $albums);
}

function seedAlbumsIfEmpty(): array {
    $albums = getAlbums();
    if (count($albums) === 0) {
        $defaults = [
            ['title' => 'Midnight Dreams', 'artist' => 'Luna Echo', 'year'=>2023,
             'songs'=>12, 'image'=>'https://www.spotify.com/favicon.ico',
              'description'=>'Un viaje etéreo a través de noches mágicas y sueños infinitos.'],
            ['title' => 'Urban Pulse', 'artist' => 'City Rhythms', 'year'=>2023,
            'songs'=>14,'image'=>'https://genius.com/favicon.ico',
            'description'=>'La energía del la ciudad capturada en cada beat.'],
            ['title' => 'Serenity', 'artist' => 'Peaceful Waves', 'year'=>2023,'songs'=>10,
            'image'=>'https://tidal.com/favicon.ico','description'=>'Música relajante para momentos de calma y reflexión.']
        ];
        // asignar IDs únicos
        foreach ($defaults as &$d) {
            $d['_id'] = uniqid('', true);
        }
        saveAlbums($defaults);
        return $defaults;
    }
    return $albums;
}
