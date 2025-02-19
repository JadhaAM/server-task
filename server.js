const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: ["*"] }));

// Authentication middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin middleware
const adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};

// Routes
app.post("/login", (req, res) => {
  // Sample login logic
  const token = jwt.sign(
    { userId: 1, isAdmin: req.body.isAdmin },
    process.env.JWT_SECRET || 'your-secret-key'
  );
  res.json({ token, message: "Login successful" });
});

app.post("/signup", (req, res) => {
  res.json({ message: "Signup successful" });
});

app.post("/signout", authMiddleware, (req, res) => {
  res.json({ message: "Signout successful" });
});

app.get("/user", authMiddleware, (req, res) => {
  res.json({ message: "User data", userId: req.user.userId });
});

app.get("/admin", authMiddleware, adminMiddleware, (req, res) => {
  res.json({ message: "Admin data" });
});

app.get("/home", (req, res) => {
  res.json({ message: "Welcome to Home Page" });
});

app.get("/about", (req, res) => {
  res.json({ message: "About us" });
});

app.get("/news", (req, res) => {
  res.json({ message: "Latest news" });
});

app.get("/blogs", (req, res) => {
  res.json({ message: "Blogs list" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));