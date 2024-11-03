// controllers/authController.js
const bcrypt = require("bcryptjs");

// Import your database models
const db = require("../models");

// Controller for handling user signup
exports.signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).send("Password tidak sesuai!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await db.users.create({ name, email, password: hashedPassword });
    res.send("User berhasil dibuat!");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

// Controller for handling user login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.users.findOne({ where: { email } });
    if (!user) return res.status(400).send("User tidak ditemukan.");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send("Password salah.");

    req.session.user = { name: user.name, email: user.email };
    console.log("User logged in:", req.session.user);
    res.redirect("/welcome.html");
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

// Controller for handling user logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Gagal logout.");
    res.redirect("/login.html");
  });
};

// Controller for checking user session
exports.getUser = (req, res) => {
  if (req.session.user) {
    res.json({ name: req.session.user.name });
  } else {
    res.status(401).json({ error: "User not logged in" });
  }
};
