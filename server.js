const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Connect to MySQL
const dbConfig = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
};

// API Endpoint for Aggregated Weekly Data
app.get('/api/weeklyData', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = `
            SELECT
                DATE_FORMAT(time.date, '%Y-%u') AS week,
                SUM(metrics.reactions) AS totalReactions,
                SUM(metrics.comments) AS totalComments,
                SUM(metrics.shares) AS totalShares
            FROM time
                     JOIN metrics ON time.id = metrics.time_id
            GROUP BY week
            ORDER BY week;
        `;
        const [rows] = await connection.query(query);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Database Error:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
