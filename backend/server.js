const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

const logFile = path.resolve(__dirname, 'log.txt');
function log(msg){
  const l = `[${(new Date()).toISOString()}] ${msg}\n`;
  fs.appendFileSync(logFile, l);
}

const jsonFile = path.resolve(__dirname, 'pokemons.json');
let useJson = false;
let dbClient = null;
let collection = null;

const MONGO_URI = process.env.MONGO_URI || '';
const MONGO_DB = process.env.MONGO_DB || 'poke_db';

async function initDb(){
  if (!MONGO_URI) {
    useJson = true;
    log('No MONGO_URI provided, using JSON fallback');
    return;
  }
  try {
    dbClient = new MongoClient(MONGO_URI);
    await dbClient.connect();
    const db = dbClient.db(MONGO_DB);
    collection = db.collection('pokemons');
    log('Connected to MongoDB');
  } catch (err){
    log('MongoDB connection failed: ' + err.message);
    useJson = true;
  }
}

function readJson(){
  try {
    if (!fs.existsSync(jsonFile)) return [];
    const raw = fs.readFileSync(jsonFile, 'utf8');
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    log('readJson error: ' + e.message);
    return [];
  }
}

function writeJson(data){
  try {
    const tmp = jsonFile + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), { encoding: 'utf8' });
    fs.renameSync(tmp, jsonFile);
  } catch (e) {
    log('writeJson error: ' + e.message);
    throw e;
  }
}

app.get('/api/pokemons', async (req, res) => {
  log('GET /api/pokemons');
  if (useJson){
    return res.json(readJson());
  }
  try{
    const docs = await collection.find({}).sort({ createdAt: -1 }).toArray();
    res.json(docs.map(d => ({ ...d, _id: d._id.toString() })));
  } catch (e) {
    log('GET error: ' + e.message);
    res.status(500).json({ error: 'DB query failed: ' + e.message });
  }
});

app.post('/api/pokemons', async (req, res) => {
  log('POST /api/pokemons');
  const { name, type, description = '', image = '' } = req.body || {};
  if (!name || !type) return res.status(400).json({ error: 'Campos faltantes (name, type) o vacíos' });
  const item = { name, type, description, image, createdAt: new Date().toISOString() };
  if (useJson){
    try{
      const items = readJson();
      item._id = 'json_' + Math.random().toString(36).slice(2,10);
      items.unshift(item);
      writeJson(items);
      log('Inserted json id: ' + item._id);
      return res.status(201).json(item);
    } catch (e) {
      log('JSON insert error: ' + e.message);
      return res.status(500).json({ error: 'JSON insert failed: ' + e.message });
    }
  }
  try{
    const r = await collection.insertOne(item);
    item._id = r.insertedId.toString();
    log('Inserted Mongo id: ' + item._id);
    res.status(201).json(item);
  } catch (e) {
    log('Mongo insert error: ' + e.message);
    res.status(500).json({ error: 'Insert failed: ' + e.message });
  }
});

// Update pokemon
app.put('/api/pokemons/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, description = '', image = '' } = req.body || {};
  if (!name || !type) return res.status(400).json({ error: 'Campos faltantes (name, type) o vacíos' });
  if (useJson){
    try{
      const items = readJson();
      const idx = items.findIndex(it => it._id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      items[idx] = { ...items[idx], name, type, description, image };
      writeJson(items);
      log('Updated json id: ' + id);
      return res.json(items[idx]);
    } catch(e){
      log('JSON update error: '+e.message);
      return res.status(500).json({ error: 'JSON update failed: ' + e.message });
    }
  }
  try{
    const objectId = ObjectId.isValid(id) ? new ObjectId(id) : null;
    const resu = await collection.updateOne({ _id: objectId || id }, { $set: { name, type, description, image } });
    if (resu.matchedCount === 0) return res.status(404).json({ error: 'Not found' });
    const updated = await collection.findOne({ _id: objectId || id });
    updated._id = updated._id.toString();
    log('Mongo update id: ' + id);
    res.json(updated);
  } catch(e){
    log('Mongo update error: '+e.message);
    res.status(500).json({ error: 'Update failed: ' + e.message });
  }
});

// Delete pokemon
app.delete('/api/pokemons/:id', async (req, res) => {
  const { id } = req.params;
  if (useJson){
    try{
      const items = readJson();
      const idx = items.findIndex(it => it._id === id);
      if (idx === -1) return res.status(404).json({ error: 'Not found' });
      const removed = items.splice(idx,1)[0];
      writeJson(items);
      log('Deleted json id: ' + id);
      return res.json({ ok: true, deleted: removed });
    } catch(e){
      log('JSON delete error: '+e.message);
      return res.status(500).json({ error: 'JSON delete failed: ' + e.message });
    }
  }
  try{
    const oid = ObjectId.isValid(id) ? new ObjectId(id) : id;
    const r = await collection.deleteOne({ _id: oid });
    if (r.deletedCount === 0) return res.status(404).json({ error: 'Not found' });
    log('Mongo deleted id: ' + id);
    res.json({ ok: true });
  } catch(e){
    log('Mongo delete error: '+e.message);
    res.status(500).json({ error: 'Delete failed: ' + e.message });
  }
});

const HOST = process.env.BACKEND_HOST || '0.0.0.0';
const PORT = process.env.BACKEND_PORT || 8000;
app.listen(PORT, HOST, async () => {
  await initDb();
  log(`Server listening on ${HOST}:${PORT}`);
  console.log(`Backend running on http://${HOST}:${PORT}`);
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

// Global error handlers
process.on('uncaughtException', (err) => {
  log('uncaughtException: ' + (err && err.stack ? err.stack : err));
  console.error('uncaughtException', err);
});
process.on('unhandledRejection', (reason, p) => {
  log('unhandledRejection: ' + (reason && reason.stack ? reason.stack : reason));
  console.error('unhandledRejection', reason);
});
