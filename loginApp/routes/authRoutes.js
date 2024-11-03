// routes/authRoutes.js
const express = require("express");
const path = require("path");
const authController = require("../controllers/authController");

// Middleware for authentication
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  return res.redirect("/access-denied.html");
};

const router = express.Router();

// Define routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/getUser", authController.getUser);
router.get("/welcome.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "welcome.html"));
});

module.exports = router;
