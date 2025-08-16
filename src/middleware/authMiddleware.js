// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const prisma = new PrismaClient(); // Initialize Prisma Client

const authMiddleware = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization failed: No token provided." });
        }

        const token = authorization.split(" ")[1];

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Find the user in the database using Prisma
        const user = await prisma.user.findUnique({
            where: {
                id: decodedToken.userId 
            }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        // Attach the user object to the request
        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({ message: "Authorization failed: Invalid token." });
    }
};

module.exports = { authMiddleware };