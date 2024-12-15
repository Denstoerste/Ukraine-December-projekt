const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();





// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Database Configuration
const dbConfig = {
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
};

// Log the Database Configuration
console.log('DB Config:', dbConfig);

// Test Database Connection
(async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to the MySQL database successfully!');
        await connection.end();
    } catch (error) {
        console.error('Failed to connect to the MySQL database:', error);
        process.exit(1); // Exit the app if database connection fails
    }
})();

// Example API Endpoint
app.get('/api/test', async (req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT "Connection is working!" AS message');
        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Database Query Error:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
