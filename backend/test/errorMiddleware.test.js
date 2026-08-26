
const { expect } = require("chai");
const sinon = require("sinon");

const errorMiddleware = require("../src/middleware/errorMiddleware");

describe("Global Error Middleware", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should return a 500 status for an unhandled error", () => {
    const error = new Error("Something went wrong");

    const req = {
      method: "GET",
      originalUrl: "/test",
      user: null,
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const next = sinon.spy();

    errorMiddleware(error, req, res, next);

    expect(res.status.calledWith(500)).to.equal(true);
    expect(res.json.calledOnce).to.equal(true);

    const response = res.json.firstCall.args[0];

    expect(response.success).to.equal(false);
    expect(response.message).to.equal("Internal server error");

    expect(next.called).to.equal(false);
  });

  it("should return a meaningful error message", () => {
    const error = new Error("Database error");
    error.statusCode = 400;

    const req = {
      method: "POST",
      originalUrl: "/api/test",
      user: "507f1f77bcf86cd799439011",
    };

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    const next = sinon.spy();

    errorMiddleware(error, req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(res.json.calledOnce).to.equal(true);

    const response = res.json.firstCall.args[0];

    expect(response.success).to.equal(false);
    expect(response.message).to.equal("Database error");

    expect(next.called).to.equal(false);
  });
});