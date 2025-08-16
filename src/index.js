// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// --- IMPORT YOUR ROUTES ---
const userRoutes = require('./routes/userRoutes'); // <-- MAKE SURE YOU HAVE THIS LINE
const profileRoutes = require('./routes/profileRoutes');
// Add other route imports here as you create them

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- USE YOUR ROUTES ---
app.use('/api/users', userRoutes); // <-- AND MAKE SURE YOU HAVE THIS LINE
app.use('/api/profile', profileRoutes);
// Add other app.use() here

// A simple welcome message for the main URL
app.get('/', (req, res) => {
    res.send('Welcome to the CodeMate API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});