require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { PrismaClient } = require('@prisma/client'); // <-- 1. IMPORT PRISMA CLIENT

// Import API routes
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const roomRoutes = require('./routes/roomRoutes');
const executeRoutes = require('./routes/executeRoutes');
const taRoutes = require('./routes/taRoutes'); // <-- 2. IMPORT YOUR NEW TA ROUTES

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});
const prisma = new PrismaClient(); // <-- 3. INITIALIZE PRISMA CLIENT

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Use API routes
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/ta', taRoutes); // <-- 4. USE YOUR NEW TA ROUTES

// --- This section handles all real-time logic ---
io.on('connection', (socket) => {
    console.log('A user connected via WebSocket:', socket.id);

    // ... (existing 'join-room' and 'code-change' events from Member 1) ...
    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('code-change', ({ roomId, code }) => {
        socket.to(roomId).emit('code-receive', code);
    });

    // ▼▼▼ YOUR NEW "RAISE HAND" LOGIC STARTS HERE ▼▼▼
    socket.on('raise-hand', async ({ roomId, isRaised }) => {
        try {
            // Update the handRaised status in the database
            const updatedRoom = await prisma.sessionRoom.update({
                where: { id: roomId },
                data: { handRaised: isRaised }, // isRaised should be true or false
            });
            
            // Broadcast the new hand status to EVERYONE in the room
            io.to(roomId).emit('hand-status-updated', { handRaised: updatedRoom.handRaised });

            console.log(`Hand status in room ${roomId} changed to: ${updatedRoom.handRaised}`);
        } catch (error) {
            console.error(`Error updating hand status for room ${roomId}:`, error);
            // Optionally, let the client know something went wrong
            socket.emit('error-updating-hand', { message: 'Could not update hand status.' });
        }
    });
    // ▲▲▲ YOUR NEW "RAISE HAND" LOGIC ENDS HERE ▲▲▲

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});