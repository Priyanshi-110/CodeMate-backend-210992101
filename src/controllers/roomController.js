const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createRoom = async (req, res) => {
    try {
        // Create a new entry in the SessionRoom table
        const newRoom = await prisma.sessionRoom.create({
            data: {}, // Prisma automatically generates the unique ID
        });

        // Send back the new room's unique ID
        res.status(201).json({ 
            message: 'Room created successfully!', 
            roomId: newRoom.id 
        });
    } catch (error) {
        res.status(500).json({ error: 'Could not create room.' });
    }
};