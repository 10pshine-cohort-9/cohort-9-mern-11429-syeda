
require("dotenv").config();

const { expect } = require("chai");
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../src/middleware/authMiddleware");

describe("Authentication Middleware", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should reject a request without an authorization token", () => {
    const req = {
      headers: {},
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const next = sinon.spy();

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.equal(true);
    expect(res.json.calledOnce).to.equal(true);
    expect(next.called).to.equal(false);
  });

  it("should reject an invalid token", () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const next = sinon.spy();

    authMiddleware(req, res, next);

    expect(res.status.calledWith(401)).to.equal(true);
    expect(res.json.calledOnce).to.equal(true);
    expect(next.called).to.equal(false);
  });

  it("should accept a valid token", () => {
    const userId = "507f1f77bcf86cd799439011";

    const token = jwt.sign(
      { userId },
      process.env.JWT_SECRET
    );

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const next = sinon.spy();

    authMiddleware(req, res, next);

    expect(next.calledOnce).to.equal(true);
    expect(req.user).to.equal(userId);
    expect(res.status.called).to.equal(false);
    expect(res.json.called).to.equal(false);
  });
});