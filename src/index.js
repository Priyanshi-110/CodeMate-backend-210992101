// src/index.js
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const executeRoutes = require('./routes/executeRoutes.js');

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app

// Initialize Socket.IO and allow all connections for development
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// Import API routes
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const roomRoutes = require('./routes/roomRoutes');

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use API routes
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/execute', executeRoutes);

// --- This section handles all real-time logic ---
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);

    // Logic for when a user joins a specific coding room
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    // Logic for when code is changed in a room
    socket.on('code-change', ({ roomId, code }) => {
        // Broadcast the new code to everyone else in the same room
        socket.to(roomId).emit('code-receive', code);
    });

    // Logic for when a user disconnects
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// ---------------------------------------------

// Start the server using the http server instance
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});