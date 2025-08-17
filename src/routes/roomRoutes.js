// src/routes/roomRoutes.js
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const roomController = require('../controllers/roomController');

// Any POST request to /api/rooms/create will run the createRoom logic
router.post('/create', authMiddleware, roomController.createRoom);

module.exports = router;