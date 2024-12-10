const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// API route to fetch metrics data
app.get('/api/metrics', (req, res) => {
    db.query('SELECT * FROM metrics', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
