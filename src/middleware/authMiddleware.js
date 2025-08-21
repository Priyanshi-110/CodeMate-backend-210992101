// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization failed: No token provided." });
        }

        const token = authorization.split(" ")[1];

        // Change 1: Use the new secret key name 'JWT_SECRET'
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); 
        
        // Change 2: Use 'id' instead of 'userId' to match the new token payload
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.id 
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        // Security Best Practice: Remove password from the user object
        delete user.password;
        
        req.user = user;
        next();

    } catch (error) {
        res.status(401).json({ message: "Authorization failed: Invalid token." });
    }
};

module.exports = { authMiddleware };