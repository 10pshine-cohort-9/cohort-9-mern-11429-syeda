
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Allow frontend to communicate with backend
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

// Parse JSON request bodies
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Notes API is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

module.exports = app;