
const express = require("express");

const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/noteController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// All note routes require authentication
router.use(authMiddleware);

// Create note
router.post("/", createNote);

// Get all user's notes
router.get("/", getNotes);

// Get one note
router.get("/:id", getNoteById);

// Update note
router.put("/:id", updateNote);

// Delete note
router.delete("/:id", deleteNote);

module.exports = router;