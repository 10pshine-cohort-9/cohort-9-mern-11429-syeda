
const logger = require("../config/logger");

const errorMiddleware = (err, req, res, next) => {
  logger.error(
    {
      err,
      method: req.method,
      url: req.originalUrl,
      userId: req.user || null,
    },
    "Unhandled application error"
  );

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Something went wrong",
  });
};

module.exports = errorMiddleware;