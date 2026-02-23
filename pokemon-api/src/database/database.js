

const Database = require('better-sqlite3');

const db = new Database('pokemon.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS pokemons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poke_id INTEGER UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    hp INTEGER,
    attack INTEGER,
    defense INTEGER,
    sprite TEXT
  )
`);

console.log('Banco de dados pronto');

module.exports = db;