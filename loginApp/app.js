const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const path = require("path");

const db = require("./models");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secret_key",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.static("public"));

db.sequelize.sync().then(() => {
  console.log("Database synced.");
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next(); // User is authenticated
  }
  // Redirect to login page if not authenticated
  return res.redirect("/login.html"); // Redirect to login page
};

// Routes
app.post("/signup", async (req, res) => {
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
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await db.users.findOne({ where: { email } });
  if (!user) return res.status(400).send("User tidak ditemukan.");
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return res.status(400).send("Password salah.");

  req.session.user = { name: user.name, email: user.email }; // Set user session
  console.log("User logged in:", req.session.user); // Log user session
  res.redirect("/welcome.html"); // Redirect to welcome.html on successful login
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Gagal logout.");
    res.redirect("/login.html"); // Redirect to login page after logout
  });
});

// Route to serve welcome page
app.get("/welcome.html", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html")); // Send welcome.html
});

// Route to get user data
app.get("/getUser", (req, res) => {
  if (req.session.user) {
    res.json({ name: req.session.user.name }); // Send user's name
  } else {
    res.status(401).json({ error: "User not logged in" }); // User not logged in
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Redirect to login page
app.get("/", (req, res) => {
  res.redirect("/login.html"); // Redirect to login or signup
});
