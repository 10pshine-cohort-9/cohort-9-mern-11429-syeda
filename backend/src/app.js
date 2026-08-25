
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const noteRoutes = require("./routes/noteRoutes");

const app = express();

// =========================
// CORS CONFIGURATION
// =========================

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin
      // (Postman, server-to-server, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// =========================
// MIDDLEWARE
// =========================

app.use(express.json());

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "Notes API is running",
  });
});

// =========================
// AUTHENTICATION ROUTES
// =========================

app.use("/api/auth", authRoutes);

// =========================
// NOTES ROUTES
// =========================

app.use("/api/notes", noteRoutes);

module.exports = app;