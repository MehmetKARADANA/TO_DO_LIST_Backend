const express = require("express");
const router = express.Router();
const { protect } = require("./authMiddleware");
const {
  registerUser,
  loginUser,
  getLoggedInUser,
} = require("./userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getLoggedInUser); 

module.exports = router;