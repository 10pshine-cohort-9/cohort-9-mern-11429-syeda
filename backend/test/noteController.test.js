
const { expect } = require("chai");
const sinon = require("sinon");

const Note = require("../src/models/Note");
const noteController = require("../src/controllers/noteController");

describe("Note Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("getNotes", () => {
    it("should return notes successfully", async () => {
      const notes = [
        {
          _id: "1",
          title: "Test Note",
          content: "Test content",
        },
      ];

      sinon.stub(Note, "find").resolves(notes);

      const req = {
        user: "test-user-id",
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await noteController.getNotes(req, res);

      expect(res.status.called).to.equal(true);
      expect(res.json.called).to.equal(true);
    });
  });

  describe("createNote", () => {
    it("should create a note", async () => {
      const savedNote = {
        _id: "123",
        title: "New Note",
        content: "New content",
        user: "test-user-id",
      };

      sinon.stub(Note.prototype, "save").resolves(savedNote);

      const req = {
        body: {
          title: "New Note",
          content: "New content",
        },
        user: "test-user-id",
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await noteController.createNote(req, res);

      expect(res.status.called).to.equal(true);
      expect(res.json.called).to.equal(true);
    });
  });

  describe("deleteNote", () => {
    it("should handle deleting a note", async () => {
      sinon.stub(Note, "findOneAndDelete").resolves({
        _id: "123",
        title: "Deleted Note",
      });

      const req = {
        params: {
          id: "123",
        },
        user: "test-user-id",
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await noteController.deleteNote(req, res);

      expect(res.status.called).to.equal(true);
      expect(res.json.called).to.equal(true);
    });
  });
});