const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "xhb36nba",
    database: "ukraine_facebook_data"
});

connection.connect((err) => {
    if (err) throw err;
    console.log("Connected to MySQL database!");
});

module.exports = connection;
