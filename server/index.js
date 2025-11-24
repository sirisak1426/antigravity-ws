const express = require('express');
const cors = require('cors');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET /api/expenses
app.get('/api/expenses', (req, res) => {
    const sql = 'SELECT * FROM expenses ORDER BY createdAt DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching expenses:', err.message);
            res.status(500).json({ error: 'Failed to fetch expenses' });
        } else {
            // Convert SQLite date string to ISO format for consistent frontend parsing
            const formattedRows = rows.map(row => ({
                ...row,
                createdAt: new Date(row.createdAt + 'Z').toISOString()
            }));
            res.json(formattedRows);
        }
    });
});

// POST /api/expenses
app.post('/api/expenses', (req, res) => {
    const { description, amount, category, type } = req.body;

    if (!description || !amount || !category) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const transactionType = type || 'expense'; // Default to 'expense' for backward compatibility

    const sql = 'INSERT INTO expenses (description, amount, category, type) VALUES (?, ?, ?, ?)';
    const params = [description, parseFloat(amount), category, transactionType];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error creating transaction:', err.message);
            res.status(500).json({ error: 'Failed to create transaction' });
        } else {
            res.status(201).json({
                id: this.lastID,
                description,
                amount: parseFloat(amount),
                category,
                type: transactionType,
                createdAt: new Date().toISOString()
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
