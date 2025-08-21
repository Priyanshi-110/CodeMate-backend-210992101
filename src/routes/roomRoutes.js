
const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const roomController = require('../controllers/roomController');
router.post('/create', authMiddleware, roomController.createRoom);

module.exports = router;