
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

// =========================
// CORS
// =========================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5174",
    ],
    credentials: true,
  })
);

// =========================
// Middleware
// =========================
app.use(express.json());

// =========================
// Health check
// =========================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Notes API is running",
  });
});

// =========================
// Authentication routes
// =========================
app.use("/api/auth", authRoutes);

// =========================
// Notes routes
// =========================
console.log("✅ Registering /api/notes routes");

app.use("/api/notes", noteRoutes);

// =========================
// 404 handler
// =========================
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// =========================
// Global error handler
// =========================
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;