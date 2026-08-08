const express = require("express");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route — requires valid JWT token
router.get("/profile", verifyToken, (req, res) => {
    res.json({
        message: "Profile accessed successfully",
        user: req.user
    });
});

module.exports = router;