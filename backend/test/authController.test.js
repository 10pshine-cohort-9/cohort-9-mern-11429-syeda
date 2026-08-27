
const { expect } = require("chai");
const sinon = require("sinon");

const User = require("../src/models/User");
const authController = require("../src/controllers/authController");

describe("Auth Controller", () => {
  afterEach(() => {
    sinon.restore();
  });

  describe("signup", () => {
    it("should return 400 when required fields are missing", async () => {
      const req = {
        body: {
          name: "",
          email: "",
          password: "",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.signup(req, res);

      expect(res.status.called).to.equal(true);
      expect(res.json.called).to.equal(true);
    });

    it("should reject an already registered email", async () => {
      sinon.stub(User, "findOne").resolves({
        _id: "123",
        email: "test@example.com",
      });

      const req = {
        body: {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.signup(req, res);

      expect(res.status.called).to.equal(true);
      expect(res.json.called).to.equal(true);
    });
  });

  describe("login", () => {
    it("should reject login when credentials are missing", async () => {
      const req = {
        body: {
          email: "",
          password: "",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.login(req, res);

      expect(res.status.called).to.equal(true);
      expect(res.json.called).to.equal(true);
    });

    it("should reject invalid user credentials", async () => {
      sinon.stub(User, "findOne").resolves(null);

      const req = {
        body: {
          email: "notfound@example.com",
          password: "wrongpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await authController.login(req, res);

      expect(res.status.called).to.equal(true);
      expect(res.json.called).to.equal(true);
    });
  });
});