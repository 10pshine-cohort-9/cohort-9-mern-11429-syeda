
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/noteService";

describe("Note Service", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("token", "test-token");

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getNotes", () => {
    test("should return notes successfully", async () => {
      const notes = [
        {
          _id: "1",
          title: "First Note",
          content: "Hello",
        },
        {
          _id: "2",
          title: "Second Note",
          content: "World",
        },
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          notes,
        }),
      });

      const result = await getNotes();

      expect(result).toEqual(notes);
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    test("should return empty array when notes are missing", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      const result = await getNotes();

      expect(result).toEqual([]);
    });

    test("should throw error when request fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Unauthorized",
        }),
      });

      await expect(getNotes()).rejects.toThrow("Unauthorized");
    });
  });

  describe("createNote", () => {
    test("should create a note successfully", async () => {
      const note = {
        _id: "1",
        title: "My Note",
        content: "My content",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          note,
        }),
      });

      const result = await createNote({
        title: "  My Note  ",
        content: "My content",
      });

      expect(result).toEqual({
        note,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/notes"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            title: "My Note",
            content: "My content",
          }),
        })
      );
    });

    test("should throw error when create request fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Failed to create note",
        }),
      });

      await expect(
        createNote({
          title: "Test",
          content: "Content",
        })
      ).rejects.toThrow("Failed to create note");
    });
  });

  describe("updateNote", () => {
    test("should update a note successfully", async () => {
      const updatedNote = {
        _id: "123",
        title: "Updated Note",
        content: "Updated content",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          note: updatedNote,
        }),
      });

      const result = await updateNote("123", {
        title: "Updated Note",
        content: "Updated content",
      });

      expect(result).toEqual({
        note: updatedNote,
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/notes/123"),
        expect.objectContaining({
          method: "PUT",
        })
      );
    });

    test("should throw error when update request fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Failed to update note",
        }),
      });

      await expect(
        updateNote("123", {
          title: "Updated",
          content: "Content",
        })
      ).rejects.toThrow("Failed to update note");
    });
  });

  describe("deleteNote", () => {
    test("should delete a note successfully", async () => {
      const responseData = {
        message: "Note deleted successfully",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => responseData,
      });

      const result = await deleteNote("123");

      expect(result).toEqual(responseData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/notes/123"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });

    test("should throw error when delete request fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Failed to delete note",
        }),
      });

      await expect(deleteNote("123")).rejects.toThrow(
        "Failed to delete note"
      );
    });
  });
});