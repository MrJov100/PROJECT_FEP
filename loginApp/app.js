const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const db = require("./models");
const authRoutes = require("./routes/authRoutes");

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

// Sync database
db.sequelize.sync().then(() => {
  console.log("Database synced.");
});

// Use the routes defined in authRoutes
app.use(authRoutes);

// Default route to redirect to login page
app.get("/", (req, res) => {
  res.redirect("/login.html");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
