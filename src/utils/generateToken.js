// src/utils/generateToken.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { userId: user.id, emailId: user.emailId }, // Payload
        process.env.JWT_SECRET_KEY, // Your secret key from .env
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};

module.exports = generateToken;