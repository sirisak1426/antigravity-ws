const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      type TEXT DEFAULT 'expense' CHECK(type IN ('income', 'expense')),
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                // Migration: Add 'type' column if it doesn't exist
                db.all("PRAGMA table_info(expenses)", [], (err, columns) => {
                    if (err) {
                        console.error('Error checking table schema:', err.message);
                        return;
                    }

                    const hasTypeColumn = columns.some(col => col.name === 'type');

                    if (!hasTypeColumn) {
                        console.log('Migrating database: Adding type column...');
                        db.run(`ALTER TABLE expenses ADD COLUMN type TEXT DEFAULT 'expense' CHECK(type IN ('income', 'expense'))`, (err) => {
                            if (err) {
                                console.error('Error adding type column:', err.message);
                            } else {
                                console.log('Migration successful: type column added');
                                // Update existing records to have type='expense'
                                db.run(`UPDATE expenses SET type = 'expense' WHERE type IS NULL`, (err) => {
                                    if (err) {
                                        console.error('Error updating existing records:', err.message);
                                    } else {
                                        console.log('Existing records updated with type=expense');
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
});

module.exports = db;
