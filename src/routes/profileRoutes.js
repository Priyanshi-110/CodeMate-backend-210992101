const express = require("express");
const { addProfileDetails, getProfileDetails, updateProfileDetails } = require("../controllers/profilecontroller"); // Fixed: "controllers"
const { authMiddleware } = require("../middleware/authMiddleware"); // Fixed: "middleware"


const router = express.Router();

router.get("/", authMiddleware,getProfileDetails)
router.post("/",authMiddleware,addProfileDetails)
router.put("/",authMiddleware,updateProfileDetails)







module.exports = router;