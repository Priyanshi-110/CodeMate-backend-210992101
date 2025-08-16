// src/controllers/userController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken"); // Make sure this path is correct

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !emailId || !password) {
    return res.status(400).json({ message: "Please Add all mandatory fields" });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { emailId } });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        emailId,
        password: hashedPassword,
      }
    });

    const tokenGen = generateToken(newUser); // This function needs the user object

    return res.status(201).json({
      message: "User Registered Successfully",
      data: {
        id: newUser.id,
        firstName: newUser.firstName,
        emailId: newUser.emailId,
        token: tokenGen
      },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  const { emailId, password } = req.body;

  if (!emailId || !password) {
    return res.status(400).json({ message: "Please Fill All the Details" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { emailId } });
    if (!user) {
      return res.status(404).json({ message: "User not found !!" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const tokenGen = generateToken(user);

    return res.status(200).json({
      message: "User Logged In Successfully",
      data: {
        userName: user.firstName,
        emailId: user.emailId,
        token: tokenGen
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };