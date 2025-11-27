<?php
// This PHP backend has been removed and replaced by Node.js (server.js).
// Keep this file only for historical reasons. All requests should be handled by the Node backend.
http_response_code(410);
header('Content-Type: application/json');
echo json_encode(['error' => 'PHP backend removed. Use Node backend (server.js).']);
exit;

// Load environment variables from .env if exists
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env');
    foreach ($lines as $line) {
        $line = trim($line);
        if (!$line || strpos($line, '#') === 0) continue;
        putenv($line);
    }
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Simple file logging for debug - append lines to backend/log.txt
function log_message($msg){
    $f = __DIR__.'/log.txt';
    $ts = (new DateTime())->format(DateTime::ATOM);
    @file_put_contents($f, "[$ts] $msg\n", FILE_APPEND);
}

// Log that backend file loaded
log_message('Backend script loaded');

// Router
$uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// only implement /api/pokemons
if (preg_match('#/api/pokemons#', $uri)) {
    log_message("Hit $method $uri");
    // create MongoDB client
    $mongoUri = getenv('MONGO_URI') ?: 'mongodb://localhost:27017';
    $dbName = getenv('MONGO_DB') ?: 'poke_db';
    // Check for composer autoload file first (require_once would fatal if missing)
    $useJsonDb = false;
    $jsonFile = __DIR__ . '/pokemons.json';
    if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
        log_message('vendor/autoload.php missing - will fallback to JSON storage. Run composer install to enable MongoDB.');
        $useJsonDb = true;
    }
    if (!$useJsonDb) {
        try {
            require_once __DIR__ . '/vendor/autoload.php';
            $client = new MongoDB\Client($mongoUri);
            $collection = $client->{$dbName}->pokemons;
            log_message('MongoDB client created');
        } catch (Exception $e) {
            log_message('MongoDB client creation failed: '.$e->getMessage());
            // If Mongo fails, fallback to JSON storage
            $useJsonDb = true;
        }
    }

    // Helper functions for JSON-based storage fallback
    function read_json_db($file){
        if (!file_exists($file)) return [];
        $raw = @file_get_contents($file);
        if (!$raw) return [];
        $arr = json_decode($raw, true);
        return is_array($arr) ? $arr : [];
    }
    function write_json_db($file, $data){
        $tmp = $file . '.tmp';
        file_put_contents($tmp, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);
        rename($tmp, $file);
    }
    try {
        require_once __DIR__ . '/vendor/autoload.php';
        $client = new MongoDB\Client($mongoUri);
        $collection = $client->{$dbName}->pokemons;
    } catch (Exception $e) {
        log_message('MongoDB client creation failed: '.$e->getMessage());
        http_response_code(500);
        echo json_encode(['error' => 'MongoDB library missing or connection failed: '.$e->getMessage()]);
        exit;
    }

    if ($method === 'GET') {
        log_message('Listing pokemons (' . ($useJsonDb ? 'json' : 'mongo') . ')');
        if ($useJsonDb) {
            try {
                $out = read_json_db($jsonFile);
                echo json_encode($out);
            } catch (Exception $e) {
                log_message('JSON read error: '.$e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'JSON read failed: '.$e->getMessage()]);
            }
            exit;
        }
        try {
            $cursor = $collection->find([], ['sort' => ['_id' => -1]]);
            $out = [];
            foreach ($cursor as $doc) {
                $a = json_decode(json_encode($doc), true);
                if (isset($a['_id'])) $a['_id'] = (string)$a['_id']['$oid'] ?? (string)$a['_id'];
                $out[] = $a;
            }
            echo json_encode($out);
        } catch (Exception $e) {
            log_message('Find error: '.$e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Query failed: '.$e->getMessage()]);
        }
        exit;
    }

    if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        log_message('Content-Type: ' . $contentType);
        log_message('POST body: '.$raw);
        $body = json_decode($raw, true);
        if (!$body) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON body']);
            exit;
        }
        // Validate presence and non-empty values
        if (!isset($body['name']) || !isset($body['type']) || trim($body['name']) === '' || trim($body['type']) === '') {
            http_response_code(400);
            echo json_encode(['error' => 'Campos faltantes (name, type) o vacíos']);
            exit;
        }
        $insert = [
            'name' => $body['name'],
            'type' => $body['type'],
            'description' => $body['description'] ?? '',
            'image' => $body['image'] ?? '',
                'createdAt' => (new DateTime())->format(DateTime::ATOM)
        ];
        if ($useJsonDb) {
            try {
                $items = read_json_db($jsonFile);
                // create unique id (prefixed for clarity)
                if (function_exists('random_bytes')) {
                    $insert['_id'] = 'json_' . bin2hex(random_bytes(6));
                } else {
                    $insert['_id'] = 'json_' . uniqid();
                }
                array_unshift($items, $insert); // insert at beginning similar to sort
                write_json_db($jsonFile, $items);
                log_message('Inserted json id: '.$insert['_id']);
            } catch (Exception $e) {
                log_message('JSON insert error: '.$e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'JSON insert failed: '.$e->getMessage()]);
                exit;
            }
        } else {
            try {
                $res = $collection->insertOne($insert);
                $insert['_id'] = (string)$res->getInsertedId();
                log_message('Inserted id: '.$insert['_id']);
            } catch (Exception $e) {
                log_message('Insert error: '.$e->getMessage());
                http_response_code(500);
                echo json_encode(['error' => 'Insert failed: '.$e->getMessage()]);
                exit;
            }
        }
        // Return 201 Created
        http_response_code(201);
        echo json_encode($insert);
        exit;
    }

    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        exit;
    }
}

// End of deprecated PHP file.
