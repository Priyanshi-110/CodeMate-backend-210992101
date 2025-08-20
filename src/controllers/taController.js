const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Controller to fetch data for the TA dashboard.
 * Currently, it fetches a list of all session rooms.
 */
const getDashboardData = async (req, res) => {
  try {
    // Fetch all rooms, showing the newest ones first.
    // We select only the fields needed for the dashboard view.
    const allRooms = await prisma.sessionRoom.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        handRaised: true, // Show if a hand is raised in a room
      },
    });

    res.status(200).json(allRooms);
  } catch (error) {
    console.error('Error fetching TA dashboard data:', error);
    res.status(500).json({ message: 'Server error while fetching dashboard data.' });
  }
};

module.exports = {
  getDashboardData,
};