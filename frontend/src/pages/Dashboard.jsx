
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./Dashboard.css";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "align",
  "blockquote",
  "code-block",
  "link",
];

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getNotes();

      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load notes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const openCreateEditor = () => {
    setEditingNote(null);
    setTitle("");
    setContent("");
    setError("");
    setShowEditor(true);
  };

  const openEditEditor = (note) => {
    setEditingNote(note);
    setTitle(note.title || "");
    setContent(note.content || "");
    setError("");
    setShowEditor(true);
  };

  const closeEditor = () => {
    if (saving) return;

    setShowEditor(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
    setError("");
  };

  const getPlainText = (html) => {
    const temp = document.createElement("div");
    temp.innerHTML = html || "";

    return (temp.textContent || temp.innerText || "")
      .replace(/\u00a0/g, " ")
      .trim();
  };

  const handleSave = async (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const plainContent = getPlainText(content);

    if (!trimmedTitle || !plainContent) {
      setError("Title and content are required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const noteData = {
        title: trimmedTitle,
        content,
      };

      if (editingNote) {
        const response = await updateNote(
          editingNote._id,
          noteData
        );

        const updatedNote = response.note;

        setNotes((currentNotes) =>
          currentNotes.map((note) =>
            note._id === editingNote._id
              ? updatedNote
              : note
          )
        );
      } else {
        const response = await createNote(noteData);

        const newNote = response.note;

        setNotes((currentNotes) => [
          newNote,
          ...currentNotes,
        ]);
      }

      setShowEditor(false);
      setEditingNote(null);
      setTitle("");
      setContent("");
      setError("");
    } catch (err) {
      setError(err.message || "Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteNote(id);

      setNotes((currentNotes) =>
        currentNotes.filter((note) => note._id !== id)
      );
    } catch (err) {
      setError(err.message || "Failed to delete note.");
    }
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-logo">N</div>

          <div>
            <h2>Notes</h2>
            <span>Personal Workspace</span>
          </div>
        </div>

        <button
          type="button"
          className="dashboard-logout"
          onClick={onLogout}
        >
          <span>↪</span>
          Logout
        </button>
      </header>

      <main className="dashboard-content">
        <section className="welcome-section">
          <div>
            <span className="welcome-label">
              DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              <span>{user?.name || "User"}</span>
            </h1>

            <p>
              Your personal space for capturing ideas,
              organizing thoughts, and keeping your
              notes in one place.
            </p>
          </div>

          <div className="welcome-logo">N</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">Notes</div>

            <div>
              <span>Total Notes</span>
              <strong>{notes.length}</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">Secure</div>

            <div>
              <span>Authorization</span>
              <strong>Active</strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✓</div>

            <div>
              <span>Account</span>
              <strong>Active</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-box">
            <div className="box-title">
              <div>
                <h2>Your Profile</h2>
                <p>Account information</p>
              </div>
            </div>

            <div className="profile-row">
              <span>Name</span>
              <strong>{user?.name || "User"}</strong>
            </div>

            <div className="profile-row">
              <span>Email</span>
              <strong>
                {user?.email || "Not available"}
              </strong>
            </div>

            <div className="profile-row">
              <span>Status</span>
              <strong className="active">
                Authenticated
              </strong>
            </div>
          </div>

          <div className="dashboard-box">
            <div className="box-title">
              <div>
                <h2>My Notes</h2>
                <p>Your notes workspace</p>
              </div>

              <button
                type="button"
                className="create-note-button"
                onClick={openCreateEditor}
              >
                + Create Note
              </button>
            </div>

            {error && !showEditor && (
              <p className="note-error">{error}</p>
            )}

            {loading ? (
              <div className="empty-state">
                <h3>Loading notes...</h3>
              </div>
            ) : notes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">+</div>

                <h3>No notes yet</h3>

                <p>
                  Create your first note to get started.
                </p>

                <button
                  type="button"
                  className="create-note-button"
                  onClick={openCreateEditor}
                >
                  Create Note
                </button>
              </div>
            ) : (
              <div className="notes-list">
                {notes.map((note) => (
                  <article
                    className="note-card"
                    key={note._id}
                  >
                    <div className="note-content">
                      <h3>{note.title}</h3>

                      <div
                        className="note-preview"
                        dangerouslySetInnerHTML={{
                          __html: note.content || "",
                        }}
                      />
                    </div>

                    <div className="note-actions">
                      <button
                        type="button"
                        className="edit-note-button"
                        onClick={() =>
                          openEditEditor(note)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-note-button"
                        onClick={() =>
                          handleDelete(note._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="security-banner">
          <div>
            <strong>
              Authentication & Authorization
            </strong>

            <p>
              You are securely logged in using your JWT
              authentication token.
            </p>
          </div>

          <span>SECURE</span>
        </div>
      </main>

      {showEditor && (
        <div className="note-modal-overlay">
          <div className="note-modal">
            <div className="note-modal-header">
              <h2>
                {editingNote ? "Edit Note" : "Create Note"}
              </h2>

              <button
                type="button"
                className="note-close-button"
                onClick={closeEditor}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="note-form"
            >
              <label htmlFor="note-title">
                Title
              </label>

              <input
                id="note-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Enter note title"
                disabled={saving}
              />

              <label>Content</label>

              <div className="rich-text-editor">
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Write your note here..."
                  readOnly={saving}
                />
              </div>

              {error && (
                <p className="note-error">{error}</p>
              )}

              <div className="note-modal-actions">
                <button
                  type="button"
                  className="cancel-note-button"
                  onClick={closeEditor}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-note-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingNote
                      ? "Update Note"
                      : "Save Note"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;