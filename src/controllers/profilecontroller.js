// src/controllers/profileController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This function now gets the logged-in user's profile
const getProfileDetails = async (req, res) => {
    try {
        const profile = await prisma.profile.findUnique({
            where: { userId: req.user.id } // Assumes your middleware adds 'req.user'
        });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found for this user." });
        }

        res.status(200).json({
            message: "Profile data fetched",
            data: profile
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const addProfileDetails = async (req, res) => {
    const { profileImg, experience, githubProfile, linkedinProfile, codingPlatform, skills, location, achievements } = req.body;
    const userId = req.user.id; // Get userId from your auth middleware

    // ... (you can add validation here if you want)

    try {
        const existingProfile = await prisma.profile.findUnique({ where: { userId } });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists for this user." });
        }

        const newProfile = await prisma.profile.create({
            data: {
                profileImg, experience, githubProfile, linkedinProfile, 
                codingPlatform, skills, location, achievements,
                userId: userId // Link the profile to the user
            }
        });

        return res.status(201).json({
            message: "Profile created successfully",
            data: newProfile
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfileDetails = async (req, res) => {
    try {
        const updatedProfile = await prisma.profile.update({
            where: { userId: req.user.id },
            data: req.body // Prisma automatically updates only the fields provided
        });

        return res.status(200).json({
            message: "Profile updated successfully",
            data: updatedProfile
        });
    } catch (err) {
        // Prisma throws a specific error if the record to update is not found
        if (err.code === 'P2025') {
            return res.status(404).json({ message: "Profile not found to update." });
        }
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getProfileDetails, addProfileDetails, updateProfileDetails };