// No changes needed in this file
const express = require('express');
const { executeCode } = require('../controllers/executeController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

const router = express.Router();
router.post('/', authMiddleware, executeCode);

module.exports = router;