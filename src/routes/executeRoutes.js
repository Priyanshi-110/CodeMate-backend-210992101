const express = require('express');
const { executeCode } = require('../controllers/executeController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js'); // Assuming this exists

const router = express.Router();

// POST /api/execute
// This endpoint will be protected, so only logged-in users can run code.
router.post('/', authMiddleware, executeCode);

module.exports = router;