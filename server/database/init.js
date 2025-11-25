const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const dbPath = path.join(__dirname, 'employees.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Create database
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Read and execute schema
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split schema into individual statements and execute
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

statements.forEach(statement => {
  try {
    db.exec(statement);
  } catch (error) {
    console.error('Error executing statement:', statement);
    console.error(error);
  }
});

console.log('Database initialized successfully!');
console.log('Database location:', dbPath);

// Export database instance for reuse
module.exports = db;
