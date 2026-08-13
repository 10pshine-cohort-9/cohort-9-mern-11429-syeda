
const express = require("express");

const {
  signup,
  login,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

console.log("signup:", signup);
console.log("login:", login);

router.post("/signup", signup);
router.post("/login", login);

// Protected route
router.get("/me", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "Authorization successful",
    userId: req.user,
  });
});

module.exports = router;