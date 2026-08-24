
const Note = require("../models/Note");

const isEmptyContent = (content) => {
  if (typeof content !== "string") {
    return true;
  }

  const text = content
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .trim();

  return text.length === 0;
};

const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    console.log("CREATE NOTE BODY:", req.body);

    if (!title || !title.trim() || isEmptyContent(content)) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content,
      user: req.user,
    });

    return res.status(201).json({
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("CREATE NOTE ERROR:", error);

    return res.status(500).json({
      message: "Failed to create note",
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      notes,
    });
  } catch (error) {
    console.error("GET NOTES ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch notes",
    });
  }
};

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

    return res.status(200).json({
      note,
    });
  } catch (error) {
    console.error("GET NOTE ERROR:", error);

    return res.status(500).json({
      message: "Failed to fetch note",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    console.log("UPDATE NOTE ID:", req.params.id);
    console.log("UPDATE NOTE BODY:", req.body);

    if (!title || !title.trim() || isEmptyContent(content)) {
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
        title: title.trim(),
        content: content,
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

    return res.status(200).json({
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("UPDATE NOTE ERROR:", error);

    return res.status(500).json({
      message: "Failed to update note",
    });
  }
};

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

    return res.status(200).json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("DELETE NOTE ERROR:", error);

    return res.status(500).json({
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
