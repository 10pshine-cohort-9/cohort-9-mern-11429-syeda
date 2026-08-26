

import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
} from "@testing-library/react";
import "@testing-library/jest-dom";

import Dashboard from "../pages/Dashboard";

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";

jest.mock("../services/noteService", () => ({
  getNotes: jest.fn(),
  createNote: jest.fn(),
  updateNote: jest.fn(),
  deleteNote: jest.fn(),
}));

jest.mock("react-quill-new", () => {
  return function MockReactQuill({ value, onChange }) {
    return (
      <textarea
        aria-label="Content"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  };
});

describe("Dashboard", () => {
  const user = {
    name: "Noor",
    email: "noor@example.com",
  };

  const notes = [
    {
      _id: "1",
      title: "First Note",
      content: "<p>Hello world</p>",
    },
    {
      _id: "2",
      title: "Second Note",
      content: "<p>Second content</p>",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    getNotes.mockResolvedValue(notes);

    window.confirm = jest.fn(() => true);
  });

  // ========================================
  // USER INFORMATION
  // ========================================

  test("should display user information", async () => {
    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    expect(
      screen.getByRole("heading", {
        name: /Welcome back,\s*Noor/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("noor@example.com")
    ).toBeInTheDocument();
  });

  // ========================================
  // LOAD NOTES
  // ========================================

  test("should load and display notes", async () => {
    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    expect(
      screen.getByText("Loading notes...")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("First Note")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText("Second Note")
    ).toBeInTheDocument();

    expect(getNotes).toHaveBeenCalledTimes(1);
  });

  // ========================================
  // EMPTY NOTES
  // ========================================

  test("should display no notes message when there are no notes", async () => {
    getNotes.mockResolvedValueOnce([]);

    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("No notes yet")
      ).toBeInTheDocument();
    });
  });

  // ========================================
  // OPEN CREATE EDITOR
  // ========================================

  test("should open create note editor", async () => {
    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("First Note")
      ).toBeInTheDocument();
    });

    const createButton = screen.getByRole("button", {
      name: /Create Note/i,
    });

    fireEvent.click(createButton);

    expect(
      screen.getByRole("heading", {
        name: "Create Note",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("Enter note title")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Content")
    ).toBeInTheDocument();
  });

  // ========================================
  // VALIDATION
  // ========================================

  test("should show validation error when title or content is empty", async () => {
    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("First Note")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Create Note/i,
      })
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    expect(
      screen.getByText("Title and content are required.")
    ).toBeInTheDocument();

    expect(createNote).not.toHaveBeenCalled();
  });

  // ========================================
  // CREATE NOTE
  // ========================================

  test("should create a new note", async () => {
    const newNote = {
      _id: "3",
      title: "New Note",
      content: "<p>New content</p>",
    };

    createNote.mockResolvedValueOnce({
      note: newNote,
    });

    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("First Note")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Create Note/i,
      })
    );

    fireEvent.change(
      screen.getByPlaceholderText("Enter note title"),
      {
        target: {
          value: "New Note",
        },
      }
    );

    fireEvent.change(
      screen.getByLabelText("Content"),
      {
        target: {
          value: "<p>New content</p>",
        },
      }
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: "Save Note",
      })
    );

    await waitFor(() => {
      expect(
        screen.getByText("New Note")
      ).toBeInTheDocument();
    });

    expect(createNote).toHaveBeenCalledWith({
      title: "New Note",
      content: "<p>New content</p>",
    });
  });

  // ========================================
  // LOGOUT
  // ========================================

  test("should call logout when logout button is clicked", async () => {
    const onLogout = jest.fn();

    render(
      <Dashboard
        user={user}
        onLogout={onLogout}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("First Note")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /Logout/i,
      })
    );

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  // ========================================
  // DELETE NOTE
  // ========================================

  test("should delete a note after confirmation", async () => {
    window.confirm = jest.fn(() => true);

    deleteNote.mockResolvedValueOnce({
      message: "Note deleted successfully",
    });

    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("First Note")
      ).toBeInTheDocument();
    });

    const deleteButtons =
      screen.getAllByRole("button", {
        name: "Delete",
      });

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith("1");
    });

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this note?"
    );

    expect(
      screen.queryByText("First Note")
    ).not.toBeInTheDocument();
  });

  // ========================================
  // DELETE CANCEL
  // ========================================

  test("should not delete note when confirmation is rejected", async () => {
    window.confirm = jest.fn(() => false);

    render(
      <Dashboard
        user={user}
        onLogout={jest.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText("First Note")
      ).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getAllByRole("button", {
        name: "Delete",
      })[0]
    );

    expect(window.confirm).toHaveBeenCalledWith(
      "Are you sure you want to delete this note?"
    );

    expect(deleteNote).not.toHaveBeenCalled();

    expect(
      screen.getByText("First Note")
    ).toBeInTheDocument();
  });
});

