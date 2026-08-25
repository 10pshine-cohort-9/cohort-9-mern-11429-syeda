
const express = require("express");
const cors = require("cors");
const pinoHttp = require("pino-http");

const logger = require("./config/logger");
const errorMiddleware = require("./middleware/errorMiddleware");

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
// LOGGER
// =========================

app.use(
  pinoHttp({
    logger,
  })
);

// =========================
// BODY PARSER
// =========================

app.use(express.json());

// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  req.log.info("Health check requested");

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

// =========================
// 404 HANDLER
// =========================

app.use((req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
});

// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use(errorMiddleware);

// =========================
// EXPORT APP
// =========================

module.exports = app;