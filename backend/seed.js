const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const jsonFile = path.resolve(__dirname, 'pokemons.json');
const MONGO_URI = process.env.MONGO_URI || '';
const MONGO_DB = process.env.MONGO_DB || 'poke_db';

async function run(){
  const items = [
    { name:'Pikachu', type:'Electric', description:'Pequeño y amarillo', image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', createdAt: new Date().toISOString() },
    { name:'Charmander', type:'Fire', description:'Lagartija de fuego', image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', createdAt: new Date().toISOString() },
    { name:'Bulbasaur', type:'Grass/Poison', description:'Bulbo en su espalda', image:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', createdAt: new Date().toISOString() }
  ];
  if (!MONGO_URI){
    fs.writeFileSync(jsonFile, JSON.stringify(items, null, 2));
    console.log('Seeded JSON file:', jsonFile);
    return;
  }
  const client = new MongoClient(MONGO_URI);
  try{
    await client.connect();
    const db = client.db(MONGO_DB);
    const collection = db.collection('pokemons');
    await collection.insertMany(items);
    console.log('Seeded MongoDB');
  }catch(e){
    console.error('Seed failed:', e.message);
    fs.writeFileSync(jsonFile, JSON.stringify(items, null, 2));
    console.log('Seeded JSON file as fallback');
  }finally{
    await client.close();
  }
}

run();
