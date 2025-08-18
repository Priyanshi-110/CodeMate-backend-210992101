// src/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
    // 1. Get the token from the request headers
    const { authorization } = req.headers;

    // 2. Check if the token exists and is in the correct format ("Bearer <token>")
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization failed: No token provided or invalid format." });
    }

    const token = authorization.split(" ")[1];

    try {
        // 3. Verify the token using the secret key
        // Note: Ensure your .env file variable name matches 'JWT_SECRET'
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Find the user from the database using the ID from the token's payload
        // Note: This assumes your generateToken function signs a payload like { id: user.id }
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id 
            }
        });

        // 5. If no user is found with that ID, the token is invalid
        if (!user) {
            return res.status(401).json({ message: "Authorization failed: User not found." });
        }
        
        // 6. IMPORTANT: Remove the password from the user object for security
        delete user.password;

        // 7. Attach the user object (without the password) to the request
        req.user = user;

        // 8. Pass control to the next middleware or controller
        next();

    } catch (error) {
        // This block will catch errors from jwt.verify (e.g., expired token, invalid signature)
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Authorization failed: Invalid or expired token." });
    }
};

module.exports = { authMiddleware };