const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,        // Loaded from .env
    user: process.env.DB_USER,        // Loaded from .env
    password: process.env.DB_PASSWORD, // Loaded from .env
    database: process.env.DB_NAME,    // Loaded from .env
    ssl: {
        rejectUnauthorized: true      // Enable this for secure connections
    }
});

app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Define the /data endpoint
app.get('/data', (req, res) => {
    const query = 'SELECT * FROM user'; // Replace 'user' with your actual table name
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ message: 'Database query failed', error: err.message });
            return;
        }
        res.json(results); // Send the data as JSON
    });
});

// Start the server
const PORT = process.env.PORT || 3000; // Allow flexibility to set the port via .env
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
