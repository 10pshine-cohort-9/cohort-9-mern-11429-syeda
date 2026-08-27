
import {
  signupUser,
  loginUser,
  getToken,
  getStoredUser,
  isAuthenticated,
  logoutUser,
} from "../services/authService";

describe("Auth Service", () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("signupUser", () => {
    test("should signup successfully and store token and user", async () => {
      const mockResponse = {
        token: "test-token",
        user: {
          id: "123",
          name: "Noor",
          email: "noor@example.com",
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await signupUser({
        name: "  Noor  ",
        email: "  noor@example.com  ",
        password: "password123",
      });

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5000/api/auth/signup",
        expect.objectContaining({
          method: "POST",
        })
      );

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem("token")).toBe("test-token");

      expect(JSON.parse(localStorage.getItem("user"))).toEqual(
        mockResponse.user
      );
    });

    test("should throw error when signup fails", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Email already exists",
        }),
      });

      await expect(
        signupUser({
          name: "Noor",
          email: "noor@example.com",
          password: "password123",
        })
      ).rejects.toThrow("Email already exists");
    });

    test("should throw error when signup token is missing", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: {
            name: "Noor",
          },
        }),
      });

      await expect(
        signupUser({
          name: "Noor",
          email: "noor@example.com",
          password: "password123",
        })
      ).rejects.toThrow(
        "Account created, but authentication token was not received."
      );
    });
  });

  describe("loginUser", () => {
    test("should login successfully and store token and user", async () => {
      const mockResponse = {
        token: "login-token",
        user: {
          id: "123",
          name: "Noor",
          email: "noor@example.com",
        },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await loginUser({
        email: "  noor@example.com  ",
        password: "password123",
      });

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem("token")).toBe("login-token");

      expect(JSON.parse(localStorage.getItem("user"))).toEqual(
        mockResponse.user
      );
    });

    test("should throw error for invalid login", async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: "Invalid email or password",
        }),
      });

      await expect(
        loginUser({
          email: "wrong@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("Invalid email or password");
    });

    test("should throw error when login token is missing", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: {
            name: "Noor",
          },
        }),
      });

      await expect(
        loginUser({
          email: "noor@example.com",
          password: "password123",
        })
      ).rejects.toThrow(
        "Login successful but token was not received"
      );
    });
  });

  describe("getToken", () => {
    test("should return stored token", () => {
      localStorage.setItem("token", "abc123");

      expect(getToken()).toBe("abc123");
    });

    test("should return null when token does not exist", () => {
      expect(getToken()).toBeNull();
    });
  });

  describe("getStoredUser", () => {
    test("should return stored user", () => {
      const user = {
        name: "Noor",
        email: "noor@example.com",
      };

      localStorage.setItem("user", JSON.stringify(user));

      expect(getStoredUser()).toEqual(user);
    });

    test("should return null when no user is stored", () => {
      expect(getStoredUser()).toBeNull();
    });

    test("should remove invalid user data and return null", () => {
      localStorage.setItem("user", "invalid-json");

      expect(getStoredUser()).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    test("should return true when token exists", () => {
      localStorage.setItem("token", "abc123");

      expect(isAuthenticated()).toBe(true);
    });

    test("should return false when token does not exist", () => {
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("logoutUser", () => {
    test("should remove token and user", () => {
      localStorage.setItem("token", "abc123");

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: "Noor",
        })
      );

      logoutUser();

      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });
});