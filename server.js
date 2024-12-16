const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MySQL connection configuration
const dbConfig = {
    host: process.env.DBHOST || 'localhost',
    user: process.env.DBUSER || 'root',
    password: process.env.DBPASSWORD || '',
    database: process.env.DBNAME || 'facebook_data_analysis',
};

// Function to create a MySQL connection
async function createConnection() {
    return await mysql.createConnection(dbConfig);
}

// Endpoint for Total Interactions Timeline
app.get('/api/interactionTimeline', async (req, res) => {
    try {
        const connection = await createConnection();
        const query = `
            SELECT 
                DATE_FORMAT(time.date, '%Y-%m') AS period, 
                SUM(metrics.reactions + metrics.comments + metrics.shares) AS totalInteractions
            FROM time
            JOIN metrics ON time.ccpost_id = metrics.ccpost_id
            WHERE time.date > '2021-01-01'
            GROUP BY period
            ORDER BY period;
        `;
        const [rows] = await connection.query(query);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Endpoint for Trending Keywords
app.get('/api/trendingKeywords', async (req, res) => {
    try {
        const connection = await createConnection();
        const query = `
            SELECT 
                keyword, 
                SUM(count) AS total_occurrences
            FROM keywords
            WHERE keyword IN (
                'war', 'krieg', 'crisis', 'refugees', 'freedom', 'hilfe', 
                'violence', 'peace', 'NATO', 'EU'
            )
            GROUP BY keyword
            ORDER BY total_occurrences DESC;
        `;
        const [rows] = await connection.query(query);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch trending keywords' });
    }
});


// Endpoint for Global Events Timeline
app.get('/api/globalEvents', async (req, res) => {
    console.log('Global Events Timeline endpoint hit');
    try {
        const connection = await createConnection();
        const query = `
            SELECT 
                DATE_FORMAT(event_date, '%Y-%m') AS period, 
                event_title
            FROM global_events
            WHERE event_date >= '2021-01-01'
            ORDER BY period;
        `;
        const [rows] = await connection.query(query);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch global events' });
    }
});

// Endpoint for Ukraine War Events Timeline
app.get('/api/ukraineWarEvents', async (req, res) => {
    console.log('Ukraine War Events endpoint hit');
    try {
        const connection = await createConnection();
        const query = `
            SELECT 
                DATE_FORMAT(event_date, '%Y-%m') AS period, 
                event_title
            FROM ukraine_war_events
            WHERE event_date >= '2021-01-01'
            ORDER BY event_date;
        `;
        const [rows] = await connection.query(query);
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch Ukraine war events' });
    }
});




// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
