<?php
// Deprecated PHP seed. Use Node seed.js instead: `npm --prefix backend run seed`
echo "PHP seed removed. Use Node seed.js instead\n";
exit;
$mongoUri = getenv('MONGO_URI') ?: 'mongodb://localhost:27017';
$dbName = getenv('MONGO_DB') ?: 'poke_db';
$useJsonDb = false;
$jsonFile = __DIR__ . '/pokemons.json';
if (!file_exists(__DIR__ . '/vendor/autoload.php')) {
    echo "vendor/autoload.php missing - will seed to JSON fallback\n";
    $useJsonDb = true;
}
if (!$useJsonDb) {
    $client = new MongoDB\Client($mongoUri);
    $collection = $client->{$dbName}->pokemons;
    $collection->insertMany([
    ['name'=>'Pikachu','type'=>'Electric','description'=>'Pequeño y amarillo','image'=>'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'],
    ['name'=>'Charmander','type'=>'Fire','description'=>'Lagartija de fuego','image'=>'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'],
    ['name'=>'Bulbasaur','type'=>'Grass/Poison','description'=>'Bulbo en su espalda','image'=>'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png']
    ]);
    echo "Seeded MongoDB\n";
} else {
    $items = [
        ['_id' => 'json_1','name'=>'Pikachu','type'=>'Electric','description'=>'Pequeño y amarillo','image'=>'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png','createdAt'=>date(DATE_ATOM)],
        ['_id' => 'json_2','name'=>'Charmander','type'=>'Fire','description'=>'Lagartija de fuego','image'=>'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png','createdAt'=>date(DATE_ATOM)],
        ['_id' => 'json_3','name'=>'Bulbasaur','type'=>'Grass/Poison','description'=>'Bulbo en su espalda','image'=>'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png','createdAt'=>date(DATE_ATOM)],
    ];
    file_put_contents($jsonFile, json_encode($items, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
    echo "Seeded JSON file: $jsonFile\n";
}
echo "Seeded\n";
