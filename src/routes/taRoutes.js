const express = require('express');
const router = express.Router();
const { getDashboardData } = require('../controllers/taController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/checkRole');

// This route is now double-protected.
// 1. `authMiddleware` verifies the user is logged in.
// 2. `checkRole('TA')` verifies the logged-in user has the 'TA' role.
router.get('/dashboard', authMiddleware, checkRole('TA'), getDashboardData);

module.exports = router;