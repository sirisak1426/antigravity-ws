const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'server', 'dev.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1);
    } else {
        console.log('Connected to database');
        db.all("PRAGMA table_info(expenses)", [], (err, columns) => {
            if (err) {
                console.error('Error:', err.message);
                process.exit(1);
            } else {
                console.log('\\nTable schema for expenses:');
                console.table(columns);

                // Also check if there are any records
                db.all("SELECT * FROM expenses LIMIT 5", [], (err, rows) => {
                    if (err) {
                        console.error('Error fetching rows:', err.message);
                    } else {
                        console.log('\\nSample records:');
                        console.table(rows);
                    }
                    db.close();
                    process.exit(0);
                });
            }
        });
    }
});
