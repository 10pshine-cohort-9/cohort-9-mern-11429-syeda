
import { useEffect, useState } from "react";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";

import "./Dashboard.css";

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =========================
     LOAD NOTES
  ========================= */

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoadingNotes(true);
      setError("");

      const data = await getNotes();

      setNotes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LOAD NOTES ERROR:", error);
      setError(error.message || "Failed to load notes");
    } finally {
      setLoadingNotes(false);
    }
  };

  /* =========================
     CREATE / UPDATE NOTE
  ========================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle || !cleanContent) {
      setError("Title and content are required.");
      return;
    }

    try {
      setLoading(true);

      /* UPDATE */
      if (editingId) {
        const updatedNote = await updateNote(
          editingId,
          cleanTitle,
          cleanContent
        );

        setNotes((currentNotes) =>
          currentNotes.map((note) =>
            note._id === editingId ? updatedNote : note
          )
        );

        setMessage("Note updated successfully.");
      }

      /* CREATE */
      else {
        const newNote = await createNote(
          cleanTitle,
          cleanContent
        );

        setNotes((currentNotes) => [
          newNote,
          ...currentNotes,
        ]);

        setMessage("Note created successfully.");
      }

      setTitle("");
      setContent("");
      setEditingId(null);
    } catch (error) {
      console.error("SAVE NOTE ERROR:", error);

      setError(
        error.message || "Failed to save note"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     EDIT NOTE
  ========================= */

  const handleEdit = (note) => {
    setEditingId(note._id);

    setTitle(note.title);
    setContent(note.content);

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     DELETE NOTE
  ========================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setMessage("");
      setError("");

      await deleteNote(id);

      setNotes((currentNotes) =>
        currentNotes.filter(
          (note) => note._id !== id
        )
      );

      setMessage("Note deleted successfully.");
    } catch (error) {
      console.error("DELETE NOTE ERROR:", error);

      setError(
        error.message || "Failed to delete note"
      );
    }
  };

  /* =========================
     CANCEL EDIT
  ========================= */

  const handleCancel = () => {
    setEditingId(null);

    setTitle("");
    setContent("");

    setMessage("");
    setError("");
  };

  /* =========================
     LOGOUT
  ========================= */

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="dashboard-navbar">
  <div className="dashboard-brand">
    <div className="dashboard-logo">
      N
    </div>

    <div>
      <h2>Notes</h2>
      <span>Personal Workspace</span>
    </div>
  </div>

  <button
    type="button"
    className="logout-button"
    onClick={handleLogout}
  >
    Logout
  </button>
</header>


      {/* =========================
          MAIN
      ========================= */}

      <main className="dashboard-container">


        {/* =========================
            WELCOME
        ========================= */}

        <section className="dashboard-hero">

          <div>

            <span className="dashboard-label">
              DASHBOARD
            </span>

            <h1>
              Welcome back,{" "}
              <span className="highlight">
                {user?.name || "User"}
              </span>
            </h1>

            <p>
              Manage your personal notes in
              one secure workspace.
            </p>

          </div>

          <div className="hero-icon">
            N
          </div>

        </section>


        {/* =========================
            MESSAGES
        ========================= */}

        {error && (
          <div className="dashboard-message error-message">
            {error}
          </div>
        )}

        {message && (
          <div className="dashboard-message success-message">
            {message}
          </div>
        )}


        {/* =========================
            STATS
        ========================= */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon">
              N
            </div>

            <div>
              <span>Total Notes</span>

              <strong>
                {notes.length}
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              ✓
            </div>

            <div>
              <span>Account</span>

              <strong>
                Active
              </strong>
            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon">
              🔒
            </div>

            <div>
              <span>Security</span>

              <strong>
                Protected
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            CREATE / EDIT NOTE
        ========================= */}

        <section className="dashboard-card note-editor">

          <div className="section-heading">

            <div className="title-icon">
              {editingId ? "✎" : "+"}
            </div>

            <div>

              <h2>
                {editingId
                  ? "Edit Note"
                  : "Create a Note"}
              </h2>

              <p>
                {editingId
                  ? "Update your existing note"
                  : "Add a new note to your workspace"}
              </p>

            </div>

          </div>


          <form onSubmit={handleSubmit}>

            {/* TITLE */}

            <input
              type="text"
              value={title}
              placeholder="Note title"
              onChange={(event) =>
                setTitle(event.target.value)
              }
            />


            {/* CONTENT */}

            <textarea
              value={content}
              placeholder="Write your note here..."
              onChange={(event) =>
                setContent(event.target.value)
              }
            />


            {/* BUTTONS */}

            <div className="note-form-actions">

              <button
                type="submit"
                className="primary-note-button"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Note"
                  : "Create Note"}
              </button>


              {editingId && (
                <button
                  type="button"
                  className="cancel-note-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>


        {/* =========================
            MY NOTES
        ========================= */}

        <section className="dashboard-card notes-section">

          <div className="section-heading">

            <div className="title-icon">
              N
            </div>

            <div>

              <h2>
                My Notes
              </h2>

              <p>
                Your personal notes
              </p>

            </div>

          </div>


          {/* LOADING */}

          {loadingNotes && (
            <div className="notes-empty">

              <div className="empty-icon">
                ...
              </div>

              <h3>
                Loading notes...
              </h3>

              <p>
                Please wait.
              </p>

            </div>
          )}


          {/* EMPTY */}

          {!loadingNotes &&
            notes.length === 0 && (
              <div className="notes-empty">

                <div className="empty-icon">
                  +
                </div>

                <h3>
                  No notes yet
                </h3>

                <p>
                  Create your first note above.
                </p>

              </div>
            )}


          {/* NOTES */}

          {!loadingNotes &&
            notes.length > 0 && (
              <div className="notes-list">

                {notes.map((note) => (
                  <div
                    className="note-card"
                    key={note._id}
                  >

                    <div className="note-card-content">

                      <h3>
                        {note.title}
                      </h3>

                      <p>
                        {note.content}
                      </p>

                      <small>
                        {note.createdAt
                          ? new Date(
                              note.createdAt
                            ).toLocaleString()
                          : ""}
                      </small>

                    </div>


                    <div className="note-actions">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(note)
                        }
                      >
                        Edit
                      </button>


                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          handleDelete(note._id)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
};

export default Dashboard;