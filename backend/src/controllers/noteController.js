
const Note = require("../models/Note");

// Create a note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title,
      content,
      user: req.user,
    });

    res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      message: "Failed to create note",
    });
  }
};


// Get all notes for logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};


// Get a single note
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      note,
    });
  } catch (error) {
    console.error("Get note error:", error);

    res.status(500).json({
      message: "Failed to fetch note",
    });
  }
};


// Update a note
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user,
      },
      {
        title,
        content,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      message: "Failed to update note",
    });
  }
};


// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      message: "Failed to delete note",
    });
  }
};


module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};